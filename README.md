# jsx2json [![NPM version](https://badge.fury.io/js/jsx2json.svg)](http://badge.fury.io/js/jsx2json)

`jsx2json` parses JSX into usable JSON.


### install

`npm install jsx2json`


### features

- No dependacies
- Props without values are defaulted to true
- Handles custom tag types
- Passing in multiple root tags will result in an array.
- Handles object-based tag types, eg. `<Nav.Item>`
- Can parse object or functional props with the `useEval` option


### use

```jsx
const jsx2json = require('jsx2json');
const result = jsx2json(`<button disabled>Hello</button>`)

//Result
{
	type : 'button',
	props : {
		disabled : true
	},
	children : ['Hello']
}

```


### using eval

if you would like to parse javascript-based parameters, you can use the `useEval` option. *Note:* Not only is using `eval` dangerous if you aren't controlling the input, but the result of `jsx2json` may not be pure JSON.

```jsx
jsx2json(`<button onClick={()=>alert('hey!')} style={{top : '4px', color : 'white'}} />`);

//Result
{
	type : 'button',
	props : {
		onClick : ()=>{
			alert('hey!')
		},
		style : {
			top : '4px',
			color : 'white'
		}
	},
	children : []
}
```


### complex use case

```jsx
const result = jsx2json(`
	<Nav.Item className='test'>
		Hello <a href='/test'>you</a>
	</Nav.Item>
	<button disabled onClick={()=>alert('pressed!')}>Press me</button>
`, {useEval : true});
```

*Result*

```js
[
	{
		type: 'Nav.Item',
		props : {
			className : 'test'
		},
		children : [
			'Hello',
			{
				type : 'a',
				props : {
					href : '/test'
				},
				children : ['you']
			}
		]
	},
	{
		type : 'button',
		props : {
			disabled : true,
			onClick : ()=>{alert('pressed!')}
		},
		children : [ 'Press me' ]
	}
]
```
