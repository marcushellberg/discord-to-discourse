# Discord forum channel data export script

## Create a Discord application

- Go to the Discord Developer portal and [create a new application](https://discord.com/developers/applications?new_application=true).
- On the Application's Bot tab, enable the Message Content Intent toggle.
- On the Application's OAuth2 tab, add the `bot` scope and the following permissions:
  - Manage Messages
  - Manage Threads
  - Read Message History
- Copy the generated URL and paste it into your browser to add the bot to your server.
- Copy the bot token and add it to your `.env` file.

## How to run the Discord export

- Define environment variables by copying `.env.template` to `.env` and filling in the values.
- Install dependencies with `bun install`
- Run `npx prisma migrate dev` to create the database.
- Run `npx prisma generate` to generate the Prisma client for typed database access.
- Run the export with `bun run index.ts`

