class Matcher {
    constructor(pattern, replacement) {
        this.pattern = pattern;
        this.replacement = replacement;
    }

    match(input, resolve) {
        const matches = input.match(this.pattern);
        if (matches) {
            if (this.replacement !== undefined) {
                matches[0] = input.replace(this.pattern, this.replacement);
            }
            resolve(matches);
        }
    }

    static directAddress(name) {
        return new Matcher(new RegExp(`((, ${name},?)|(^${name}[,:]\\s*))`, 'gi'), '');
    }

    static howDoYouSay(interlocutor) {
        return new Matcher(/Hur seg man de (.+?) vord "(.+?)" in (.+?)\?/i);
    }
}

module.exports = Matcher;