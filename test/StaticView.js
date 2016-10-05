'use strict';

suite('StaticView', function(){
	suite('Constructor', function(){
		teardown(function(){
			StaticView.instance = null;
		});

		test('initialize', function(){
			assert.doesNotThrow(function(){
				new StaticView({});
			});
		});

		test('is singleton', function(){
			assert.equal(new StaticView({}), new StaticView({}), 'StaticView should behave as singleton');
		});
	});

	suite('Methods', function(){
		var view;
		setup(function() {
			view = new StaticView({});
		});
		teardown(function(){
			view = null;
			StaticView.instance = null;
		});

		suite('render', function(){
			setup(function(){
				sinon.stub(view, "_initElements");
				sinon.stub(view, "_attachEvents");
			});
			teardown(function(){
				view._initElements.restore();
				view._attachEvents.restore();
			});

			test('order of helper methods', function(){
				assert.doesNotThrow(function(){
					view.render();
				});
				assert.isTrue(view._initElements.calledOnce, '_initElements should be called once');
				assert.isTrue(view._attachEvents.calledOnce, '_initElements should be called once');
				assert.isTrue(view._attachEvents.calledAfter(view._initElements), 'Helper methods were called in incorrect order by rendering');
			});
		});
	});
});
