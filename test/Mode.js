'use strict';

suite('Mode', function(){
	suite('Constructor', function(){
		suite('incorrect input properties', function(){
			[].concat(
				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].map(function(input){
					return {
						title: 'incorrect type of input argument: ' + JSON.stringify(input),
						input: input,
						exception: 'Incorrect type of the mode\'s properties. Expected: Object'
					};
				}),

				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].map(function(input){
					return {
						title: 'incorrect type of model: ' + JSON.stringify(input),
						input: {model: input},
						exception: 'Incorrect type of the model. Expected: Object'
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
						title: 'type of a View constructor: ' + Object.prototype.toString.call(input) + ' with a value: ' + JSON.stringify(input),
						input: {
							model: {},
							View: input
						},
						exception: 'Incorrect type of a view\'s constructor. Expected: Function'
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
						title: 'type of a Control: ' + Object.prototype.toString.call(input) + ' with a value: ' + JSON.stringify(input),
						input: {
							model: {},
							View: function(){},
							Control: input
						},
						exception: 'Incorrect type of a control\'s constructor. Expected: Function'
					};
				}),

				[
					true,
					1,
					'str',
					[],
					function(){}
				].map(function(input){
					return {
						title: 'type of a Decorators: ' + Object.prototype.toString.call(input) + ' with a value: ' + JSON.stringify(input),
						input: {
							model: {},
							View: function(){},
							Decorators: input
						},
						exception: 'Incorrect type of map of decorators. Expected: Object. Where key is a decorator name, and value is a decorator constructor'
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
						title: 'type of a Decorator constructor: ' + Object.prototype.toString.call(input) + ' with a value: ' + JSON.stringify(input),
						input: {
							model: {},
							View: function(){},
							Decorators: {
								Deco: input
							}
						},
						exception: 'Incorrect type of a decorator\'s constructor "Deco". Expected: Function'
					};
				}),

				[1, true, 'str', [], {}].map(function(input){
					var model = {};
					return {
						input: {
							model: model,
							View: AView,
							Control: input
						},
						exception: 'Incorrect type of a control\'s constructor. Expected: Function'
					};
				}),
				{
					title: 'control instance is not an instance of AControl',
					input: {
						model: {},
						View: AView,
						Control: function(){}
					},
					exception: 'Control should be inherited from AControl'
				}
			).forEach(function(testCase){
				test(testCase.title || ('input: ' +JSON.stringify(testCase.input)), function(){
					assert.throw(function(){
						new Mode(testCase.input);
					}, Error, testCase.exception);
				});
			});
		});

		suite('skip some input property', function(){
			suite('incompatible control object', function(){
				[undefined, null, 0, false, ''].forEach(function(testCase){
					test('input: ' + testCase, function(){
						var result;
						assert.doesNotThrow(function(){
							result = new Mode({
								model: {},
								View: AView,
								Control: testCase
							});
						});

						assert.isNull(result.control, 'Control object should be null if incompatible object is trying to be set');
					});
				});
			});
		});

		suite('whole successful constructing', function(){
			setup(function(){
				sinon.spy(AControl.prototype, 'setModel');
				sinon.spy(AControl.prototype, 'connect');
			});
			teardown(function(){
				AControl.prototype.setModel.restore();
				AControl.prototype.connect.restore();
			});

			test('methods\'s chain', function(){
				var model = {};
				var Decorators = {
					deco: Class(ADecorator, null, {}),
					anotherdeco: Class(ADecorator, null, {})
				};

				var result = new Mode({
					model: model,
					View: AView,
					Control: AControl,
					Decorators: Decorators
				});

				assert.equal(result.model, model, 'Model was incorrectly set');
				assert.instanceOf(result.control, AControl, 'Control was incorrectly built');
				assert.equal(result.View, AView, 'View constructor was incorrectly set');
				assert.equal(result.Decorators, Decorators, 'Constructors for decorators were incorrectly set');



				assert.isTrue(result.control.setModel.calledOnce, 'Model should be set to the control');
				assert.isTrue(result.control.setModel.withArgs(result.model).calledOnce, 'Something wrong was set to the control as a model');
				assert.isTrue(result.control.connect.calledOnce, 'Control\'s "connect" method should be called to execute the connection routine');
				assert.isTrue(result.control.connect.calledAfter(result.control.setModel), 'Control\'s "connect" method should be called after model was set to it');
			});
		});
	});

	suite('Methods', function(){
		var mode;
		setup(function(){
			mode = new Mode({
				model: {},
				View: AView,
				Control: AControl,
				Decorators: {
					deco0: Class(ADecorator, null, {}),
					deco1: Class(ADecorator, null, {})
				}
			});
		});
		teardown(function(){
			mode = null;
		});

		suite('getView', function(){
			setup(function(){
			});
			teardown(function(){
			});

		});

		suite('decorate', function(){
			setup(function(){
				sinon.spy(ADecorator.prototype, 'setComponent');
			});
			teardown(function(){
				ADecorator.prototype.setComponent.restore();
			});

		});
	});
});
