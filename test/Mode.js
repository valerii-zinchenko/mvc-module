'use strict';

suite('Mode', function(){
	suite('Constructor', function(){
		suite('incorrect input properties', function(){
			[].concat(
				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].map(function(input){
					return {
						input: input,
						exception: 'Incorrect type of the mode\'s properties. Expected: Object'
					};
				}),

				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].map(function(input){
					return {
						input: {model: input},
						exception: 'Incorrect type of the model. Expected: Object'
					};
				}),

				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].map(function(input){
					return {
						input: {
							model: {},
							view: input
						},
						exception: 'View should be inherited from AView'
					};
				}),

				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].map(function(input){
					var model = {};
					return {
						input: {
							model: model,
							view: new AView(model),
							decorators: {
								deco: input
							}
						},
						exception: 'Decorator "deco" should be inherited from ADecorator'
					};
				}),

				[1, true, 'str', [], function(){}, {}].map(function(input){
					var model = {};
					return {
						input: {
							model: model,
							view: new AView(model),
							control: input
						},
						exception: 'Control should be inherited from AControl'
					};
				})
			).forEach(function(testCase){
				test('input: ' + JSON.stringify(testCase.input), function(){
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
								view: new AView({}),
								control: testCase
							});
						});

						assert.isNull(result.control, 'Control object should be null if incompatible object is trying to be set');
					});
				});
			});

			suite('incompatible decorators object', function(){
				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].forEach(function(testCase){
					test('input: ' + testCase, function(){
						var result;
						assert.doesNotThrow(function(){
							result = new Mode({
								model: {},
								view: new AView({}),
								decorators: testCase
							});
						});

						assert.isTrue(Object.keys(result._decorators).length === 0, 'Initiali object of decorators should not be changed');
					});
				});
			});
		});

		suite('whole successful constructing', function(){
			setup(function(){
				sinon.spy(Mode.prototype, 'connect');
			});
			teardown(function(){
				Mode.prototype.connect.restore();
			});

			test('methods\'s chain', function(){
				var model = {};
				var view = new AView();
				var control = new AControl();
				var decorators = {
					deco: new (Class(ADecorator, null, {})),
					anotherdeco: new (Class(ADecorator, null, {}))
				};

				var result;
				assert.doesNotThrow(function(){
					result = new Mode({
						model: model,
						view: view,
						control: control,
						decorators: decorators
					});
				});

				assert.equal(result.model, model, 'Model was incorrectly set');
				assert.equal(result._view, view, 'Main undecorated view was incorrectly set');
				assert.equal(result.view, view, 'Final view was incorrectly set');
				assert.equal(result.control, control, 'Control was incorrectly set');
				assert.isUndefined(result._decorators.nofn, 'Incorrect decorator should not be set to a map of available decorators');
				assert.isUndefined(result._decorators.incomp, 'Incompatible decoratorshould not be set to a map of available decorators');
				assert.equal(result._decorators.deco, decorators.deco, 'Compatible decorator\'s constructor was lost');
			});
		});
	});

	suite('Methods', function(){
		var mode;
		setup(function(){
			mode = new Mode({
				model: {},
				view: new AView(),
				control: new AControl(),
				decorators: {
					deco0: new (Class(ADecorator, null, {})),
					deco1: new (Class(ADecorator, null, {}))
				}
			});
		});
		teardown(function(){
			mode = null;
		});

		suite('connect', function(){
			setup(function(){
				mode._isConnected = false;

				sinon.spy(mode._view, 'setModel');
				sinon.spy(mode._view, 'connect');
				sinon.spy(mode._view, 'setControl');
				sinon.spy(mode._view, 'render');
				sinon.spy(AControl.prototype, 'setModel');
				sinon.spy(AControl.prototype, 'setView');
				sinon.spy(AControl.prototype, 'connect');
				sinon.spy(mode._decorators.deco0, 'setModel');
				sinon.spy(mode._decorators.deco0, 'render');
				sinon.spy(mode._decorators.deco1, 'setModel');
				sinon.spy(mode._decorators.deco1, 'render');
			});
			teardown(function(){
				mode._view.setModel.restore();
				mode._view.connect.restore();
				mode._view.setControl.restore();
				mode._view.render.restore();
				AControl.prototype.setModel.restore();
				AControl.prototype.setView.restore();
				AControl.prototype.connect.restore();
				mode._decorators.deco0.setModel.restore();
				mode._decorators.deco0.render.restore();
				mode._decorators.deco1.setModel.restore();
				mode._decorators.deco1.render.restore();
			});

			test('without control', function(){
				mode.control = null;
				assert.doesNotThrow(function(){
					mode.connect();
					mode.connect();
				});

				assert.isTrue(mode._view.setModel.withArgs(mode.model).calledOnce, 'Model should be set to the view');
				assert.isTrue(mode._view.connect.calledOnce, 'Mode components was not connected to the view');
				assert.isFalse(mode._view.setControl.called, 'Control component should not be set when the mode hasn\'t  control component');

				assert.isTrue(mode._view.render.calledAfter(mode._view.connect), 'View should be rendered after the connecting of all modes\' components');

				var decorator;
				for (var key in this._decorators) {
					decorator = mode._decorators[key];
					assert.isTrue(decorator.setModel.withArgs(mode.model).calledOnce, 'Model should be set into the decorator ' + key);
					assert.isTrue(decorator.render.calledAfter(decorator.setModel), 'Decorator "' + key + '" should be rendered after the model will be set');
				}
			});

			test('with control', function(){
				assert.doesNotThrow(function(){
					mode.connect();
					mode.connect();
				});

				assert.isTrue(mode._view.setModel.withArgs(mode.model).calledOnce, 'Model should be set to the view');
				assert.isTrue(mode._view.setControl.calledOnce, 'Control component was not be set');
				assert.isTrue(mode._view.connect.calledOnce, 'Mode components was not connected to the view');
				assert.isTrue(mode._view.setModel.calledBefore(mode._view.setControl), 'Model should be set first');
				assert.isTrue(mode._view.connect.calledAfter(mode._view.setControl), 'Control should be set to the view before connect()');
				assert.isTrue(mode._view.render.calledAfter(mode._view.connect), 'View should be rendered after the connecting of all modes\' components');

				assert.isTrue(mode.control.setModel.withArgs(mode.model).calledOnce, 'Model should be set to the control');
				assert.isTrue(mode.control.setView.calledOnce, 'Control component was not be set');
				assert.isTrue(mode.control.connect.calledOnce, 'Mode components was not connected to the view');
				assert.isTrue(mode.control.setModel.calledBefore(mode.control.setView), 'Model should be set first');
				assert.isTrue(mode.control.connect.calledAfter(mode.control.setView), 'View should be set to the ontrol before connect()');

				var decorator;
				for (var key in this._decorators) {
					decorator = mode._decorators[key];
					assert.isTrue(decorator.setModel.withArgs(mode.model).calledOnce, 'Model should be set into the decorator ' + key);
					assert.isTrue(decorator.render.calledAfter(decorator.setModel), 'Decorator "' + key + '" should be rendered after the model will be set');
				}
			});
		});

		suite('decorateWith', function(){
			suite('order of decoration and called methods', function(){
				setup(function(){
					sinon.stub(ADecorator.prototype, 'setComponent');
				});
				teardown(function(){
					ADecorator.prototype.setComponent.restore();
				});

				test('decorator does not exist', function(){
					assert.doesNotThrow(function(){
						mode.decorateWith('nothing');
					});

					assert.isFalse(ADecorator.prototype.setComponent.called, '"setComponent" should not be called at all, if decorator does not registered');
				});

				test('one decorator', function(){
					assert.doesNotThrow(function(){
						mode.decorateWith('deco0');
					});

					assert.isTrue(ADecorator.prototype.setComponent.calledOnce, 'Decorator should accept some decorated view only once');
					assert.isTrue(ADecorator.prototype.setComponent.withArgs(mode._view).called, 'Decorator should accept initial mode view only once');
				});

				test('two decorators', function(){
					assert.doesNotThrow(function(){
						mode.decorateWith(['deco0', 'deco1']);
					});

					assert.isTrue(ADecorator.prototype.setComponent.calledTwice, 'Decorator should accept some decorated view only once');
					assert.isTrue(mode._decorators.deco0.setComponent.withArgs(mode._view).calledBefore(mode._decorators.deco1.setComponent.withArgs(mode._decorators.deco0)), 'Decorators were applied in the incorrect sequesnce');
				});
			});

			suite('public view', function(){
				suite('no decorating', function(){
					[undefined, null, false, true, 0, 1, {}, function(){}, '', []].forEach(function(input){
						test('input: ' + JSON.stringify(input), function(){
							assert.doesNotThrow(function(){
								mode.decorateWith(input);
							});

							assert.equal(mode.view, mode._view, 'Incorrect final reference was set to the this.view');
						});
					});
				});

				suite('decorating', function(){
					[
						{
							decorators: 'deco0',
							expected: 'deco0'
						},
						{
							decorators: 'deco1',
							expected: 'deco1'
						},

						{
							decorators: ['deco1', 'deco0'],
							expected: 'deco0'
						},
						{
							decorators: ['deco0', 'deco1'],
							expected: 'deco1'
						},

						{
							decorators: ['none', 'deco0', 'deco1'],
							expected: 'deco1'
						},
						{
							decorators: ['deco0', 'none', 'deco1'],
							expected: 'deco1'
						},
						{
							decorators: ['deco0', 'deco1', 'none'],
							expected: 'deco1'
						}
					].forEach(function(testCase){
						test(JSON.stringify(testCase.decorators), function(){
							assert.doesNotThrow(function(){
								mode.decorateWith(testCase.decorators);
							});

							assert.equal(mode.view, mode._decorators[testCase.expected], 'Incorrect final reference was set to the this.view');
						});
					});
				});
			});
		});
	});
});
