# frozen_string_literal: true

require "mysql2"
require File.expand_path(File.dirname(__FILE__) + "/base.rb")

# Edit the constants and initialize method for your import data.

class ImportScripts::Discord < ImportScripts::Base
  BATCH_SIZE ||= 1000

  def initialize
    super

    # Allow larger downloads during import
    SiteSetting.max_image_size_kb = 10_240
    SiteSetting.max_attachment_size_kb = 10_240

    @client = Mysql2::Client.new(
      host: "localhost",
      username: "discord",
      password: "discord",
      database: "discord",
      encoding: "utf8mb4",
      collation: "utf8mb4_unicode_ci"
      
    )
  end

  def execute
    puts "", "Importing Discord data..."

    import_users
    import_categories
    import_discussions

    puts "", "Done"
  end

  def username_for(name)
    result = name.downcase.gsub(/[^a-z0-9\-_]/, "-")
    result = Digest::SHA1.hexdigest(name)[0...10] if result.blank?

    result
  end

  # Turn off row caching to decrease memory consumption
  def mysql_query(sql)
    @client.query(sql, cache_rows: false)
  end

  def import_users
    puts "", "Importing users"

    total_count = mysql_query("SELECT count(*) count FROM User;").first["count"]

    batches(BATCH_SIZE) do |offset|
      results = mysql_query(
        "SELECT id, displayName
        FROM User
        LIMIT #{BATCH_SIZE}
        OFFSET #{offset};")

      break if results.size < 1

      create_users(results, total: total_count, offset: offset) do |user|
        username = username_for(user["displayName"])
        {
          id: user["id"],
          email: "#{username}@discord.import",
          username: username,
          name: user["displayName"],
          created_at: Time.now,
        }
      end
    end
  end

  def import_categories
    puts "", "Importing categories"

    categories = mysql_query(
      "SELECT id, name
         FROM Category")

    create_categories(categories) do |category|
      {
        id: category["id"],
        name: category["name"],
      }
    end
  end

  def import_discussions
    puts "", "Importing discussions"
    numTopics = 0
    numPosts = 0

    batches(BATCH_SIZE) do |offset|
      topics = mysql_query(
        "SELECT id, title, created, categoryId
        FROM Topic
        ORDER BY created
        LIMIT #{BATCH_SIZE}
        OFFSET #{offset};")

      break if topics.size < 1

      # There is a mismatch between how Discord and Discourse handle threads/topics.
      # Discord's thread only contains the title, the first message is separate.
      # Discourse includes the first message in the topic.
      topics.each do |dbTopic|
        puts "", "Importing #{dbTopic["title"]}"

        posts = get_posts(dbTopic["id"])

        first_post = posts[0]
        next unless first_post

        attachments = get_attachments(first_post["id"])
        user_id = user_id_from_imported_user_id(first_post["authorId"])

        topic = {
          id: first_post["id"],
          user_id: user_id,
          raw: process_post_content(first_post["body"], attachments, user_id),
          created_at: Time.zone.at(first_post["created"]),
          title: dbTopic["title"],
          category: category_id_from_imported_category_id(dbTopic["categoryId"])
        }

        parent_post = create_post(topic, topic[:id])
        numTopics += 1

        posts[1..-1].each do |post|
          author_id = user_id_from_imported_user_id(post["authorId"])
          attachments = get_attachments(post["id"])
          create_post(
            {
              id: post["id"],
              topic_id: parent_post.topic_id,
              user_id: author_id,
              raw: process_post_content(post["body"], attachments, author_id),
              created_at: Time.zone.at(post["created"]),
            },
            post["id"]
          )
          numPosts += 1
        end
      end
    end

    puts "", "Imported #{numTopics} topics with #{numTopics + numPosts} posts."
  end

  def get_posts(topic_id)
    mysql_query(
      "SELECT id, authorId, created, body
          FROM Post
          WHERE topicId=#{topic_id}
          ORDER BY created"
    ).to_a
  end

  def get_attachments(post_id)
    mysql_query(
      "SELECT id, name, url
          FROM Attachment
          WHERE postId=#{post_id}"
    ).to_a
  end

  def process_post_content(text, attachments, user_id)

    # Map mentions
    text.gsub!(/<@(\w+)>/) do
      mentioned_user_id = $1
      username = @lookup.find_username_by_import_id(mentioned_user_id)
      username ? "@#{username}" : "`@#{mentioned_user_id}`"
    end

    # Format links
    text.gsub!(%r{<(https?://[^|]+?)\|([^>]+?)>}, '[\2](\1)')
    text.gsub!(%r{<(https?://[^>]+?)>}, '\1')

    # Add attachments
    if attachments
      attachments.each do |attachment|
        begin
          upload_markdown = download_file(attachment["url"], user_id)
          text << "\n#{upload_markdown}"
        rescue
          puts "Failed to process upload #{attachment["url"]}"
        end
      end
    end

    text
  end

  def download_file(url, user_id)
    uri = URI.parse(url)
    filename = File.basename(uri.path)

    tempfile =
      FileHelper.download(
        url,
        max_file_size: SiteSetting.max_image_size_kb.kilobytes,
        tmp_file_name: "tmp-attachment",
        follow_redirect: true,
      )

    return unless tempfile

    upload = UploadCreator.new(tempfile, filename, origin: url).create_for(user_id)
    html_for_upload(upload, filename)
  ensure
    tempfile.close! if tempfile && tempfile.respond_to?(:close!)
  end
end

ImportScripts::Discord.new.perform if __FILE__ == $0
