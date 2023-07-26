/**
 * @name _ReplyGPT - Autopilot for Discord
 * @author AlphaNeon
 * @description A plugin that replies to messages with the ChatGPT API
 * @version 0.0.1
 */

const testArray = [
  "RemoteUser: Hi",
  "LocalUser: Hai~!",
  "RemoteUser: How are you?",
  "LocalUser: I'm doing great!~ ^w^",
  "RemoteUser: That's good to hear- whatcha doing?",
  "LocalUser: I'm just working on a Discord plugin!",
  "RemoteUser: Oh, that's cool!",
  "LocalUser: Yeah, I'm really excited about it!",
  "RemoteUser: Is something wrong..?- you seem a bit off.",
];

module.exports = class ReplyGPT {
  constructor() {
    this.MessageStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getMessages",
      "getMessage"
    );

    this.ChannelStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getChannel",
      "getDMFromUserId"
    );

    this.UserStore = ZeresPluginLibrary.WebpackModules.getByProps(
      "getCurrentUser",
      "getUser"
    );

    this.Settings = {
      OpenAIKey: "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",
      RandomDelayMin: 1,
      RandomDelayMax: 10,
      RandomDelayEnabled: true,
      CustomPrompt: "PROMPT_HERE",
      UseCustomPrompt: false,
      MessagesToRead: 15,
    };
  }

  start() {
    this.MessagesArray = this.getMessagesArray(this.Settings.MessagesToRead); // fill it automatically to debug

    this.Settings = BdApi.Data.load("ReplyGPT", "settings") || this.Settings;

    // wait 5 seconds to call this
    setTimeout(() => {
      this.testing();
    }, 5000);
  }

  stop() {
    BdApi.Data.save("ReplyGPT", "settings", this.Settings);
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

The following is the last few messages between the local user and 
the remote user:

${inputMessagesArray.join("\n")}

YOUR RESPONSE AS THE LOCAL USER: _____

Ensure you parse your response as a json object with the following 
format: {
    "message": "YOUR RESPONSE HERE"
}

ONLY respond in this format. Do not reply with anything but the 
json object.

        `;
    console.log(output); // debug
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

    let messageArray = messages._array;

    // format the messages
    for (let i = 0; i < numberOfMessages; i++) {
      formattedMessageArray[
        i
        // messageArray[i].author.globalName is the display name
      ] = `${this.getUserType(messageArray[i].author.username)}: ${
        messageArray[i].content
      }`;
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
      const response = await this.getReplyFromAI(
        this.MessagesArray
      );
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
    try {
      const response = await this.getGeneratedResponse(15);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
};
