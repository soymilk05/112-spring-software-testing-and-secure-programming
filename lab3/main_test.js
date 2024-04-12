const { describe, test } = require('node:test');
const assert = require('assert');
const { Calculator } = require('./main');

describe('Calculator', () => {
    const calc = new Calculator();
    test('exp', () => {
        assert.strictEqual(calc.exp(0),1);
        assert.throws(() => calc.exp('hello'), Error, 'unsupported operand type');
        assert.throws(() => calc.exp(10000), Error, 'overflow');
    });

    test('exp', () => {
        assert.strictEqual(calc.log(1),0);
        assert.throws(() => calc.log(-1), Error, 'math domain error (2)');
        assert.throws(() => calc.log(0), Error, 'math domain error (1)');
        assert.throws(() => calc.log('a'), Error, 'unsupported operand type');
    });
});
