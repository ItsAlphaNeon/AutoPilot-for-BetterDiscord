/**
 * @name Autopilot
 * @author AlphaNeon
 * @description A plugin that uses the OpenAI API to automatically reply to DM's you select. Very experimental, and just for fun.
 * @version 0.0.1
 */

class APTools {
  static getUsernameFromChannel(channelId) {
    let messageStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getMessages",
      "getMessage"
    );

    let userStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getCurrentUser",
      "getUser"
    );

    // pull the messages object from the MessageStore
    let messages = messageStore.getMessages(channelId);

    let messageArray = messages._array;
    if (!messageArray || messageArray.length === 0) {
      console.log("No messages found in channel");
    }

    for (
      let i = Math.max(0, messageArray.length - 50);
      i < messageArray.length;
      i++
    ) {
      let message = messageArray[i];
      let messageAuthor = message.author.username;

      if (messageAuthor !== userStore.getCurrentUser().username) {
        return messageAuthor;
      }
    }
  }
  static getDisplayNameFromChannel(channelId) {
    let messageStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getMessages",
      "getMessage"
    );

    let userStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getCurrentUser",
      "getUser"
    );

    // pull the messages object from the MessageStore
    let messages = messageStore.getMessages(channelId);

    let messageArray = messages._array;
    if (!messageArray || messageArray.length === 0) {
      console.log("No messages found in channel");
    }

    for (
      let i = Math.max(0, messageArray.length - 50);
      i < messageArray.length;
      i++
    ) {
      let message = messageArray[i];
      console.log(message);
      let messageAuthor = message.author.globalName;

      if (messageAuthor !== userStore.getCurrentUser().globalName) {
        return messageAuthor;
      }
    }
  }

  static getCurrentChannelId() {
    return ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId();
  }
  static isDMChannel(channelId) {
    if (
      ZeresPluginLibrary.DiscordModules.ChannelStore.getChannel(channelId) == 1
    ) {
      return true;
    } else {
      return false;
    }
  }
}

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
      EnabledChannels: [],
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
    // Check whether the settings have been saved before,
    // if not, save the default settings
    if (!BdApi.Data.load("Autopilot", "settings")) {
      this.saveSettings();
    }
    this.loadSettings();

    if (
      this.Settings.OpenAIKey === "OPENAI_KEY_HERE" ||
      this.Settings.OpenAIKey === ""
    ) {
      BdApi.alert(
        "Autopilot",
        "Please enter your OpenAI key in the settings panel."
      );
    }

    // Attach the button to the title bar
    this.startObserver();

    // DEBUG - log every 1 second
    // setInterval(() => {
    //   console.log(APTools.isDMChannel(APTools.getCurrentChannelId()));
    // }, 1000);
  }

  stop() {
    BdApi.DOM.removeStyle("AutoPilot");
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

  getMessagesArray(numberOfMessages, channelId) {
    let formattedMessageArray = [];
    let messages = this.MessageStore.getMessages(channelId);
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

  async checkDirectMessages(channelId) {
    this.MessagesArray = this.getMessagesArray(15, channelId); // Fetch new messages

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
        // Send the generated response
        this.sendMessage(
          response.message,
          ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId(
            ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId()
          )
        );
        // Send a toast notification
        BdApi.UI.showToast(
          repsonse.message + " sent to user " + getUsernameFromChannel()
        );
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
    const OpenAIKeySetting = document.createElement("span");
    OpenAIKeySetting.classList.add("setting");

    const OpenAIKeyLabel = document.createElement("span");
    OpenAIKeyLabel.textContent = "OpenAI Key";

    const OpenAIKeyInput = document.createElement("input");
    OpenAIKeyInput.type = "text";
    OpenAIKeyInput.name = "OpenAIKey";

    OpenAIKeyInput.addEventListener("input", (e) => {
      this.Settings.OpenAIKey = e.target.value;
      this.saveSettings();

      // Send a toast notification
      BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));
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

    randomDelayMinInput.addEventListener("input", (e) => {
      this.Settings.RandomDelayMin = e.target.value;
      this.saveSettings();

      // Send a toast notification
      BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));
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

    randomDelayMaxInput.addEventListener("input", (e) => {
      this.Settings.RandomDelayMax = e.target.value;
      this.saveSettings();

      // Send a toast notification
      BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));
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

    randomDelayEnabledInput.addEventListener("input", (e) => {
      this.Settings.RandomDelayEnabled = e.target.checked;
      this.saveSettings();

      // Send a toast notification
      BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));
    });

    randomDelayEnabledSetting.append(
      randomDelayEnabledLabel,
      randomDelayEnabledInput
    );

    // 5. CustomPrompt Setting
    const customPromptSetting = document.createElement("div");
    customPromptSetting.classList.add("setting");

    const customPromptLabel = document.createElement("span");
    customPromptLabel.textContent = "Custom Prompt";

    const customPromptInput = document.createElement("input");
    customPromptInput.type = "text";
    customPromptInput.name = "CustomPrompt";

    customPromptInput.addEventListener("input", (e) => {
      this.Settings.CustomPrompt = e.target.value;
      this.saveSettings();

      // Send a toast notification
      BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));
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

    useCustomPromptInput.addEventListener("input", (e) => {
      this.Settings.UseCustomPrompt = e.target.checked;
      this.saveSettings();

      // Send a toast notification
      BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));
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

    messagesToReadInput.addEventListener("input", (e) => {
      this.Settings.MessagesToRead = e.target.value;
      this.saveSettings();

      // Send a toast notification
      BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));
    });

    // Load settings
    this.loadSettings();

    // Populate the inputs with the saved settings
    OpenAIKeyInput.value = this.Settings.OpenAIKey;
    randomDelayMinInput.value = this.Settings.RandomDelayMin;
    randomDelayMaxInput.value = this.Settings.RandomDelayMax;
    randomDelayEnabledInput.checked = this.Settings.RandomDelayEnabled;
    customPromptInput.value = this.Settings.CustomPrompt;
    useCustomPromptInput.checked = this.Settings.UseCustomPrompt;
    messagesToReadInput.value = this.Settings.MessagesToRead;

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
    const savedSettings = BdApi.Data.load("Autopilot", "settings");
    if (savedSettings) {
      const settingsKeys = Object.keys(this.Settings);
      settingsKeys.forEach((key) => {
        if (typeof savedSettings[key] !== "undefined") {
          this.Settings[key] = savedSettings[key];
        }
      });
    }
  }

  saveSettings() {
    BdApi.Data.save("Autopilot", "settings", this.Settings);
  }

  enableChannel(channelId) {
    this.Settings.EnabledChannels.push(channelId);
    this.saveSettings();
  }

  disableChannel(channelId) {
    this.Settings.EnabledChannels = this.Settings.EnabledChannels.filter(
      (channel) => channel !== channelId
    );
    this.saveSettings();
  }

  // Function to attach button to the title bar
  attachUserManagerButton() {
    let titleBar = document.querySelector(".title-31SJ6t > .toolbar-3_r2xA");
    if (titleBar) {
      if (titleBar.querySelector("#autopilot_button")) {
        return; // Exit if button already exists
      }
      let currentRecipient = APTools.getDisplayNameFromChannel(
        ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId()
      );

      if (currentRecipient == null || currentRecipient == undefined) {
        // channel hasn't loaded yet, exit
        return;
      }

      // if (APTools.isDMChannel(APTools.getCurrentChannelId()) == false) {
      //   // Not a DM channel, exit
      //   return;
      // }

      let autopilotChannelButton = document.createElement("button");
      autopilotChannelButton.id = "autopilot_button";
      autopilotChannelButton.classList.add("AutopilotButtonInactive");

      if (
        this.Settings.EnabledChannels.includes(
          ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId()
        )
      ) {
        ` 1`;
        autopilotChannelButton.classList.remove("AutopilotButtonInactive");
        autopilotChannelButton.classList.add("AutopilotButtonActive");
        autopilotChannelButton.textContent =
          "🤖 Autopilot is enabled for " + currentRecipient;
      } else {
        autopilotChannelButton.classList.add("AutopilotButtonInactive");
        autopilotChannelButton.textContent =
          "🤖 Enable Autopilot for " + currentRecipient;
      }

      autopilotChannelButton.addEventListener("click", () => {
        // BdApi.UI.showToast("Button clicked!", (options = { type: "success" }));
        console.log(this.Settings.MessagesArray);
        // toggle
        if (
          // check if the channel id is in the enabled channels array
          this.Settings.EnabledChannels.includes(
            ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId()
          )
        ) {
          // remove from array
          this.disableChannel(
            ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId()
          );
          autopilotChannelButton.classList.remove("AutopilotButtonActive");
          autopilotChannelButton.classList.add("AutopilotButtonInactive");
          autopilotChannelButton.textContent =
            "🤖 Enable Autopilot for " + currentRecipient;
        } else {
          // add to array
          this.enableChannel(
            ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId()
          );

          autopilotChannelButton.classList.remove("AutopilotButtonInactive");
          autopilotChannelButton.classList.add("AutopilotButtonActive");
          autopilotChannelButton.textContent =
            "🤖 Autopilot is enabled for " + currentRecipient;
        }
      });

      titleBar.insertBefore(autopilotChannelButton, titleBar.firstChild);
    }
  }

  attatchAutopilotButton() {
    let typingIconsBar = document.querySelector(
      ".inner-NQg18Y > .buttons-uaqb-5"
    );
    if (typingIconsBar) {
      if (typingIconsBar.querySelector("#autopilot_button")) {
        return; // Exit if button already exists
      }
      let autopilotButton = document.createElement("button");
      autopilotButton.id = "autopilot_button";
      autopilotButton.addEventListener("click", () => {
        BdApi.UI.showToast("Button clicked!", (options = { type: "success" }));
      });
      autopilotButton.textContent = "🤖";

      autopilotButton.classList.add("AutopilotButtonIcon");

      typingIconsBar.insertBefore(autopilotButton, typingIconsBar.firstChild);
    }
  }

  startObserver() {
    // Create a mutation observer to monitor the DOM for changes
    this.observer = new MutationObserver((mutationRecords) => {
      mutationRecords.forEach((mutation) => {
        // If nodes are added or target's childList is mutated, attach the button
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          this.attachUserManagerButton();
          this.attatchAutopilotButton();
        }
      });
    });

    // Option to observe entire document and childList and subtree of specific node
    let observerOptions = {
      childList: true,
      subtree: true,
    };

    // Start observing the document with the configured parameters
    this.observer.observe(document, observerOptions);
  }
};

BdApi.DOM.addStyle(
  "AutoPilotInactive",
  `.AutopilotButtonInactive {
  padding: 8px;
  border-radius: 5px;
  background-color: #1a1a1a;
  color: #ffffff;
}

.AutopilotButtonInactive:hover {
  background-color: #0a0a0a;
  transition: 0.2s;
}`
);

BdApi.DOM.addStyle(
  "AutoPilotActive",
  `
  .AutopilotButtonActive {
    padding: 8px;
    border-radius: 5px;
    margin:5px;   // adding margin to view changes better
    background-color: #ff0000;
    animation: colorChange 5s infinite;
    transition: all 0.1s ease-in-out;
    color: #ffffff;
  }

  .AutopilotButtonActive:hover {
    filter: brightness(75%);   // adjust as needed
    transition: all 02s ease-in-out;
  }

  @keyframes colorChange {
    0% {background: #ff4242;}
    33% {background: #3fba3f;}
    66% {background: #5757ff;}
    100% {background: #ff4242;}
  }
  `
);

BdApi.DOM.addStyle(
  "AutoPilotIcon",
  `
  .AutopilotButtonIcon {
  padding: 8px;
  border-radius: 5px;
  background-color: #1a1a1a;
  color: #ffffff;
  }
  `
);
