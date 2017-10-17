const test = require('ava');
const jsx2json = require('../index.js');


test('converts basic jsx', (t)=>{
	const res = jsx2json(`<div></div>`);

	t.is(res.type, 'div');
	t.is(res.children.length, 0);
});

test('fails on mismatched tags', (t)=>{
	try{
		const res = jsx2json(`<div></a>`);
		t.fail();
	}catch(e){
		t.is(e, 'Invalid closing tag: a. Expected closing tag of type: div');
	}
});


test('numbers within tag names work', (t)=>{
	const res1 = jsx2json(`<test1 />`);
	t.is(res1.type, 'test1');
})


test('Object tag names', (t)=>{
	const res = jsx2json(`<Nav.Link test>hello</Nav.Link>`);
	t.is(res.type, 'Nav.Link');
	t.is(res.props.test, true);
});

test('multiple root tags', (t)=>{
	const res = jsx2json(`<div></div><a></a>`);
	t.is(res.length, 2);
	t.is(res[0].type, 'div');
	t.is(res[1].type, 'a');
});


test('complex parse', (t)=>{
	const res = jsx2json(`<div test="hey there champ" more_cool=false size=0>
	<span>
		Hey there!
		<a>so cool </a>
	</span>
	test2
	<a href='neato' />
</div>`);

	t.is(res.type, 'div')
	t.is(res.props.test, 'hey there champ')
	t.is(res.props.size, 0);

	t.is(res.children[0].type, 'span');
	t.is(res.children[0].children[0], 'Hey there!');

	t.is(res.children[1], 'test2');

	t.is(res.children[2].type, 'a');
	t.is(res.children[2].props.href, 'neato');

});