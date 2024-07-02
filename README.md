# This project is archived temporarily until I can find the time to completely rework and update it to the latest version of Discord. Sorry for the inconvienece.

# AutoPilot - Your AI AutoPilot for Discord

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A BetterDiscord plugin that enhances your Discord experience by integrating the ChatGPT / GPT3.5 model. It allows you to generate and send AI-powered replies to Discord DMs automatically.


#### Please Note:
This is just a project for fun, as its more of an experiment / toy. Don't rely on this to give accurate responses, as its just using ChatGPT.



## Features

- When enabled, autopilot will automatically reply to enabled channels with GPT responses based on your conversation

## Requirements

- BetterDiscord: To use this plugin, you need to have BetterDiscord installed. If you don't have it, you can install it from the official [BetterDiscord website](https://betterdiscord.app/).
- OpenAPI Key
- ZeresPluginLibrary - You can get the library plugin from [Here](https://betterdiscord.app/plugin/ZeresPluginLibrary)

## Installation

1. First, make sure you have BetterDiscord installed.
2. Download the `.plugin.js` file from the repository
4. Move the downloaded `.plugin.js` file to the BetterDiscord plugins folder. The location of the folder depends on your operating system:
   - Windows: `%appdata%\betterdiscord\plugins`
   - macOS: `~/Library/Preferences/BetterDiscord/plugins`
   - Linux: `~/.config/BetterDiscord/plugins`
5. Restart Discord.
6. Open Discord settings, navigate to the Plugins section, and enable the "AutoPilot" plugin from the list.

## Usage

1. Once the plugin is enabled, you will see a few new buttons in your DMs. Enable any channels you want to have AutoPilot reply to.

   <img src="images/enable.png" alt="Enable AutoPilot" width="400"/>
   <img src="images/enabled.png" alt="Enabled AutoPilot" width="400"/>

2. In order to use it, you must provide your OpenAI API key in the plugin settings. You can get your key [Here](https://platform.openai.com/account/api-keys)

   <img src="images/Settings.png" alt="AutoPilot Settings" width="400"/>

   - __Note: your OpenAI key isn't uploaded anywhere, and is kept on your local machine. Please be sure not to share this anywhere__
4. Once you input your key, you can now toggle on or off AutoPilot next to the gift icon.

<img src="images/Start.png" alt="Start AutoPilot" width="400"/>

5. Please note it is best to mess with settings to determine how accurate the AI will be replying for you.


## Known Issues

- Ticking off `Random Delay` in settings doesn't work properly.
- AI can hallucinate answers occasionally, this may account for delayed response time until it gives a JSON reply properly
- Channels with less than ~15 messages won't generate properly. this is being looked into
This plugin is new, and has lots of undiscovered issues. Report any in the issues tab please.

## Planned Features
- Custom prompts
- Expression styles
- AutoPilot away messages

## Contributing

Contributions are welcome! If you find any bugs or want to suggest improvements, please or submit a pull request.
