const irc = require('irc');
const Chatbot = require('./chatbot');

const server = process.env.SERVER || 'irc.freenode.net';
const minNam = process.env.SPREKAR_NAM || 'folkbot';
const channelNam = process.env.CHAN_NAM || '#folkbot';
const username = process.env.USERNAME;
const password = process.env.PASSWORD;


const client = new irc.Client(server, minNam, {
    sasl: username ? true : undefined,
    userName: username || undefined,
    password: password || undefined,
    channels: [channelNam]
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

if (process.env.DEBUG) {
    client.addListener('raw', function(message) {
        console.log('raw: ', message);
    });
}


client.addListener('registered', function(message) {
    console.log('registered: ', message);
});

const chatbot = new Chatbot(client);
