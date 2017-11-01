'use strict';

suite('AView', function() {
	suite('Constructor', function(){
		test('Inheritance', function(){
			assert.instanceOf(AView.prototype, AModeComponent, 'AView should be inherited from AModeComponent');
		});
	});

	suite('Methods', function(){
		var aView;

		// TODO Remove this, after upgrading to a new PhantomJS version and verifying, that this method exists there
		// Old PhantomJS does not have the implementation for Element.prtotype.remove, so just define a dummy function for it, to be able to run tests from command line
		if (!Element.prototype.remove) {
			Element.prototype.remove = function() {};
		}

		setup(function(){
			aView = new AView({});

			sinon.spy(AModeComponent.prototype, "destruct");
		});
		teardown(function(){
			aView = null;

			AModeComponent.prototype.destruct.restore();
		});

		suite('setView()', function(){
			test('incorrect view instance', function(){
				[undefined, null, false, true, 0, 1, '', '1', [], {}, function(){}].forEach(function(testCase){
					assert.throw(function(){
						aView.setControl(testCase);
					}, Error, 'Incorrect type of control component');
				});
			});

			test('correct view instance', function(){
				var control = new AControl({});
				assert.doesNotThrow(function(){
					aView.setControl(control);
				});
				assert.equal(aView.control, control, 'Control was incorrectly set');
			});
		});

		test('desctuct', function(){
			aView.element = document.createElement('div');
			aView.setControl(new AControl({}));
			aView.destruct();

			assert.isNull(aView.control, 'destruct() should set view to null');
			assert.isTrue(AModeComponent.prototype.destruct.calledOnce, 'Parent\'s destruct() should be called');
		});

		['render', 'update', '_initElements', '_attachEvents'].forEach(function(method) {
			test(method + '()', function() {
				assert.doesNotThrow(function(){
					aView[method]();
				});
			});
		});
	});
});
