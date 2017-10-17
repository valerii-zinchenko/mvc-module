'use strict';

suite('utils', function() {
	test('whatIs', function(){
		[
			['', 'String'],
			[1, 'Number'],
			[true, 'Boolean'],
			[[], 'Array'],
			[{}, 'Object'],
			[function(){}, 'Function']
		].forEach(function(testCase){
			var result;
			assert.doesNotThrow(function(){
				result = utils.whatIs(testCase[0]);
			});
			assert.equal(result, '[object ' + testCase[1] + ']', 'Input was incorrectly converted into the string');
		});
	});

	suite('is', function(){
		setup(function(){
			sinon.stub(utils, 'whatIs');
		});
		teardown(function(){
			utils.whatIs.restore();
		});

		test('different types', function(){
			var data = [];
			utils.whatIs.returns('[object String]');

			var result;
			assert.doesNotThrow(function(){
				result = utils.is(data, 'Object');
			});

			assert.isTrue(utils.whatIs.withArgs(data).calledOnce, 'whatIs should be called in order to determine the type');
			assert.isFalse(result, 'Different types are not equal');
		});

		test('same types', function(){
			var data = [];
			utils.whatIs.returns('[object Array]');

			var result;
			assert.doesNotThrow(function(){
				result = utils.is(data, 'Array');
			});

			assert.isTrue(utils.whatIs.withArgs(data).calledOnce, 'whatIs should be called in order to determine the type');
			assert.isTrue(result, 'Same types are equal');
		});
	});
});
