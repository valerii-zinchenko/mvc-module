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

		test('_processTemplate', function(){
			view.model = {};
			assert.doesNotThrow(function(){
				view._processTemplate();
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
