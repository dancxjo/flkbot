const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


const Matcher = require('../src/matcher');

describe('how do you say matcher', function() {
        it(`should say it doesn't know words it doesn't know`, async function () {                       
                const matcher = Matcher.howDoYouSay('starla');
                const input = 'Hur seg man de englisk vord "hrioaduf" in duytisk?';
                const output = await matcher.match(input);
                expect(output).to.be.an('array');
                expect(output[0]).to.equal('Ek vet nit, starla. :(');
        });
        
        it(`should translate a simple word from English to German`, async function () {                       
                const matcher = Matcher.howDoYouSay('starla');
                const input = 'Hur seg man de englisk vord "dog" in duytisk?';
                const output = await matcher.match(input);
                
                expect(output).to.be.an('array');
                expect(output[0]).to.equal('Man seg "Hund", starla.');
        });        
});
