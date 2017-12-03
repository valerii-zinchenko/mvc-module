'use strict';

suite('ADecorator', function(){
	suite('Constructor', function(){
		test('parent class', function(){
			assert.instanceOf(ADecorator.prototype, DynamicView, 'ADecorator should be inherited from a DynamicView class');
		});

		test('creating an object', function(){
			assert.doesNotThrow(function(){
				new ADecorator();
			});
		});
	});

	suite('Methods', function(){
		var deco;
		setup(function(){
			deco = new ADecorator();
			deco.setModel({});
		});
		teardown(function(){
			deco = null;
		});

		suite('setComponent', function(){
			[undefined, null, false, true, 0, 1, '', 'str', [], {}, function(){}].forEach(function(input){
				test('type of an argument: ' + Object.prototype.toString.call(input) + ' with a value: ' + input, function(){
					assert.throw(function(){
						deco.setComponent(input);
					}, Error, 'Incorrect type of the "component" argument. Expected AView');
				});
			});

			test('correct input', function(){
				var view  = new AView();

				assert.doesNotThrow(function(){
					deco.setComponent(view);
				});

				assert.equal(deco._component, view, 'Component was incorrectly set');
			});
		});

		suite('destruct', function(){
			setup(function(){
				sinon.stub(DynamicView.prototype, 'destruct');
			});
			teardown(function(){
				DynamicView.prototype.destruct.restore();
			});

			test('without component', function(){
				assert.doesNotThrow(function(){
					deco.destruct();
				});

				assert.isTrue(DynamicView.prototype.destruct.calledOnce, 'Parent\'s "desctruct" should be called');
			});

			test('with component', function(){
				var view = new AView();
				sinon.stub(view, 'destruct');

				assert.doesNotThrow(function(){
					deco.setComponent(view);
					deco.destruct();
				});

				assert.isTrue(DynamicView.prototype.destruct.calledAfter(view.destruct), 'Parent\'s "destruct" should be called after the decorated component\'s "desctruct" was called');
			});
		});

		suite('render', function(){
			setup(function(){
				sinon.spy(DynamicView.prototype, 'render');

				sinon.spy(Element.prototype, 'appendChild');
			});
			teardown(function(){
				DynamicView.prototype.render.restore();

				Element.prototype.appendChild.restore();
			});

			test('without component', function(){
				deco.render();

				assert.isTrue(DynamicView.prototype.render.calledOnce, 'Parent\'s "render" should be called');
				assert.isFalse(Element.prototype.appendChild.called, 'Nothing should be appended into the container for the component if the decorator hasn\'t any component');
			});

			test('with component', function(){
				var view = new (Class(DynamicView, null, {
					template: '<div></div><div></div>'
				}))();
				view.render();

				deco.setComponent(view);
				deco.render();

				assert.isTrue(DynamicView.prototype.render.calledTwice, 'Parent\'s "render" should be called twice');
				assert.isTrue(Element.prototype.appendChild.calledTwice, 'Decorator should append all view elementes into his container');
				assert.equal(Element.prototype.appendChild.args[0][0], view.elements[0], 'Decorator should append the first view\'s element');
				assert.equal(Element.prototype.appendChild.args[1][0], view.elements[1], 'Decorator should append the second view\'s element');
				assert.isTrue(DynamicView.prototype.render.calledBefore(Element.prototype.appendChild), 'Parent\'s "render" method should be called before the decorator\'s component will be appended');
			});
		});

		suite('update', function(){
			setup(function(){
				sinon.stub(DynamicView.prototype, 'update');
			});
			teardown(function(){
				DynamicView.prototype.update.restore();
			});

			test('without component', function(){
				assert.doesNotThrow(function(){
					deco.update();
				});

				assert.isTrue(DynamicView.prototype.update.calledOnce, 'Parent\'s "update" should be called');
			});

			test('with component', function(){
				var view = new AView();
				sinon.stub(view, 'update');

				assert.doesNotThrow(function(){
					deco.setComponent(view);
					deco.update();
				});

				assert.isTrue(DynamicView.prototype.update.calledAfter(view.update), 'Parent\'s "update" should be called after the decorated component\'s "update" was called');
			});
		});

		suite('_processTemplate', function(){
			setup(function(){
				sinon.spy(DynamicView.prototype, '_processTemplate');
			});
			teardown(function(){
				DynamicView.prototype._processTemplate.restore();
			});

			test('parent\'s method should be called', function(){
				deco._processTemplate();

				assert.isTrue(DynamicView.prototype._processTemplate.calledOnce);
			});
		});
	});
});
