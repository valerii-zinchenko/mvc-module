/*
 TaskOnFly allows you easy manage your tasks and task lists on the fly from your mobile or desktop device.
 Copyright (C) 2014-2015  Valerii Zinchenko

 This file is part of TaskOnFly.

 TaskOnFly is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 TaskOnFly is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with TaskOnFly.  If not, see <http://www.gnu.org/licenses/>.


 All source files are available at: http://github.com/valerii-zinchenko/TaskOnFly
*/

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
