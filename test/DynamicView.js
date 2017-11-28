'use strict';

suite('DynamicView', function(){
	suite('Constructor', function(){
		test('is singleton', function(){
			assert.notEqual(new DynamicView({}), new DynamicView({}), 'DynamicView should not behave as singleton');
		});
	});

	suite('Methods', function(){
		var view;
		setup(function(){
			view = new DynamicView({});
		});
		teardown(function(){
			view = null;
		});

		suite('_processTemplate', function() {
			setup(function(){
				view.model = {};
			});
			teardown(function(){
				view.model = null;
			});

			test('no exception', function(){
				view.model = {};
				assert.doesNotThrow(function(){
					view._processTemplate();
				});
			});

			suite('template processing', function(){
				var stubTemplate;
				setup(function(){
					stubTemplate = sinon.stub(_, 'template');
				});
				teardown(function(){
					_.template.restore();
				});

				test('template context should be the view itself', function(){
					var fake = sinon.spy();
					stubTemplate.returns(fake);

					view._processTemplate();

					assert.isTrue(fake.calledWith(view));
				});
			});
		});

		suite('render', function(){
			setup(function(){
				sinon.stub(view, '_processTemplate');
				sinon.stub(view, '_initElements');
				sinon.stub(view, '_attachEvents');
			});
			teardown(function(){
				view._processTemplate.restore();
				view._initElements.restore();
				view._attachEvents.restore();
			});

			test('rendering flow', function(){
				view.model = {};
				assert.doesNotThrow(function(){
					view.render();
				});

				assert.isTrue(view._initElements.calledAfter(view._processTemplate), 'Elements should be initializing after processing template');
				assert.isTrue(view._attachEvents.calledAfter(view._initElements), 'Events should be attached after initializing of elements');
			});
		});
	});
});
