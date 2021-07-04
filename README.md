# 📡 GitHub Notifier for Telegram
The telegram bot will notify github commit or someone who gives the star and fork repository.

# 💉 Installation
Installation is very easy. Actually can run this without having to install modules again. However, there are some modules that will not be available if you use them in node versions less than 12 or 14.
So you can do the instructions below.

> npm install

if you're using yarn
> yarn install

# 💡 Setup
## GitHub Setup
- First, you can run the app first. `node index.js`
- Second, make sure your ip can be accessed publicly.
- Third, go to the github repository then go to settings and webhooks. If you're already in the webhook section, click add webhook. Then, in the payload section of the url. Fill in the public ip url of your application.
- Fourth, in the content type section. Select `application/json` options.
- Fifth, save the webhook.
## Telegram Setup
- Change the `config.example.js` file to `config.js`
- Fill in TG_TOKEN and CHAT_FORMAT with your bot token and channel or group identifier.

~~Btw, it's still in progress.~~