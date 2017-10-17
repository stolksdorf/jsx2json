const WHITESPACE = /(\s|\t|\n|\r)/g;
const NUMBERS = /[0-9]/;
const NAME = /[0-9a-zA-Z_\.]/;

module.exports = (input)=>{
	let tokens = [];
	let current = 0;
	let inTag = false;

	while(current < input.length){
		let char = input[current];

		const getToken = function(regex){
			let value = '';
			while(regex.test(char) && current < input.length){
				value += char;
				char = input[++current];
			}
			return value;
		}

		const getCode = ()=>{
			let code = '';
			let braceCount = 1;
			while(braceCount > 0 && current < input.length){
				char = input[++current];
				if(char == '{') braceCount++;
				if(char == '}') braceCount--;
				code += char
			}
			return code.slice(0,-1);
		};

		if(inTag){
			if(char == '>'){
				inTag = false;
				tokens.push({ type : 'closeTag' })
			}
			else if(char == '/' && input[current+1] == '>'){
				inTag = false;
				tokens.push({ type : 'endTag' })
				current++;
			}
			else if(char == '='){
				tokens.push({ type : 'equals' });
			}
			else if(char == '{'){
				tokens.push({
					type : 'code',
					value : getCode()
				})
			}
			else if(WHITESPACE.test(char)){

			}
			else if(NUMBERS.test(char)){
				tokens.push({
					type : 'number',
					value : Number(getToken(NUMBERS))
				});
				current--;
			}
			else if(NAME.test(char)){
				const word = getToken(NAME);
				if(word == 'true' || word == 'false'){
					tokens.push({
						type : 'boolean',
						value : word == 'true'
					});
				}else{
					tokens.push({
						type : 'word',
						value : word
					});
				}
				current--;
			}
			else if(char == "'"){
				char = input[++current]
				tokens.push({
					type : 'text',
					value : getToken(/[^\']/)
				});
			}
			else if(char == '"'){
				char = input[++current]
				tokens.push({
					type : 'text',
					value : getToken(/[^\"]/)
				});
			}
		}
		//Not tokenizing a tag definition
		else{
			//End tag
			if(char == '<' && input[current+1] == '/'){
				char = input[++current]
				char = input[++current]
				tokens.push({
					type : 'endTag',
					value : getToken(NAME)
				})
			}
			else if(char == '<'){
				inTag = true;
				char = input[++current];
				tokens.push({
					type : 'openTag',
					value : getToken(NAME)
				})
				current--;
			}
			else{
				//Handle slush text
				let value = '';
				while(char != '<' && current < input.length){
					value += char;
					char = input[++current];
				}
				value = value.trim()
				if(value){
					tokens.push({
						type : 'text',
						value : value
					});
				}
				current--;
			}
		}
		current++;
	}
	return tokens;
}