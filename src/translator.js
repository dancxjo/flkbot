const wiktionary = require('node-wiktionary-translation')();

const languages = {
    'englisk': 'en',
    'duytisk': 'de',
    'dütisk': 'de',
    'nederlandisk': 'nl',
    'frankisk': 'fr',
    'esperanto': 'eo',
    'svedisk': 'sv'
};

module.exports = function (word, source, destination) {
    return new Promise((resolve, reject) => {
        const sourceCode = languages[source] || source;
        const destCode = languages[destination] || destination;
        
        console.log(`Looking up ${word} in the ${sourceCode} wiktionary to find the ${destCode}`);
        
        wiktionary.getDefinition(word, sourceCode, destCode, function (terms, err) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log('Got these translations', terms);
            resolve(terms);
          }
        });
    });
};
