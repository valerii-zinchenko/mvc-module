'use strict';

suite('MVCModule', function() {
	suite('Constructor', function(){
		[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].forEach(function(testCase){
			test('model: ' + testCase, function(){
				assert.throw(function(){
					new MVCModule(testCase, {});
				}, Error, 'Incorrect types of input arguments. Expected: Object model, Object modes');
			});

			test('modes: ' + testCase, function(){
				assert.throw(function(){
					new MVCModule({}, testCase);
				}, Error, 'Incorrect types of input arguments. Expected: Object model, Object modes');
			});
		});

		suite('correct input arguments', function(){
			test('without a map environment-mode', function(){
				var model = {};
				var modes = {};

				var uut;
				assert.doesNotThrow(function(){
					uut = new MVCModule(model, modes);
				});

				assert.equal(uut.model, model, 'Model\'s object was incotrrectly set');
				assert.equal(uut.modes, modes, 'Modes\' object was incotrrectly set');
			});

			suite('with a environment-mode map', function(){
				[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].forEach(function(testCase){
					test('incorect type: ' + testCase, function(){
						var model = {};
						var modes = {};

						var uut;
						assert.doesNotThrow(function(){
							uut = new MVCModule(model, modes, testCase);
						});

						assert.equal(uut.model, model, 'Model\'s object was incotrrectly set');
						assert.equal(uut.modes, modes, 'Modes\' object was incotrrectly set');
						assert.notEqual(uut.envModeMap, testCase, 'Map should not be changed');
					});
				});

				test('correct type', function(){
					var model = {};
					var modes = {};
					var envModeMap = {};

					var uut;
					assert.doesNotThrow(function(){
						uut = new MVCModule(model, modes, envModeMap);
					});

					assert.equal(uut.model, model, 'Model\'s object was incotrrectly set');
					assert.equal(uut.modes, modes, 'Modes\' object was incotrrectly set');
					assert.equal(uut.envModeMap, envModeMap, 'Map of environment-mode was not set');
				});
			});
		});
	});

	suite('Methods', function() {
		var uut;
		setup(function() {
			uut = new MVCModule({}, {
				mode: (AFMode({
					View: AView,
					Decorators: {
						deco: ADecorator
					}
				}))({})
			}, {
				someEnv: 'mode'
			});
		});
		teardown(function() {
			uut = null;
		});

		suite('getMode', function() {
			test('Undefined mode', function() {
				var result;
				assert.doesNotThrow(function(){
					result = uut.getMode('str');
				});

				assert.isNull(result, 'Null should be returned if desired mode is not exist');
			});

			test('existing mode', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getMode('mode');
				});

				assert.equal(result, uut.modes.mode, 'Incorrect existing mode was returned');
			});

			test('with decorator', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getMode('mode', 'deco');
				});

				assert.equal(result.view, uut.modes.mode._decorators.deco, 'Afeter decorating the "view" should point to the decorator object');
			});
		});

		suite('getModeFor', function(){
			test('not registered mapping', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getModeFor('eeeeenv');
				});

				assert.isNull(result, 'Null should be returned, because it is not defined what mode should be used for a specific environment');
			});

			test('registered mapping', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getModeFor('someEnv');
				});

				assert.equal(result, uut.modes.mode, 'Incorrect mode was returned');
			});

			test('registered mapping with a decorator', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getModeFor('someEnv', 'deco');
				});

				assert.equal(result, uut.modes.mode, 'Incorrect mode was returned');
				assert.equal(result.view, uut.modes.mode._decorators.deco, 'Mode was not decorated');
			});
		});
	});
});
