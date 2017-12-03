'use strict';

suite('StaticView', function(){
	suite('Constructor', function(){
		teardown(function(){
			StaticView.instance = null;
		});

		test('initialize', function(){
			new StaticView();
		});

		test('is singleton', function(){
			assert.equal(new StaticView(), new StaticView(), 'StaticView should behave as singleton');
		});
	});

	suite('Methods', function(){
		var view;
		setup(function() {
			view = new StaticView();
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
				view.render();

				assert.isTrue(view._initElements.calledOnce, '_initElements should be called once');
				assert.isTrue(view._attachEvents.calledOnce, '_initElements should be called once');
				assert.isTrue(view._attachEvents.calledAfter(view._initElements), 'Helper methods were called in incorrect order by rendering');
			});
		});

		['show', 'hide'].forEach(function(method) {
			test(method + '()', function() {
				view.element = document.createElement('div');

				view[method]();
			});
		});
	});

	suite('Destruction', function(){
		setup(function(){
			sinon.spy(AView.prototype, 'destruct');
			sinon.spy(Element.prototype, 'remove');
		});
		teardown(function(){
			StaticView.instance = null;

			AView.prototype.destruct.restore();
			Element.prototype.remove.restore();
		});

		test('the element should be removed and then parent\s method should be called', function(){
			var view = new StaticView();
			view.element = document.createElement('div');
			view.render();
			view.destruct();

			assert.isTrue(Element.prototype.remove.calledOnce);
			assert.isTrue(AView.prototype.destruct.calledOnce);
			assert.isTrue(AView.prototype.destruct.calledAfter(Element.prototype.remove));
		});
	});
});
