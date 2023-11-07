import {REST} from "@discordjs/rest";
import {API, APIThreadChannel, RESTGetAPIChannelMessagesQuery} from "@discordjs/core";
import {PrismaClient, Topic} from "@prisma/client";
import {generateRandomName} from "./awesome-animals.ts";

const prisma = new PrismaClient();
const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token) {
    console.error("DISCORD_BOT_TOKEN not provided in .env file, exiting.");
    process.exit(1);
}
if(!guildId) {
    console.error("DISCORD_GUILD_ID not provided in .env file, exiting.");
    process.exit(1);
}

const api = new API(new REST({version: "10"}).setToken(token));

/**
 * This script exports Discord forum channel data to a database
 * for importing into Discourse.
 *
 * Discord data hierarchy and corresponding database tables:
 * Guild (=Discord server)
 * - Channel -> Category
 * -- Thread -> Topic
 * --- Message -> Post
 * ---- Attachment -> Attachment
 *
 * Users are saved in a separate table and their display names are anonymized.
 */
async function exportDiscordData() {
    const startTime = Date.now();
    console.log("Exporting Discord data...");
    await exportChannels();
    await exportThreads();
    await exportMessages();
    await anonymizeUsers();
    console.log(`Finished exporting Discord data in ${(Date.now() - startTime) / 1000}s.`);
}

async function exportChannels() {
    console.log("Exporting all forum channels...");
    const channels = await api.guilds.getChannels(guildId!);
    const forumChannels = channels.filter((channel) => channel.type === 15);
    await prisma.category.createMany({
        data: forumChannels.map((channel) => ({
            id: channel.id,
            name: channel.name!,
        })),
        skipDuplicates: true,
    });

    console.log(`Exported ${forumChannels.length} channels.`);
}

async function exportThreads() {
    console.log("Exporting threads...");
    let totalThreads = 0;
    const categories = await prisma.category.findMany();

    // The Discord API does not have a way of getting all threads in a channel.
    // Instead, we need to first get all active threads on the entire server,
    // then filter out the ones that are in the channels we want.
    const categoryIds = categories.map((category) => category.id);
    const {threads} = await api.guilds.getActiveThreads(
        process.env.DISCORD_GUILD_ID!
    );

    const topics: Topic[] = (threads as APIThreadChannel[])
        .filter(
            (thread) => thread.parent_id && categoryIds.includes(thread.parent_id)
        )
        .map((thread) => ({
            id: thread.id,
            title: thread.name,
            created: new Date(thread.thread_metadata!.create_timestamp!),
            categoryId: thread.parent_id!,
        }));
    await prisma.topic.createMany({
        data: topics,
        skipDuplicates: true,
    });
    totalThreads += topics.length;
    console.log(`Exported ${topics.length} active threads.`);

    // Then, we can get all the archived threads for each channel
    for (const category of categories) {
        console.log(`Exporting archived threads for ${category.name}`);
        let hasMore = true;
        let before = new Date().toISOString();

        while (hasMore) {
            console.log(
                `- Fetching next page, getting archived threads before ${before}`
            );
            const threadQuery = await api.channels.getArchivedThreads(
                category.id,
                "public",
                {limit: 100, before}
            );
            const threads = threadQuery.threads as APIThreadChannel[];
            const topics: Topic[] = threads.map((thread) => ({
                id: thread.id,
                title: thread.name,
                created: new Date(thread.thread_metadata!.create_timestamp!),
                categoryId: thread.parent_id!,
            }));

            await prisma.topic.createMany({
                data: topics,
                skipDuplicates: true,
            });

            totalThreads += topics.length;
            hasMore = threadQuery.has_more;
            before = threads[threads.length - 1].thread_metadata!.archive_timestamp;
        }
    }

    console.log(`Exported ${totalThreads} threads.`);
}

async function exportMessages() {
    console.log("Exporting messages...");
    let totalMessages = 0;

    const channels = await prisma.category.findMany({
        include: {
            topics: true,
        },
    });

    for (const category of channels) {
        console.log(`Exporting messages for ${category.name}`);

        for (const topic of category.topics) {
            console.log(`- Exporting messages for ${topic.title}`);

            // Fetch all messages in the thread, 100 at a time.
            let hasMore = true;
            let beforeMessageId = undefined;

            while(hasMore) {
                const messages = await api.channels.getMessages(topic.id, {
                    limit: 100,
                    ...(beforeMessageId && {before: beforeMessageId})
                });
                hasMore = messages.length === 100;
                beforeMessageId = messages[messages.length - 1]?.id;
                totalMessages += messages.length;

                for (const message of messages) {
                    await prisma.post.create({
                        data: {
                            id: message.id,
                            topic: {
                                connect: {
                                    id: topic.id,
                                }
                            },
                            author: {
                                connectOrCreate: {
                                    where: {
                                        id: message.author.id,
                                    },
                                    create: {
                                        id: message.author.id,
                                        username: message.author.username,
                                        displayName: message.author.global_name || message.author.username,
                                    },
                                }
                            },
                            created: new Date(message.timestamp),
                            body: message.content,
                            attachments: {
                                createMany: {
                                    data: message.attachments.map((attachment) => ({
                                        id: attachment.id,
                                        name: attachment.filename,
                                        url: attachment.url,
                                    })),
                                    skipDuplicates: true,
                                },
                            },
                        },
                    });
                }
            }
            }
    }

    console.log(`Exported ${totalMessages} messages.`);
}

async function anonymizeUsers() {
    console.log("Anonymizing users...");
    const users = await prisma.user.findMany();
    const usedNames: string[] = [];

    for(const user of users) {
        let newName = generateRandomName();
        while(usedNames.includes(newName)) {
            newName = generateRandomName();
        }
        usedNames.push(newName);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                displayName: newName,
            },
        });
    }
    console.log(`Anonymized ${users.length} users.`);
}

try {
    await exportDiscordData();
    await prisma.$disconnect();
} catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
}
