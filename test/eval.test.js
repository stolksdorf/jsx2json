const test = require('ava');
const jsx2json = require('../index.js');

test('handles injected object', (t)=>{
	const res = jsx2json(`<div style={{ top : '5px', left : '-30px'}} />`, {useEval : true});
	t.is(res.props.style.top, '5px');
	t.is(res.props.style.left, '-30px');
});

test('handles injected function', (t)=>{
	const res = jsx2json(`<button onClick={()=>'success'} />`, {useEval : true});

	t.is(typeof res.props.onClick, 'function');
	t.is(res.props.onClick(), 'success');
});
