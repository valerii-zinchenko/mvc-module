'use strict';

suite('AFMVCModule', function() {
	suite('Input constructors', function() {
		suite('Exceptions', function() {
			[].concat(
				[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].map(function(testCase){
					return {
						input: testCase,
						error: 'Incorrect type of an input argument. Expected: Object MVCConstructors'
					};
				}),
				
				[undefined, null, false, true, 0, 1, '', 'str', [], {}].map(function(testCase){
					return {
						input: {
							Model: testCase,
							Modes: {
								mode: function(){}
							}
						},
						error: 'Model constructor should be a function'
					};
				}),

				[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							Modes: testCase
						},
						error: 'Incorrect type for model\'s modes'
					};
				}),

				[undefined, null, false, true, 0, 1, '', 'str', [], {}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							Modes: {
								mode: testCase
							}
						},
						error: 'Incorrect type of a mode "mode", Function expected'
					};
				}),
				[undefined, null, false, true, 0, 1, '', 'str', [], {}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							Modes: {
								mode: function(){},
								badMode: testCase
							}
						},
						error: 'Incorrect type of a mode "badMode", Function expected'
					};
				})
			).forEach(function(testCase){
				test('Input: ' + JSON.stringify(testCase.input) + '; exception: ' + testCase.error, function() {
					assert.throw(function() {
						AFMVCModule(testCase.input);
					}, Error, testCase.error);
				});
			});
		});
	});

	suite('Integration', function() {
		test('Constructing of each module\'s components', function() {
			var Module = sinon.spy();
			var Model = sinon.spy();
			var Mode = sinon.spy();

			var Builder;
			var result;
			assert.doesNotThrow(function() {
				Builder = AFMVCModule({
					Model: Model,
					Modes: {
						mode: Mode
					},
					Module: Module
				});

				result = Builder();
			});

			assert.isTrue(Model.calledWithNew(), 'Model\'s constructor should be called with "new" operator');
			var model = Model.returnValues[0];

			assert.isTrue(Mode.calledWithNew(), 'Mode\'s constructor should be called with "new" operator');
			assert.isTrue(Mode.calledWithExactly(model, undefined), 'Arguments for the mode\'s "mode" constructor were incorrectly passed');
			var mode = Mode.returnValues[0];

			assert.isTrue(Module.calledWithNew(), 'Module\'s constructor should be called with "new" operator');
			assert.equal(Module.args[0].length, 3, 'Incorrect amount of input arguments is passed into the module\'s constructor');
			assert.equal(Module.args[0][0], model, 'Model should be the first argument');
			assert.isObject(Module.args[0][1], 'Second argument should be an object of mode\'s modes');
			assert.equal(Module.args[0][1].mode, mode, 'Mode "mode" was incorrectly passed');

			assert.equal(result, Module.returnValues[0], 'Builder should return a result of module\'s constructor');
		});

		test('Default module\'s constructor', function() {
			var Model = sinon.spy();
			var Mode = sinon.spy();

			var Builder;
			var result;
			assert.doesNotThrow(function() {
				Builder = AFMVCModule({
					Model: Model,
					Modes: {
						mode: Mode
					}
				});

				result = Builder();
			});

			var model = Model.returnValues[0];
			var mode = Mode.returnValues[0];

			assert.instanceOf(result, MVCModule, 'Builder should call MVCModule\'s constructor');
		});

		test('Input arguments for a builder function.', function() {
			var Module = sinon.spy();
			var Model = sinon.spy();
			var Mode = sinon.spy();
			var Mode1 = sinon.spy();

			var modelArgs = [{}, {}];
			var modesConfigs = {
				mode: {}
			};

			var Builder;
			var result;
			assert.doesNotThrow(function() {
				Builder = AFMVCModule({
					Model: Model,
					Modes: {
						mode: Mode,
						mode1: Mode1
					},
					Module: Module
				});

				result = Builder(modelArgs, null, modesConfigs);
			});

			assert.isTrue(Model.calledWithExactly.apply(Model, modelArgs), 'Arguments for a model\'s constructor were incorrectly passed');
			var model = Model.returnValues[0];

			assert.isTrue(Mode.calledWithExactly(model, modesConfigs.mode), 'Arguments for the mode\'s "mode" constructor were incorrectly passed');
			var mode = Mode.returnValues[0];

			assert.isTrue(Mode1.calledWithExactly(model, undefined), 'Arguments for the mode\'s "mode1" constructor were incorrectly passed');
			var mode1 = Mode1.returnValues[0];

			assert.equal(Module.args[0].length, 3, 'Incorrect amount of input arguments is passed into the module\'s constructor');
			assert.equal(Module.args[0][0], model, 'Model should be the first argument');
			assert.isObject(Module.args[0][1], 'Second argument should be an object of mode\'s modes');
			assert.equal(Module.args[0][1].mode, mode, 'Mode "mode" was incorrectly passed');
			assert.equal(Module.args[0][1].mode1, mode1, 'Mode "mode1" was incorrectly passed');
		});
	});
});
