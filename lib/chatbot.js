const translate = require('./translator');

module.exports = class Chatbot {
    constructor(client) {
        this.client = client;

        this.pmHandlers = [];
        this.messageHandlers = [];

        this.handleEvents();

        this.acceptInvites();
        this.returnGreetings();
        this.respondToPings();
        this.leaveWhenRequested();

        this.tryToTranslate('englisk');
        this.tryToTranslate('dütisk');
        this.tryToTranslate('nederlandisk');
        this.tryToTranslate('svedisk');
    }

    handleEvents() {
        this.client.addListener('message', (from, to, message) => {
            console.log(`Received a message in ${to}`);
            if (this.isDirectlyAddressed(message)) {
                console.log(`This message was directly addressed to me`);
                message = this.removeDirectAddress(message);
                for (let handler of this.messageHandlers) {
                    handler(from, to, message);
                }
            }
        });

        this.client.addListener('pm', (from, message) => {
            console.log(`Received a private message`);
            message = this.removeDirectAddress(message);
            for (let handler of this.pmHandlers) {
                handler(from, from, message);
            }
        });
    }

    get name() {
        return this.client.nick;
    }

    get directAddressPattern() {
        return new RegExp(`((, ${this.name},?)|(^${this.name}[,:]\\s*))`, 'gi');
    }

    youCanSay(message) {
        this.listenFor(/Vat kan (?:ek|vi|man) sege(?: to dek)?\?/i, (from, to) => {
            this.client.say(to, message);
        });
    }

    translate(to, from, word, source, destination) {
        return translate(word, source, destination).then(translations => {
            if (translations.length < 1) {
                throw new Error('No translations available');
            }

            const quoted = translations.map(term => `"${term}"`);
            const lastTranslation = quoted.pop();
            const list = quoted.length > 0 ? quoted.join(', ') + ` er ${lastTranslation}` : lastTranslation;
            this.client.say(to, `In ${destination}, fur tu mene de ${source} "${word}", man seg ${list}.`);
        }).catch(err => this.client.say(to, `Fargiving, ${from}. Ek vet nit hur tu sege de ${source} "${word}" in ${destination}. :(`));
    }

    tryToTranslate(source) {
        this.youCanSay(`Du kan frege mek tu oversete en ${source} vord in ander sprak. Hur seg man "popcorn" in dütisk?`);

        const pattern = new RegExp(`(?:Hur|(?:Vilk mot)) seg (?:man|maner|du|di|vi)(?: de ${source}(?: vord)?)? "(.+?)" in (.+?)\\?`, 'i');

        this.listenFor(pattern, (from, to, matches) => {
            const word = matches[1];
            const destination = matches[2];

            if (source == destination) return;

            console.log(`Attempting to translate ${source} ${word} into ${destination}`);
            this.translate(to, from, word, source, destination);
        });
    }

    acceptInvites() {
        this.youCanSay('Du kan inbode mek to en timer and ek vil kome.');

        const join = channel => this.client.join(channel, () => this.client.say(channel, 'Haj, alve!'));

        this.client.addListener('invite', join);
        this.listenFor(/Ga in (#.+)\.?/i, (from, to, matches) => {
            this.client.say(to, `Oké, ${from}. Ek ga in dar nu.`);
            join(matches[1]);
        });
    }

    returnGreetings() {
        this.youCanSay('Du kan sege haj to mek.');

        this.listenFor(/Haj!?/i, (from, to) => {
            this.client.say(to, `Haj, ${from}!`);
        });

        this.listenFor(/Vat skej\?/i, (from, to) => {
            this.client.say(to, `Nivat nü, ${from}. Vat skej med du?`);
        });
    }

    respondToPings() {
        this.youCanSay('Du kan frege to mek, ef ek ar har.');

        this.listenFor(/Ar du (?:har|dar)\?/i, (from, to) => {
            this.client.say(to, 'Ja. Ek ar har.');
        });
    }

    leaveWhenRequested() {
        this.youCanSay('Du kan sege to mek tu ga ut av de timer.');

        this.listenInChannelFor(/Ga ut(?: av (?:har|(?:dis|de) timer))?/i, (from, timer) => {
            this.client.say(timer, `Hav hit gud, alve!`);
            this.client.part(timer);
        });
    }

    isDirectlyAddressed(message) {
        return this.directAddressPattern.test(message);
    }

    removeDirectAddress(message) {
        return message.replace(this.directAddressPattern, '');
    }

    listenFor(pattern, respond) {
        this.listenInChannelFor(pattern, respond);
        this.listenForPrivateMessage(pattern, respond);
    }

    listenInChannelFor(pattern, respond) {
        this.messageHandlers.push((from, to, message) => {
            let matches = message.match(pattern);
            if (matches) {
                respond(from, to, matches);
            }
        });
    }

    listenForPrivateMessage(pattern, respond) {
        this.pmHandlers.push((from, message) => {
            let matches = message.match(pattern);
            if (matches) {
                respond(from, from, matches);
            }
        });
    }
};