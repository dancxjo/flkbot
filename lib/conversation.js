const irc = require('irc');
const Matcher = require('../src/matcher');
const wiktionary = require('node-wiktionary-translation')();

const minNam = process.env.SPRAKAR_NAM || 'andersprakMakin';
const channelNam = process.env.SPRAKAR_NAM || '##folksprak';

const client = new irc.Client('irc.freenode.net', minNam, { channels: [channelNam] });

client.addListener('invite', (channel, from, message) => client.join(channel, () => client.say(channel, 'Haj, timer!')));

const languages = {
    'englisk': 'en',
    'duytisk': 'de',
    'dütisk': 'de',
    'nederlandisk': 'nl',
    'frankisk': 'fr',
    'esperanto': 'eo'
};

const sourceLanguages = ['en', 'de', 'nl', Swedish, Norwegian, Danish, Icelandic, Afrikaans, Yiddish];

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);

    let responded = false;
    const matcher = Matcher.directAddress(minNam);
    matcher.match(message, matches => {
        message = matches[0];
        console.log('Received the message from', from, message);

        const translator = Matcher.howDoYouSay(from);
        translator.match(message, matches => {
            let [_, source, word, destination] = matches;

            const sourceLang = languages[source];
            const destinationLang = languages[destination];

            if (!sourceLang) {
                client.say(to, `Fargiving, ${from}. Ek ken nit de sprak "${source}".`);
            } else if (!destinationLang) {
                client.say(to, `Fargiving, ${from}. Ek ken nit de sprak "${destination}".`);
            } else if (sourceLang == destinationLang) {
                client.say(to, `Natuyrlik, ${from}, de ${source} vord "${word}" in ${destination} ar "${word}".`);
            } else {
                console.log(sourceLang, destinationLang);
                wiktionarygtion(word, sourceLang, destinationLang, function (terms, err) {
                    if (err) {
                        console.error(err);
                        client.say(to, `Fargiving, ${from}. Edvat ar nit regt. ${err}`);
                    } else if (!terms) {
                        client.say(to, `Fargiving, ${from}. Ek vet nit hur tu sege "${word}" in ${destination}. :(`);
                    } else {
                        console.log(terms);
                        terms = terms.map(term => `"${term}"`);
                        const lastTerm = terms.pop();
                        const list = terms.length > 0 ? terms.join(', ') + ` er ${lastTerm}` : lastTerm;
                        client.say(to, `In ${destination}, fur to mene "${word}", man seg ${list}.`);
                    }
                });
            }

            responded = true;
        });

        if (!responded) {
            client.say(to, `Kan ek helpe dek, ${from}? Du kan frege mek so: Hur seg man de englisk vord "popcorn" in dütisk? Ef ek ken de vord, ek vil sege hit to dek.`);
        }
    });
});

client.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
    client.say(from, 'Ja. Ek ar har!');
});

client.addListener('error', function (message) {
    console.log('error: ', message);
});

client.addListener('registered', function (message) {
    console.log('registerd: ', message);
});

module.exports = client;