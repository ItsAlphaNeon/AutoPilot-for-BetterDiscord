/**
 * @name Autopilot
 * @author AlphaNeon
 * @description A plugin that replies to messages with the ChatGPT API
 * @version 0.0.1
 */

const stripEmojis = (str) =>
  str

    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,

      ""
    )

    .replace(/\s+/g, " ")

    .trim();

module.exports = class Autopilot {
  constructor() {
    // Default settings
    this.Settings = {
      OpenAIKey: "OPENAI_KEY_HERE",
      RandomDelayMin: 1,
      RandomDelayMax: 10,
      RandomDelayEnabled: true,
      CustomPrompt: "PROMPT_HERE",
      UseCustomPrompt: false,
      MessagesToRead: 20,
    };

    this.MessageStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getMessages",
      "getMessage"
    );

    this.ChannelStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getChannel",
      "getDMFromUserId",
      "sendMessage"
    );

    this.UserStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getCurrentUser",
      "getUser"
    );

    this.MessageActions = BdApi.Webpack.getByKeys("editMessage");

    this.MessagesArray = [];
  }

  start() {
    this.loadSettings();
    if (this.Settings.OpenAIKey === "OPENAI_KEY_HERE") {
      BdApi.alert(
        "Autopilot",
        "Please enter your OpenAI key in the settings panel."
      );
    }
    
    // Uncomment the below code to test the plugin

    // setInterval(() => {
    //   this.testing();
    // }, 13000); // time before next check
  }

  stop() {
    this.saveSettings();
  }

  async getReplyFromAI(inputMessagesArray) {
    let prompt = "";
    if (this.Settings.UseCustomPrompt) {
      prompt = this.DefaultPrompt(inputMessagesArray);
    } else if (!this.Settings.UseCustomPrompt) {
      prompt = this.Settings.CustomPrompt;
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.Settings.OpenAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.DefaultPrompt(inputMessagesArray),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const jsonResp = await response.json();
      return jsonResp["choices"][0]["message"]["content"];
    }
  }

  DefaultPrompt(inputMessagesArray) {
    // Assuming MessagesArray is a class property
    // this.MessagesArray should be properly initialized before being used here.

    const output = `
You are a Discord Reply AI designed to automatically reply to messages 
in the style of the user ${
      this.UserStore.getCurrentUser().username
    }. You will be given the last 15 messages 
between the local user ${
      this.UserStore.getCurrentUser().username
    }, (who you are replying as) and the remote 
user (who you are replying to). You will then be asked to reply 
to the remote user in the style of the local user. Remember not 
to say anything that would give away that you are an AI. 
You are doing your best to be the user you are replying as.
Do not reply in more than 1 sentence. Keep your answers short and generic.

DO NOT USE EMOJIS UNDER ANY CIRCUMSTANCES

The following is the last few messages between the local user and 
the remote user:

${inputMessagesArray.join("\n")}

YOUR RESPONSE AS ${this.UserStore.getCurrentUser().username}: _____

DO NOT USE EMOJIS UNDER ANY CIRCUMSTANCES

Ensure you parse your response as a json object with the following 
format: {
    "message": "YOUR RESPONSE HERE"
}

ONLY respond in this format. Do not reply with anything but the 
json object.

        `;
    console.log(output);
    return output;
  }

  /**
   * Retrieves the messages from the current channel and formats them into an array.
   * @returns {Array} An array of formatted messages.
   */
  getMessagesArray(numberOfMessages) {
    let formattedMessageArray = [];
    let messages = this.MessageStore.getMessages(
      ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId() // gets the current channel ID
    );
    console.log(messages);
    let messageArray = messages._array;
    if (!messageArray || messageArray.length === 0) {
      return formattedMessageArray;
    }

    for (
      let i = messageArray.length - numberOfMessages;
      i < messageArray.length;
      i++
    ) {
      let message = messageArray[i];
      let messageContent = message.content;
      let messageAuthor = message.author.username;
      let formattedMessage = `${messageAuthor}: ${messageContent}`;
      formattedMessageArray.push(formattedMessage);
    }
    return formattedMessageArray;
  }

  getUserType(name) {
    if (name === this.UserStore.getCurrentUser().username) {
      return "LocalUser";
    } else {
      return "RemoteUser";
    }
  }

  async getGeneratedResponse() {
    try {
      const response = await this.getReplyFromAI(this.MessagesArray);
      const responseObject = JSON.parse(response);
      // Do something with the response object

      return responseObject;
    } catch (error) {
      console.error("Error parsing response:", error);
      // Retry? debug
      throw error;
    }
  }

  async testing() {
    this.MessagesArray = this.getMessagesArray(15); // Fetch new messages

    let isLastMessageLocalUser = false;

    let lastMessageUsername = this.MessagesArray[this.MessagesArray.length - 1]
      .split(":")[0]
      .trim();
    console.log(lastMessageUsername);
    console.log(this.UserStore.getCurrentUser().username);
    if (lastMessageUsername == this.UserStore.getCurrentUser().username) {
      console.log("Last message was sent by the local user, don't reply");
      isLastMessageLocalUser = true;
    } else {
      console.log("Last message was sent by the remote user, reply");
      isLastMessageLocalUser = false;
    }

    if (!isLastMessageLocalUser) {
      try {
        const response = await this.getGeneratedResponse();

        this.sendMessage(
          response.message,
          ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId()
        ); // test message
      } catch (error) {
        console.error(error);
      }
    }
  }

  async sendMessage(message, channelId) {
    this.MessageActions.sendMessage(
      channelId,
      {
        content: message,
        tts: false,
        // the below are necessary to avoid errors, just ignore them
        invalidEmojis: [],
        validNonShortcutEmojis: [],
      }, // message data
      true, // whether to wait for the channel to be ready
      {
        stickerIds: [], // To send 1-3 stickers, add their ids here
        messageReference: undefined, // to reply to a message, add a message reference object here (object with properties guild_id, channel_id, message_id)
        allowedMentions: undefined, // to customise mentions, for example not ping the author of the message reference, add allowedMentions object according to discords api docs
      } // message extra
    );
  }

  getSettingsPanel() {
    const settingsPanel = document.createElement("div");
    settingsPanel.id = "my-settings";
    // 1. OpenAIKey Setting
    const OpenAIKeySetting = document.createElement("div");
    OpenAIKeySetting.classList.add("setting");
  
    const OpenAIKeyLabel = document.createElement("span");
    OpenAIKeyLabel.textContent = "OpenAI Key";
  
    const OpenAIKeyInput = document.createElement("input");
    OpenAIKeyInput.type = "text";
    OpenAIKeyInput.name = "OpenAIKey";
  
    OpenAIKeyInput.addEventListener('input', (e) => {
      this.Settings.OpenAIKey = e.target.value;
      this.saveSettings();
    });
  
    OpenAIKeySetting.append(OpenAIKeyLabel, OpenAIKeyInput);
  
    // 2. RandomDelayMin Setting
    const randomDelayMinSetting = document.createElement("div");
    randomDelayMinSetting.classList.add("setting");
  
    const randomDelayMinLabel = document.createElement("span");
    randomDelayMinLabel.textContent = "Random Delay Min";
  
    const randomDelayMinInput = document.createElement("input");
    randomDelayMinInput.type = "number";
    randomDelayMinInput.name = "RandomDelayMin";
  
    randomDelayMinInput.addEventListener('input', (e) => {
      this.Settings.RandomDelayMin = e.target.value;
      this.saveSettings();
    });
  
    randomDelayMinSetting.append(randomDelayMinLabel, randomDelayMinInput);
  
    // 3. RandomDelayMax Setting
    const randomDelayMaxSetting = document.createElement("div");
    randomDelayMaxSetting.classList.add("setting");
  
    const randomDelayMaxLabel = document.createElement("span");
    randomDelayMaxLabel.textContent = "Random Delay Max";
  
    const randomDelayMaxInput = document.createElement("input");
    randomDelayMaxInput.type = "number";
    randomDelayMaxInput.name = "RandomDelayMax";
  
    randomDelayMaxInput.addEventListener('input', (e) => {
      this.Settings.RandomDelayMax = e.target.value;
      this.saveSettings();
    });
  
    randomDelayMaxSetting.append(randomDelayMaxLabel, randomDelayMaxInput);
  
    // 4. RandomDelayEnabled Setting
    const randomDelayEnabledSetting = document.createElement("div");
    randomDelayEnabledSetting.classList.add("setting");
  
    const randomDelayEnabledLabel = document.createElement("span");
    randomDelayEnabledLabel.textContent = "Random Delay Enabled";
  
    const randomDelayEnabledInput = document.createElement("input");
    randomDelayEnabledInput.type = "checkbox";
    randomDelayEnabledInput.name = "RandomDelayEnabled";
  
    randomDelayEnabledInput.addEventListener('input', (e) => {
      this.Settings.RandomDelayEnabled = e.target.checked;
      this.saveSettings();
    });
  
    randomDelayEnabledSetting.append(randomDelayEnabledLabel, randomDelayEnabledInput);
  
    // 5. CustomPrompt Setting
    const customPromptSetting = document.createElement("div");
    customPromptSetting.classList.add("setting");
  
    const customPromptLabel = document.createElement("span");
    customPromptLabel.textContent = "Custom Prompt";
  
    const customPromptInput = document.createElement("input");
    customPromptInput.type = "text";
    customPromptInput.name = "CustomPrompt";
  
    customPromptInput.addEventListener('input', (e) => {
      this.Settings.CustomPrompt = e.target.value;
      this.saveSettings();
    });
  
    customPromptSetting.append(customPromptLabel, customPromptInput);
  
    // 6. UseCustomPrompt Setting
    const useCustomPromptSetting = document.createElement("div");
    useCustomPromptSetting.classList.add("setting");
  
    const useCustomPromptLabel = document.createElement("span");
    useCustomPromptLabel.textContent = "Use Custom Prompt";
  
    const useCustomPromptInput = document.createElement("input");
    useCustomPromptInput.type = "checkbox";
    useCustomPromptInput.name = "UseCustomPrompt";
  
    useCustomPromptInput.addEventListener('input', (e) => {
      this.Settings.UseCustomPrompt = e.target.checked;
      this.saveSettings();
    });
  
    useCustomPromptSetting.append(useCustomPromptLabel, useCustomPromptInput);
  
    // 7. MessagesToRead Setting
    const messagesToReadSetting = document.createElement("div");
    messagesToReadSetting.classList.add("setting");
  
    const messagesToReadLabel = document.createElement("span");
    messagesToReadLabel.textContent = "Messages to Read";
  
    const messagesToReadInput = document.createElement("input");
    messagesToReadInput.type = "number";
    messagesToReadInput.name = "MessagesToRead";
  
    messagesToReadInput.addEventListener('input', (e) => {
      this.Settings.MessagesToRead = e.target.value;
      this.saveSettings();
    });
  
    messagesToReadSetting.append(messagesToReadLabel, messagesToReadInput);
  
    // Append settings to the settings panel
    settingsPanel.append(
      OpenAIKeySetting,
      randomDelayMinSetting,
      randomDelayMaxSetting,
      randomDelayEnabledSetting,
      customPromptSetting,
      useCustomPromptSetting,
      messagesToReadSetting
    );
    return settingsPanel;
  }
  
  loadSettings() {
    this.Settings = BdApi.Data.load("Autopilot", "settings") || this.Settings;
  }
  
  saveSettings() {
    BdApi.Data.save("Autopilot", "settings", this.Settings);
  }
};
