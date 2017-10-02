const irc = require('irc');
const Chatbot = require('./chatbot');

const server = process.env.SERVER || 'irc.freenode.net';
const minNam = process.env.SPRAKAR_NAM || 'folkbot';
const channelNam = process.env.SPRAKAR_NAM || '#folkbot';

const client = new irc.Client(server, minNam, {channels: [channelNam]});

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
