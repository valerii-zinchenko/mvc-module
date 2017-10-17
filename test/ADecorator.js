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

				sinon.stub(Element.prototype, 'appendChild');
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
				var view = new AView();

				deco.setComponent(view);
				deco.render();

				assert.isTrue(DynamicView.prototype.render.calledOnce, 'Parent\'s "render" should be called');
				assert.isTrue(Element.prototype.appendChild.calledOnce, 'Decorator should append something into his container');
				assert.equal(Element.prototype.appendChild.args[0][0], view.$el, 'Decorator should append the decorated component');
				// ??? For some reasons this line hangs the test runner
				//assert.isTrue(Element.prototype.appendChild.withArgs(view.$el).calledOnce, 'Decorator should append the decorated component');
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
				sinon.stub(Element.prototype, 'querySelector');
				sinon.stub(_, 'template');
			});
			teardown(function(){
				Element.prototype.querySelector.restore();
				_.template.restore();
			});

			test('processing', function(){
				var templateRender = sinon.stub();
				templateRender.returns(deco.template);
				_.template.withArgs(deco.template).returns(templateRender);

				deco._processTemplate();

				assert.isTrue(templateRender.withArgs({model: deco.model, config: deco.config}).calledOnce, 'Model and configurations should be passed into the template rendering function');
				assert.isTrue(Element.prototype.querySelector.withArgs('.component-container').calledOnce, 'Container for the component with the class name "component-container" should be searched');
			});
		});
	});
});
