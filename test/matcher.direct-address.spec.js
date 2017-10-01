const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


const Matcher = require('../src/matcher');

describe('direct address matcher', function() {
        const validInput = [
                ['Welcome, Bob!', 'Welcome!'], 
                ['Bob, what\'s new?', 'what\'s new?'], 
                [
                  'Do you think, Bob, I have enough time?',
                  'Do you think I have enough time?'
                ],
                ['Bob: What do you think?', 'What do you think?']
        ];
        
        const invalidInput = [
                'That Bob is a scoundrel!',
                'Bob is annoying.',
                'I just love that Bob!'
        ];

        for (let [input, expectedOutput] of validInput) {
                it(`should match a direct address "${input}"`, async function () {                       
                        const matcher = Matcher.directAddress('Bob');
                        const output = await matcher.match(input);
                        expect(output).to.be.an('array');
                        expect(output[0]).to.equal(expectedOutput);
                });
        }
        
        for (let input of invalidInput) {
            it(`should not match a direct address "${input}"`, function () {                       
                    const matcher = Matcher.directAddress('Bob');
                    
                    return expect(matcher.match(input)).to.be.rejectedWith('Unmatched');
            });
        }
});
