'use strict';

suite('AView', function() {
	suite('Constructor', function(){
		test('Inheritance', function(){
			assert.instanceOf(AView.prototype, AStateComponent, 'AView should be inherited from AStateComponent');
		});
	});

	suite('Methods', function(){
		var aView;
		setup(function(){
			aView = new AView({});
			sinon.spy(AStateComponent.prototype, "destruct");
		});
		teardown(function(){
			aView = null;
			AStateComponent.prototype.destruct.restore();
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
			aView.$el = $();
			assert.doesNotThrow(function(){
				aView.setControl(new AControl({}));
				aView.destruct();
			});

			assert.isNull(aView.control, 'destruct() should set view to null');
			assert.isTrue(AStateComponent.prototype.destruct.calledOnce, 'Parent\'s destruct() should be called');
		});

		['render', 'update', '_initElements', '_attachEvents'].forEach(function(method) {
			test(method + '()', function() {
				assert.doesNotThrow(function(){
					aView[method]();
				});
			});
		});

		['show', 'hide'].forEach(function(method) {
			test(method + '()', function() {
				aView.$el = $();
				assert.doesNotThrow(function(){
					aView[method]();
				});
			});
		});
	});
});
