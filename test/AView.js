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
