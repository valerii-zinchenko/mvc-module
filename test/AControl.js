'use strict';

suite('AControl', function() {
	suite('Constructor', function(){
		test('Inheritance', function(){
			assert.instanceOf(new AControl(), AStateComponent, 'AControl should be inherited from AStateComponent');
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
			suite('incorrect view instance', function(){
				[].concat(
					[
						undefined,
						null,
						false,
						true,
						0,
						1,
						'',
						'1',
						[],
						{},
						function(){}
					].map(function(input){
						return {
							title: 'when type of input: ' + Object.prototype.toString.call(input) + ' and value: ' + input,
							input: input
						};
					})
				).forEach(function(testCase){
					test(testCase.title, function(){
						assert.throw(function(){
							aControl.setView(testCase.input);
						}, Error, 'Incorrect type of view component');
					});
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
