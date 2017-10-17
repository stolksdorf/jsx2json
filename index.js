const tokenizer = require('./jsx.tokenizer.js');
const parser = require('./jsx.parser.js');

module.exports = (input, opts={})=>parser(tokenizer(input), opts);