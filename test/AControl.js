'use strict';

suite('AControl', function() {
	suite('Constructor', function(){
		test('Inheritance', function(){
			assert.instanceOf(new AControl(), AModeComponent, 'AControl should be inherited from AModeComponent');
		});

		test('Mixing of Observer', function() {
			var c = new AControl();

			assert.equal(c.listen, Observer.prototype.listen);
			assert.equal(c.trigger, Observer.prototype.trigger);
			assert.equal(c.removeListener, Observer.prototype.removeListener);
		});
	});

	suite('Methods', function(){
		var aControl;
		setup(function(){
			aControl = new AControl({});
			sinon.spy(AModeComponent.prototype, "destruct");
		});
		teardown(function(){
			aControl = null;
			AModeComponent.prototype.destruct.restore();
		});

		test('desctuct', function(){
			assert.doesNotThrow(function(){
				aControl.destruct();
			});

			assert.isTrue(AModeComponent.prototype.destruct.calledOnce, 'Parent\'s destruct() should be called');
		});
	});
});
