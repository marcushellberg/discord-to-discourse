# Script for importing Discord forum channel content into Discourse

This script assumes you have run the [discord-export](../discord-export/README.md) script to export data from Discord into a local database. 

**Run this script on a development server**, then move the data to your actual server using the [official instructions](https://meta.discourse.org/t/migrate-from-another-forum-to-discourse/16616).

# How to run

- Copy the `discord.rb` script into your Discord installations `script/import_scripts` folder. 
- Edit the database settings in `discord.rb` to match your settings. 
- In the Discord root directory, 
  - Run `IMPORT=1 bundle install` to install all bundles needed by the import
  - Run `IMPORT=1 bundle exec ruby script/import_scripts/discord.rb` to perform the import
- 
