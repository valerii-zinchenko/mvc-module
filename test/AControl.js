'use strict';

suite('AControl', function() {
	suite('Constructor', function(){
		test('Inheritance', function(){
			assert.instanceOf(AControl.prototype, AStateComponent, 'AControl should be inherited from AStateComponent');
		});
	});

	suite('Methods', function(){
		var aControl;
		setup(function(){
			aControl = new AControl({});
			sinon.spy(AStateComponent.prototype, "destruct");
		});
		teardown(function(){
			aControl = null;
			AStateComponent.prototype.destruct.restore();
		});

		suite('setView', function(){
			test('incorrect view instance', function(){
				[undefined, null, false, true, 0, 1, '', '1', [], {}, function(){}].forEach(function(testCase){
					assert.throw(function(){
						aControl.setView(testCase);
					}, Error, 'Incorrect type of view component');
				});
			});

			test('correct view instance', function(){
				var view = new AView({});
				assert.doesNotThrow(function(){
					aControl.setView(view);
				});
				assert.equal(aControl.view, view, 'View was incorrectly set');
			});
		});

		test('desctuct', function(){
			assert.doesNotThrow(function(){
				aControl.setView(new AView({}));
				aControl.destruct();
			});

			assert.isNull(aControl.view, 'destruct() should set view to null');
			assert.isTrue(AStateComponent.prototype.destruct.calledOnce, 'Parent\'s destruct() should be called');
		});
	});
});
