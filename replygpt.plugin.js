/**
 * @name _ReplyGPT - Autopilot for Discord
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

module.exports = class ReplyGPT {
  constructor() {
    this.Settings = {
      OpenAIKey: "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",
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
    this.Settings = BdApi.Data.load("ReplyGPT", "settings") || this.Settings;
    // patchPanel();
    setInterval(() => {
      this.testing();
    }, 13000); // time before next check
  }

  stop() {
    BdApi.Data.save("ReplyGPT", "settings", this.Settings);
    BdApi.Patcher.unpatchAll("Plugin");
  }

  async getReplyFromAI(inputMessagesArray) {
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
in the style of the user. You will be given the last 15 messages 
between the local user (who you are replying as) and the remote 
user (who you are replying to). You will then be asked to reply 
to the remote user in the style of the local user. Remember not 
to say anything that would give away that you are an AI. 
You are doing your best to be the user you are replying as.
Do not reply in more than 1 sentence. Keep your answers short and generic.

DO NOT USE EMOJIS UNDER ANY CIRCUMSTANCES

The following is the last few messages between the local user and 
the remote user:

${inputMessagesArray.join("\n")}

YOUR RESPONSE AS THE LOCAL USER: _____

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
};

// const { React } = BdApi;

// const PanelButton = BdApi.Webpack.getModule(m => m.toString?.().includes(".Masks.PANEL_BUTTON"));

// function AutoPilotButton() {
//   const [ checked, setChecked ] = React.useState(false);

//   return React.createElement(PanelButton, {
//     ariaChecked: checked,
//     ariaLabel: checked ? "Checked" : "Unchecked",
//     disabled: false,
//     icon: (props) => React.createElement("div", props, checked.toString()),
//     iconForeground: "",
//     innerClassName: "",
//     onClick: () => setChecked(!checked),
//     role: "switch",
//     tooltipText: checked ? "Checked" : "Unchecked"
//   });
// };

// function patchPanel() {
//   const node = document.querySelector("title-31SJ6t > .toolbar-3_r2xA > .container-ZMc96U");
//   if (!node) {
//     console.log("no node");
//     return;
//   }
//   console.log("node found, patching")
//   const instance = BdApi.ReactUtils.getOwnerInstance(node);
//   if (!instance) return;
//   BdApi.Patcher.after("Plugin", instance, "render", (that, args, res) => {
//     const flex = BdApi.Utils.findInTree(res, m => m?.children && m.shrink, { walkable: [ "children", "props" ] });
//     flex.children.unshift(React.createElement(AutoPilotButton));
//   });
//   instance.forceUpdate();
// };

