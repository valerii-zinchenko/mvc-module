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
