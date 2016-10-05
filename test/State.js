'use strict';

suite('State', function(){
	suite('Constructor', function(){
		suite('incorrect input properties', function(){
			[].concat(
				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}].map(function(input){
					return {
						input: input,
						exception: 'Incorrect type of the state\'s properties. Expected: Object'
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
				})
			).forEach(function(testCase){
				test(JSON.stringify(testCase.input), function(){
					assert.throw(function(){
						new State(testCase.input);
					}, Error, testCase.exception);
				});
			});
		});

		suite('skip some input property', function(){
			suite('incompatible control object', function(){
				[undefined, null, 0, 1, false, true, '', 'str', [], function(){}, {}].forEach(function(testCase){
					test(testCase, function(){
						var result;
						assert.doesNotThrow(function(){
							result = new State({
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
					test(testCase, function(){
						var result;
						assert.doesNotThrow(function(){
							result = new State({
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
				sinon.spy(State.prototype, 'connect');
			});
			teardown(function(){
				State.prototype.connect.restore();
			});

			test('methods\'s chain', function(){
				var model = {};
				var view = new AView();
				var control = new AControl();
				var decorators = {
					notfn: {},
					incomp: function(){},
					deco: new (new Class(ADecorator, {}))
				};

				var result;
				assert.doesNotThrow(function(){
					result = new State({
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
		var state;
		setup(function(){
			state = new State({
				model: {},
				view: new AView(),
				control: new AControl(),
				decorators: {
					deco0: new (new Class(ADecorator, {})),
					deco1: new (new Class(ADecorator, {}))
				}
			});
		});
		teardown(function(){
			state = null;
		});

		suite('connect', function(){
			setup(function(){
				state._isConnected = false;

				sinon.spy(state._view, 'setModel');
				sinon.spy(state._view, 'connect');
				sinon.spy(state._view, 'setControl');
				sinon.spy(state._view, 'render');
				sinon.spy(AControl.prototype, 'setModel');
				sinon.spy(AControl.prototype, 'setView');
				sinon.spy(AControl.prototype, 'connect');
				sinon.spy(state._decorators.deco0, 'setModel');
				sinon.spy(state._decorators.deco0, 'render');
				sinon.spy(state._decorators.deco1, 'setModel');
				sinon.spy(state._decorators.deco1, 'render');
			});
			teardown(function(){
				state._view.setModel.restore();
				state._view.connect.restore();
				state._view.setControl.restore();
				state._view.render.restore();
				AControl.prototype.setModel.restore();
				AControl.prototype.setView.restore();
				AControl.prototype.connect.restore();
				state._decorators.deco0.setModel.restore();
				state._decorators.deco0.render.restore();
				state._decorators.deco1.setModel.restore();
				state._decorators.deco1.render.restore();
			});

			test('without control', function(){
				state.control = null;
				assert.doesNotThrow(function(){
					state.connect();
					state.connect();
				});

				assert.isTrue(state._view.setModel.withArgs(state.model).calledOnce, 'Model should be set to the view');
				assert.isTrue(state._view.connect.calledOnce, 'State components was not connected to the view');
				assert.isFalse(state._view.setControl.called, 'Control component should not be set when the state hasn\'t  control component');

				assert.isTrue(state._view.render.calledAfter(state._view.connect), 'View should be rendered after the connecting of all states\' components');

				var decorator;
				for (var key in this._decorators) {
					decorator = state._decorators[key];
					assert.isTrue(decorator.setModel.withArgs(state.model).calledOnce, 'Model should be set into the decorator ' + key);
					assert.isTrue(decorator.render.calledAfter(decorator.setModel), 'Decorator "' + key + '" should be rendered after the model will be set');
				}
			});

			test('with control', function(){
				assert.doesNotThrow(function(){
					state.connect();
					state.connect();
				});

				assert.isTrue(state._view.setModel.withArgs(state.model).calledOnce, 'Model should be set to the view');
				assert.isTrue(state._view.setControl.calledOnce, 'Control component was not be set');
				assert.isTrue(state._view.connect.calledOnce, 'State components was not connected to the view');
				assert.isTrue(state._view.setModel.calledBefore(state._view.setControl), 'Model should be set first');
				assert.isTrue(state._view.connect.calledAfter(state._view.setControl), 'Control should be set to the view before connect()');
				assert.isTrue(state._view.render.calledAfter(state._view.connect), 'View should be rendered after the connecting of all states\' components');

				assert.isTrue(state.control.setModel.withArgs(state.model).calledOnce, 'Model should be set to the control');
				assert.isTrue(state.control.setView.calledOnce, 'Control component was not be set');
				assert.isTrue(state.control.connect.calledOnce, 'State components was not connected to the view');
				assert.isTrue(state.control.setModel.calledBefore(state.control.setView), 'Model should be set first');
				assert.isTrue(state.control.connect.calledAfter(state.control.setView), 'View should be set to the ontrol before connect()');

				var decorator;
				for (var key in this._decorators) {
					decorator = state._decorators[key];
					assert.isTrue(decorator.setModel.withArgs(state.model).calledOnce, 'Model should be set into the decorator ' + key);
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
						state.decorateWith('nothing');
					});

					assert.isFalse(ADecorator.prototype.setComponent.called, '"setComponent" should not be called at all, if decorator does not registered');
				});

				test('one decorator', function(){
					assert.doesNotThrow(function(){
						state.decorateWith('deco0');
					});

					assert.isTrue(ADecorator.prototype.setComponent.calledOnce, 'Decorator should accept some decorated view only once');
					assert.isTrue(ADecorator.prototype.setComponent.withArgs(state._view).called, 'Decorator should accept initial state view only once');
				});

				test('two decorators', function(){
					assert.doesNotThrow(function(){
						state.decorateWith(['deco0', 'deco1']);
					});

					assert.isTrue(ADecorator.prototype.setComponent.calledTwice, 'Decorator should accept some decorated view only once');
					assert.isTrue(state._decorators.deco0.setComponent.withArgs(state._view).calledBefore(state._decorators.deco1.setComponent.withArgs(state._decorators.deco0)), 'Decorators were applied in the incorrect sequesnce');
				});
			});

			suite('public view', function(){
				suite('no decorating', function(){
					[undefined, null, false, true, 0, 1, {}, function(){}, '', []].forEach(function(input){
						test(JSON.stringify(input), function(){
							assert.doesNotThrow(function(){
								state.decorateWith(input);
							});

							assert.equal(state.view, state._view, 'Incorrect final reference was set to the this.view');
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
						test(testCase.decorators, function(){
							assert.doesNotThrow(function(){
								state.decorateWith(testCase.decorators);
							});

							assert.equal(state.view, state._decorators[testCase.expected], 'Incorrect final reference was set to the this.view');
						});
					});
				});
			});
		});
	});
});
