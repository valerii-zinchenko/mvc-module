'use strict';

suite('AModeComponent', function(){
	suite('Constructor', function() {
		test('new', function(){
			assert.doesNotThrow(function(){
				new AModeComponent();
			});
		});

		suite('configuration input argument', function(){
			test('incorrect type', function(){
				[undefined, null, false, true, 0, 1, '', '1', [], function(){}].forEach(function(testCase) {
					var result;
					assert.doesNotThrow(function(){
						result = new AModeComponent(testCase);
					});
					assert.isNull(result.config, 'Configuration should not be set if it\'s type is incorrect');
				});
			});

			test('correct type', function(){
				var config = {};

				var result;
				assert.doesNotThrow(function(){
					result = new AModeComponent(config);
				});
				assert.equal(result.config, config, 'Component\'s config was not set');
			});
		});
	});

	suite('Methods', function(){
		var aModeComponent;
		setup(function(){
			aModeComponent = new AModeComponent();
		});
		teardown(function(){
			aModeComponent = null;
		});

		test('connect', function(){
			assert.doesNotThrow(function(){
				aModeComponent.connect();
			});
		});

		test('destruct', function() {
			assert.doesNotThrow(function(){
				aModeComponent.destruct();
			});

			assert.isNull(aModeComponent.model, 'destruct() should set model to null');
			assert.isNull(aModeComponent.config, 'destruct() should set config to null');
		});

		suite('setModel', function(){
			test('incorrect typed', function() {
				[undefined, null, false, true, 0, 1, '', '1', [], function(){}].forEach(function(tesCase) {
					assert.throw(function(){
						aModeComponent.setModel(tesCase);
					}, Error, 'Model for the mode is not defined');
				});
			});

			test('correct type', function() {
				var model = {};

				assert.doesNotThrow(function(){
					aModeComponent.setModel(model);
				});
				assert.equal(aModeComponent.model, model, 'Model object was incorreclty set');
			});
		});

	});
});
