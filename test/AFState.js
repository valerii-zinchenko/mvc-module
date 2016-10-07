'use strict';

suite('AFState', function(){
	suite('incorrect input argument', function(){
		[].concat(
			[
				undefined,
				null,
				false,
				true,
				0,
				1,
				'',
				'str',
				[],
				function(){}
			].map(function(input){
				return {
					title: 'type of an input argument: ' + Object.prototype.toString.call(input) + ' with a value: ' + input,
					input: input,
					expected: 'Incorrect type of the constructors. Object expected.'
				};
			}),
			[
				undefined,
				null,
				false,
				true,
				0,
				1,
				'',
				'str',
				[],
				{}
			].map(function(input){
				return {
					title: 'type of a View constructor: ' + Object.prototype.toString(input) + ' with a value: ' + input,
					input: {View: input},
					expected: 'Incorrect type of a view\'s constructor. Expected: Function'
				};
			}),
			[
				true,
				1,
				'str',
				[],
				{}
			].map(function(input){
				return {
					title: 'type of a Controller: ' + Object.prototype.toString(input) + ' with a value: ' + input,
					input: {
						View: function(){},
						Control: input
					},
					expected: 'Incorrect type of a control\'s constructor. Expected: Function'
				};
			})
		).forEach(function(testCase){
			test(testCase.title, function(){
				assert.throw(function(){
					AFState(testCase.input);
				}, Error, testCase.expected);
			});
		});
	});

	suite('correct arguments', function(){
		[
			{
				View: function(){}
			},
			{
				View: function(){},
				Constrol: function(){}
			},
			{
				View: function(){},
				Decorators: {
					Deco: function(){},
					notdeco: '123'
				}
			},
			{
				View: function(){},
				Constrol: function(){},
				Decorators: {
					Deco: function(){}
				}
			}
		].forEach(function(testCase){
			test(JSON.stringify(testCase), function(){
				assert.doesNotThrow(function(){
					AFState(testCase);
				});
			});
		});
	});

	suite('State builder. Integration tests with State', function(){
		setup(function(){
			sinon.spy(AStateComponent.prototype, "connect");
		});
		teardown(function(){
			AStateComponent.prototype.connect.restore();
		});

		test('without model in input arguments', function(){
			var result;
			assert.throw(function(){
				result = (AFState({View: AView}))();
			}, Error, 'Incorrect type of the model. Expected: Object');
		});

		test('without ControlConstructor', function(){
			var model = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({View: AView}))(model);
			});

			assert.isNotNull(result.view, 'View component of the state was not setup');
			assert.equal(result.view.model, model, 'Model was incorrectly set');
		});

		test('with ControlConstructor', function(){
			var model = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({
					View: AView,
					Control: AControl
				}))(model);
			});

			assert.isNotNull(result.view, 'View component of the state was not setup');
			assert.isNotNull(result.control, 'Control component of the state was not setup');
			assert.equal(result.control.model, model, 'Model was incorrectly set');
		});

		test('with Decorators', function(){
			var Deco = new Class(ADecorator, null, {
				initialize: sinon.stub()
			});
			var incorrectDeco = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({
					View: AView,
					Decorators: {
						Deco: Deco,
						incorrectDeco: incorrectDeco
					}
				}))({});
			});

			assert.isTrue(Deco.prototype.initialize.calledOnce, 'Decorator should be created in the state builder');
			assert.instanceOf(result._decorators.Deco, Deco, 'Decorator was incorrectly set');
			assert.isUndefined(result._decorators.incorrectDeco, 'Incorrect docarator should not be passed further to a state constructor');
		});

		test('state\'s configuration', function(){
			var config = {};

			var result;
			assert.doesNotThrow(function(){
				result = (AFState({
					View: AView,
					Control: AControl
				}))({}, config);
			});

			assert.equal(result.view.config, config, 'Configuration was incorrectly set to the view');
			assert.equal(result.control.config, config, 'Configuration was incorrectly set to the control');
		});
	});
});
