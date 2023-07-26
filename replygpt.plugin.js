/**
 * @name ReplyGPT
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
];

const MessageStore = BdApi.Webpack.getStore('MessageStore');
const UserMessageStore = BdApi.Webpack.getStore('UserProfileStore');
const ChannelMessageStore = BdApi.Webpack.getStore('ChannelStore');
   
module.exports = class ReplyGPT {
    constructor() {
        this.MessagesArray = []
        this.Settings = {
            OpenAIKey: "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",
            RandomDelayMin: 1,
            RandomDelayMax: 10,
            RandomDelayEnabled: true,
            CustomPrompt: "PROMPT_HERE",
            UseCustomPrompt: false,
        };
    }
  
    start() {
        this.getMessagesArray(); // Testing
        this.MessagesArray = testArray;// DEBUG - Set the MessagesArray to a test array
        console.log(this.MessagesArray);

        this.Settings = BdApi.Data.load("ReplyGPT", "settings") || this.Settings;
        this.getReplyFromAI(this.MessagesArray) // TODO: Implement message array passthrough
        .then(response => console.log(response))
        .catch(err => console.error(err));
    }

    stop() {
        BdApi.Data.save("ReplyGPT", "settings", this.Settings);
    }
  
    async getReplyFromAI(inputMessagesArray) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.Settings.OpenAIKey}`
            },
            body: JSON.stringify({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {"role": "system", "content": this.DefaultPrompt(inputMessagesArray)},
                    // {"role": "user", "content": userPrompt}
                ]
            })
        });

        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        } else {
           const jsonResp = await response.json();
           return jsonResp['choices'][0]['message']['content'];
        }
    }

    DefaultPrompt (inputMessagesArray) {
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

The following is the last 15 messages between the local user and 
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
        return output;
    }

    getMessagesArray() {
        // use Betterdiscord's MessageStore to get the last 15 messages
        // between the local user and the remote user
        // and return them as an array of strings
        
        const messages = MessageStore.getMessages();
        const messagesArray = [];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const author = message.author.username;
            const content = message.content;
            messagesArray.push(`${author}: ${content}`);
            console.log(`${author}: ${content}`)
        }
        // return messagesArray;
    }
};


