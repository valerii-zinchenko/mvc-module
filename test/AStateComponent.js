'use strict';

suite('AStateComponent', function(){
	suite('Constructor', function() {
		test('new', function(){
			assert.doesNotThrow(function(){
				new AStateComponent();
			});
		});

		suite('configuration input argument', function(){
			test('incorrect type', function(){
				[undefined, null, false, true, 0, 1, '', '1', [], function(){}].forEach(function(testCase) {
					var result;
					assert.doesNotThrow(function(){
						result = new AStateComponent(testCase);
					});
					assert.isNull(result.config, 'Configuration should not be set if it\'s type is incorrect');
				});
			});

			test('correct type', function(){
				var config = {};

				var result;
				assert.doesNotThrow(function(){
					result = new AStateComponent(config);
				});
				assert.equal(result.config, config, 'Component\'s config was not set');
			});
		});
	});

	suite('Methods', function(){
		var aStateComponent;
		setup(function(){
			aStateComponent = new AStateComponent();
		});
		teardown(function(){
			aStateComponent = null;
		});

		test('connect', function(){
			assert.doesNotThrow(function(){
				aStateComponent.connect();
			});
		});

		test('destruct', function() {
			assert.doesNotThrow(function(){
				aStateComponent.destruct();
			});

			assert.isNull(aStateComponent.model, 'destruct() should set model to null');
			assert.isNull(aStateComponent.config, 'destruct() should set config to null');
		});

		suite('setModel', function(){
			test('incorrect typed', function() {
				[undefined, null, false, true, 0, 1, '', '1', [], function(){}].forEach(function(tesCase) {
					assert.throw(function(){
						aStateComponent.setModel(tesCase);
					}, Error, 'Model for the state is not defined');
				});
			});

			test('correct type', function() {
				var model = {};

				assert.doesNotThrow(function(){
					aStateComponent.setModel(model);
				});
				assert.equal(aStateComponent.model, model, 'Model object was incorreclty set');
			});
		});

	});
});
