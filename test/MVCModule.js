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

suite('MVCModule', function() {
	suite('Constructor', function(){
		[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].forEach(function(testCase){
			test('model: ' + testCase, function(){
				assert.throw(function(){
					new MVCModule(testCase, {});
				}, Error, 'Incorrect types of input arguments. Expected: Object model, Object states');
			});

			test('states: ' + testCase, function(){
				assert.throw(function(){
					new MVCModule({}, testCase);
				}, Error, 'Incorrect types of input arguments. Expected: Object model, Object states');
			});
		});

		suite('correct input arguments', function(){
			test('without a map environment-state', function(){
				var model = {};
				var states = {};

				var uut;
				assert.doesNotThrow(function(){
					uut = new MVCModule(model, states);
				});

				assert.equal(uut.model, model, 'Model\'s object was incotrrectly set');
				assert.equal(uut.states, states, 'States\' object was incotrrectly set');
			});

			suite('with a environment-state map', function(){
				[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].forEach(function(testCase){
					test('incorect type: ' + testCase, function(){
						var model = {};
						var states = {};

						var uut;
						assert.doesNotThrow(function(){
							uut = new MVCModule(model, states, testCase);
						});

						assert.equal(uut.model, model, 'Model\'s object was incotrrectly set');
						assert.equal(uut.states, states, 'States\' object was incotrrectly set');
						assert.notEqual(uut.envStateMap, testCase, 'Map should not be changed');
					});
				});

				test('correct type', function(){
					var model = {};
					var states = {};
					var envStateMap = {};

					var uut;
					assert.doesNotThrow(function(){
						uut = new MVCModule(model, states, envStateMap);
					});

					assert.equal(uut.model, model, 'Model\'s object was incotrrectly set');
					assert.equal(uut.states, states, 'States\' object was incotrrectly set');
					assert.equal(uut.envStateMap, envStateMap, 'Map of environment-state was not set');
				});
			});
		});
	});

	suite('Methods', function() {
		var uut;
		setup(function() {
			uut = new MVCModule({}, {
				state: (AFState({
					View: AView,
					Decorators: {
						deco: ADecorator
					}
				}))({})
			}, {
				someEnv: 'state'
			});
		});
		teardown(function() {
			uut = null;
		});

		suite('getState', function() {
			test('Undefined state', function() {
				var result;
				assert.doesNotThrow(function(){
					result = uut.getState('str');
				});

				assert.isNull(result, 'Null should be returned if desired state is not exist');
			});

			test('existing state', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getState('state');
				});

				assert.equal(result, uut.states.state, 'Incorrect existing state was returned');
			});

			test('with decorator', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getState('state', 'deco');
				});

				assert.equal(result.view, uut.states.state._decorators.deco, 'Afeter decorating the "view" should point to the decorator object');
			});
		});

		suite('getStateFor', function(){
			test('not registered mapping', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getStateFor('eeeeenv');
				});

				assert.isNull(result, 'Null should be returned, because it is not defined what state should be used for a specific environment');
			});

			test('registered mapping', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getStateFor('someEnv');
				});

				assert.equal(result, uut.states.state, 'Incorrect state was returned');
			});

			test('registered mapping with a decorator', function(){
				var result;
				assert.doesNotThrow(function(){
					result = uut.getStateFor('someEnv', 'deco');
				});

				assert.equal(result, uut.states.state, 'Incorrect state was returned');
				assert.equal(result.view, uut.states.state._decorators.deco, 'State was not decorated');
			});
		});
	});
});
