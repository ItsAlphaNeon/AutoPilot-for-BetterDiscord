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

class Icons {
  static svgWidth = 20; // Set the desired width of the SVG icon
  static svgHeight = 20; // Set the desired height of the SVG icon
  static svgIcon = `
      <svg
        height="${Icons.svgHeight}"
        width="${Icons.svgWidth}"
        version="1.1"
        id="svg509"
        viewBox="0 0 742.43835 786.30542"
        xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:cc="http://creativecommons.org/ns#"
        xmlns:dc="http://purl.org/dc/elements/1.1/">
        <defs id="defs4" />
        <metadata id="metadata7">
          <rdf:RDF><cc:Work rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
            <dc:title />
          </cc:Work></rdf:RDF>
        </metadata>
        <g id="layer1" transform="translate(-106.24609,-99.065643)">
          <path id="path711" style="stroke-width:3.15096" 
            d="m 502.74805,99.080078 c -25.23056,-0.803671 -51.50422,
            32.077632 -52.13086,65.882812 -0.30848,16.63992 -3.75528,102.69665 -4.34961,
            160.16211 l -338.6836,258.04492 -1.33789,81.35352 349.04102,-157.17774 11.21094,
            253.06055 -101.35547,71.72852 -0.93164,53.23632 133.39258,-35.81445 0.0215,
            0.43945 5.12305,1.33985 V 742.55273 c 2.6946,1.93685 4.45931,5.83817 16.03515,33.94532 12.56881,
            30.4776 12.93693,31.2856 15.02539,32.9082 1.21026,0.95569 2.98204,1.76665 4.13477,1.89453 4.76965,
            0.55231 33.97777,-3.3492 52.54297,-7.03125 8.41016,-1.6764 10.16077,-2.68075 11.33984,-6.66211 0.37936,
            -1.27418 2.72295,-16.93164 5.17383,-34.7793 2.98967,-21.3166 4.82211,-33.08994 5.37109,-34.16796 1.79496,
            -3.34828 3.24136,-4.22917 18.60547,-11.32813 16.57002,-7.70274 18.71149,-8.31986 22.62891,-6.56445 0.96732,
            0.45267 13.51902,8.99248 27.83789,19.01953 14.37064,10.02348 26.8188,18.56718 27.73437,19.02344 1.18507,
            0.59356 2.39032,0.71767 4.34571,0.42578 2.62804,-0.33865 3.16676,-0.79059 17.23633,-13.05078 28.57958,
            -24.91499 31.27218,-27.33931 32.1582,-28.80469 0.51879,-0.76396 0.96432,-2.56257 0.9707,-3.9668 0.10045,
            -2.29466 -1.14235,-5.22234 -14.11133,-33.22851 -7.83138,-16.92501 -14.4102,-31.54555 -14.58203,-32.52149 -0.76557,
            -3.53422 0.27027,-5.84209 7.75781,-17.80078 4.02902,-6.36311 7.78359,-12.1875 8.36133,-12.85156 1.67073,-2.14382 4.68091,
            -3.70583 7.58203,-3.85547 1.39704,-0.0971 16.97675,0.37958 34.54688,1.08203 l 31.90234,1.21484 2.15625,-1.13867 c 1.1505,
            -0.65189 2.48697,-1.62731 2.96485,-2.23242 0.66681,-0.87824 15.40312,-50.67212 17.76758,-60.03906 0.90456,-3.44238 -0.0179,
            -6.23695 -2.84376,-8.74414 -1.11036,-1.01466 -14.61476,-9.79841 -30.00585,-19.54297 -27.62646,-17.47281 -27.95399,
            -17.71089 -29.44532,-20.4668 l -1.49218,-2.75586 -0.15235,-11.16797 c -0.18271,-14.59707 -0.12654,-15.27597 1.59375,
            -18.20312 1.39761,-2.3328 2.54089,-3.08904 30.50586,-19.64258 16.0302,-9.48493 29.45403,-17.59176 29.89453,-17.98633 1.06998,
            -1.06222 2.48773,-4.59319 2.39063,-5.99023 -0.15105,-2.17318 -17.77744,-62.03753 -18.7168,-63.58399 -0.52682,-0.84724 -1.80448,
            -2.00738 -2.94141,-2.65625 -2.27027,-1.24597 -0.0341,-1.2445 -52.73437,-0.96093 -20.21759,0.10545 -20.5876,0.0272 -23.8418,
            -2.65821 -2.37235,-1.96677 -12.90452,-18.86002 -13.46093,-21.6289 -0.30406,-1.38265 -0.21632,-3.10443 0.11132,-4.375 0.33483,
            -1.1671 7.34419,-15.5371 15.56446,-31.91407 14.3481,-28.4491 14.97731,-29.8445 14.80468,-32.32812 -0.14878,-1.39345 -0.5777,
            -3.08008 -0.99023,-3.7793 -0.76258,-1.24679 -47.15869,-42.682 -49.77539,-44.42382 -0.81929,-0.56696 -2.40451,-0.92473 -4.22266,
            -0.90235 l -2.96484,-0.002 -28.05664,18.22265 c -15.4215,10.01455 -28.9666,18.59874 -30.07617,19.0918 -3.4839,1.48997 -5.86521,
            0.87632 -15.86329,-3.83594 -10.10509,-4.75677 -11.19485,-5.46164 -12.90039,-8.30664 -1.52508,-2.4936 -1.42666,-1.82409 -5.23632,
            -38.68164 -3.15676,-30.45589 -3.28352,-31.53879 -4.58008,-33.73633 -2.18421,-3.74757 1.67235,-2.87239 -51.97852,-11.77734 -9.0435,
            -1.45109 -16.97869,-2.66621 -17.59961,-2.62305 -0.6173,0.0949 -1.78618,0.48683 -2.64062,0.91016 -0.79911,0.47148 -2.07925,
            1.49678 -2.7461,2.375 -0.66683,0.87822 -6.95691,14.36541 -13.97851,30.03516 -7.02519,15.61798 -13.43075,29.68474 -14.25781,
            31.25 -1.60029,2.9753 -2.52556,3.98799 -6.84961,4.77343 z m 27.4414,187.015622 c 14.35856,0.8737 26.33973,2.69247 38.88672,
            5.92774 66.63944,16.99677 120.41708,69.61914 138.56836,135.53125 3.9671,14.43799 5.12927,21.42803 6.3125,38.45117 1.16668,
            16.03644 1.18096,19.98634 -0.0449,33.01758 -5.73024,61.17703 -41.51245,117.11292 -94.92578,148.27734 -20.23625,11.80499 -37.96744,
            18.49565 -63.08008,23.72461 -7.84101,1.63684 -36.72918,3.43677 -45.55273,2.90625 -2.5703,-0.1697 -5.08131,-0.5034 -7.60547,
            -0.80078 V 287.21094 c 9.87974,-0.80223 21.98227,-1.43848 27.4414,-1.11524 z" />
        </g>
      </svg>`;
}
module.exports = class Autopilot {
  constructor() {
    // Default settings
    this.autopilotActive = false;
    this.Settings = {
      OpenAIKey: "OPENAI_KEY_HERE",
      RandomDelayMin: 1,
      RandomDelayMax: 10,
      RandomDelayEnabled: true,
      CustomPrompt: "PROMPT_HERE",
      UseCustomPrompt: false,
      MessagesToRead: 20,
      EnabledChannels: [],
      IsFirstRun: true,
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
    // Load settings if they don't exist
    if (!BdApi.Data.load("Autopilot", "settings")) {
      this.saveSettings();
    }
    this.loadSettings();

    // Check if first run
    if (this.Settings.IsFirstRun) {
      BdApi.UI.showConfirmationModal(
        "Autopilot",
        "Welcome to Autopilot! To begin, please enter your OpenAI key in the settings panel. You can find your key at https://beta.openai.com/account/api-keys. After you have entered your key, enable any Direct Messages you wish for Autopilot to reply to, and press the Autopilot button in the typing bar to enable Autopilot for any enabled channels."
      );
      this.Settings.IsFirstRun = false;
      this.saveSettings();
      return;
    } else {
      if (
        this.Settings.OpenAIKey == "OPENAI_KEY_HERE" ||
        this.Settings.OpenAIKey == ""
      ) {
        BdApi.alert(
          "Autopilot",
          "Please enter your OpenAI key in the settings panel."
        );
      }
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

  // getUserType(name) {
  //   if (name === this.UserStore.getCurrentUser().username) {
  //     return "LocalUser";
  //   } else {
  //     return "RemoteUser";
  //   }
  // }

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
    // Set up panel and load settings
    const settingsPanel = document.createElement("div");
    this.loadSettings();
    
    // Define settings
    const OpenAIKeySetting = this.buildSetting("OpenAI Key", "OpenAIKey", "text", this.Settings.OpenAIKey);
    const RandomDelayMinSetting = this.buildSetting("Random Delay Min", "RandomDelayMin", "number", this.Settings.RandomDelayMin);
    const RandomDelayMaxSetting = this.buildSetting("Random Delay Max", "RandomDelayMax", "number", this.Settings.RandomDelayMax);
    const RandomDelayEnabledSetting = this.buildSetting("Random Delay Enabled", "RandomDelayEnabled", "checkbox", this.Settings.RandomDelayEnabled);
    const CustomPromptSetting = this.buildSetting("Custom Prompt", "CustomPrompt", "text", this.Settings.CustomPrompt);
    const UseCustomPromptSetting = this.buildSetting("Use Custom Prompt", "UseCustomPrompt", "checkbox", this.Settings.UseCustomPrompt);
    const MessagesToReadSetting = this.buildSetting("Messages to Read", "MessagesToRead", "number", this.Settings.MessagesToRead);
    const ResetSettingsButton = this.buildSetting("Reset Settings", "ResetSettings", "button", "Reset Settings", () => {this.resetSettings();});
    
    // Append settings to the settings panel
    settingsPanel.append(
      OpenAIKeySetting,
      RandomDelayMinSetting,
      RandomDelayMaxSetting,
      RandomDelayEnabledSetting,
      // CustomPromptSetting,
      // UseCustomPromptSetting,
      MessagesToReadSetting,
      ResetSettingsButton
      
    );
    
    return settingsPanel;
  }
  
  buildSetting(text, key, type, value, callback = () => {}) {
    const setting = Object.assign(document.createElement("div"), {className: "setting"});
    const input = Object.assign(document.createElement("input"), {type: type, name: key, value: value, id: key});
    const label = Object.assign(document.createElement("span"), {textContent: text});
    
    let switchElement;
    if (type === 'checkbox') {
        if (value) input.checked = true;
        switchElement = Object.assign(document.createElement("label"), {className: "switch", htmlFor: key});
        setting.append(label, input, switchElement); // Append label, input, and switch
    } else {
        setting.append(label, input); // Append label and input
    }
    
    input.addEventListener("input", () => {
        const newValue = type == "checkbox" ? input.checked : input.value;
        this.Settings[key] = newValue;
        this.saveSettings();

        // Send a toast notification
        BdApi.UI.showToast("Settings saved!", (options = { type: "success" }));

        callback(newValue);
    });

    return setting;
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

  resetSettings() {
    console.log("Resetting settings");
    this.Settings = {
      OpenAIKey: "OPENAI_KEY_HERE",
      RandomDelayMin: 1,
      RandomDelayMax: 10,
      RandomDelayEnabled: true,
      CustomPrompt: "PROMPT_HERE",
      UseCustomPrompt: false,
      MessagesToRead: 20,
      EnabledChannels: [],
      IsFirstRun: true,
    };
    this.saveSettings();
    BdApi.alert("Autopilot", "Settings reset! Please reload Discord.");
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
      autopilotButton.style.position = "relative";
      autopilotButton.classList.add("AutopilotButtonIconInactive");

      // Create a pulse blob
      let pulseBlob = document.createElement("div");
      // check if autopilot is enabled on creation
      if (this.autopilotActive == true) {
        autopilotButton.classList.remove("AutopilotButtonIconInactive");
        autopilotButton.classList.add("AutopilotButtonIconActive");
        pulseBlob.classList.add("blob"); // pulsing effect
      } else {
        autopilotButton.classList.add("AutopilotButtonIconInactive");
        autopilotButton.classList.remove("AutoilotButtonIconActive");
        pulseBlob.classList.remove("blob"); // pulsing effect
      }

      autopilotButton.addEventListener("click", () => {
        this.toggleAutopilot();
        if (this.autopilotActive == true) {
          autopilotButton.classList.remove("AutopilotButtonIconInactive");
          autopilotButton.classList.add("AutopilotButtonIconActive");
          pulseBlob.classList.add("blob"); // pulsing effect
        } else {
          autopilotButton.classList.add("AutopilotButtonIconInactive");
          autopilotButton.classList.remove("AutopilotButtonIconActive");
          pulseBlob.classList.remove("blob"); // pulsing effect
        }
      });

      autopilotButton.innerHTML = Icons.svgIcon; // SVG content hardcoded

      typingIconsBar.insertBefore(autopilotButton, typingIconsBar.firstChild);

      // Add the pulse blob to the button
      autopilotButton.appendChild(pulseBlob);
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

  toggleAutopilot() {
    // Check if there is a key in settings
    if (
      this.Settings.OpenAIKey == "OPENAI_KEY_HERE" ||
      this.Settings.OpenAIKey == ""
    ) {
      BdApi.UI.showNotice(
        "Autopilot can't be enabled until you enter your OpenAI key in the settings panel."
      );
      return;
    }
    if (this.autopilotActive == true) {
      this.autopilotActive = false;
      // this.stopAutopilot();
      BdApi.UI.showToast("Autopilot disabled!");
    } else {
      this.autopilotActive = true;
      // this.startAutopilot();
      BdApi.UI.showToast("Autopilot enabled!");
    }
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
    margin:5px; 
    background-color: #ff0000;
    animation: colorChange 5s infinite;
    transition: all 0.1s ease-in-out;
    color: #ffffff;
  }

  .AutopilotButtonActive:hover {
    filter: brightness(75%); 
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
  "AutopilotButtonIconInactive",
  `
  .AutopilotButtonIconInactive {
    padding: 8px;
    border-radius: 5px;
    color: white;
  }

  .AutopilotButtonIconInactive svg path {
    fill: #B5BAC1;
  }

  .AutopilotButtonIconInactive:hover svg path {
    fill: #D8D8D8;
  }

  .AutopilotButtonIconInactive:hover svg path {
    fill: #D8D8D8;
  }

  .AutopilotButtonIconInactive {
    background-color: transparent;
  }
  `
);
// rotate the button
BdApi.DOM.addStyle(
  "AutopilotButtonIconActive",
  `
  .AutopilotButtonIconActive {
    padding: 8px;
    border-radius: 5px;
    color: white;
    background-color: transparent;
    animation: rotate 5s ease-in-out infinite;
  }

  .AutopilotButtonIconActive svg path {
    fill: lightgreen;
  }

  .AutopilotButtonIconActive:hover svg path {
    fill: #D8D8D8;
  }

  @keyframes rotate {
    0% {
      transform: rotate(-45deg);
    }
    50% {
      transform: rotate(45deg);
    }
    100% {
      transform: rotate(-45deg);
    }
  }
  `
);
// pulse blob
BdApi.DOM.addStyle(
  "BlobAnimation",
  `
  .blob {
    position: absolute;
    top: 5px;
    left: 2px;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
    transform: scale(1);
    animation: pulse 2s infinite;
  }
    
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(128, 128, 128, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(128, 128, 128, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(128, 128, 128, 0);
    }
  }
  }
  
  `
);

BdApi.DOM.addStyle(
  "SettingsStyling",
  `
  #my-settings {
    display: flex;
    flex-direction: column;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px; 
    background-color: #f9f9f9;
}

.setting span {
    font-weight: bold;
}

.setting input[type=text],
.setting input[type=number]{
    width: 50%;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.setting input[type=checkbox] {
    width: auto;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  transition: all 0.3s;
  cursor: pointer;
}

.switch::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius:50%;
  background-color: white;
  top: 1px;
  left: 1px;
  transition: all 0.3s;
}

input[type=checkbox]:checked + .switch::after {
  left : 20px;
}

input[type=checkbox]:checked + .switch {
  background-color: #7983ff;
}

input[type=checkbox] {
  display : none;
}

.setting input[type=button] {
  padding: 10px 20px;
  background-color: #3483eb;
  border: none;
  color: white; 
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s; 
  cursor: pointer; 
  border-radius: 5px;
}

.setting input[type=button]:hover {
  background-color: #1f4e8c;
}

.setting input[type=button]:active {
  background-color: #00439c;
  box-shadow: 0 5px #666;
  transform: translateY(2px);
}

)`
);
