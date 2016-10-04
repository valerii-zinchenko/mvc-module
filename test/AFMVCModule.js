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

suite('AFMVCModule', function() {
	suite('Input constructors', function() {
		suite('Exceptions', function() {
			[].concat(
				[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].map(function(testCase){
					return {
						input: testCase,
						error: 'Incorrect type of an input argument. Expected: Object MVCConstructors'
					};
				}),
				
				[undefined, null, false, true, 0, 1, '', 'str', [], {}].map(function(testCase){
					return {
						input: {
							Model: testCase,
							States: {
								state: function(){}
							}
						},
						error: 'Model constructor should be a function'
					};
				}),

				[undefined, null, false, true, 0, 1, '', 'str', [], function(){}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							States: testCase
						},
						error: 'Incorrect type for model\'s states'
					};
				}),

				[undefined, null, false, true, 0, 1, '', 'str', [], {}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							States: {
								state: testCase
							}
						},
						error: 'Incorrect type of a state "state", Function expected'
					};
				}),
				[undefined, null, false, true, 0, 1, '', 'str', [], {}].map(function(testCase){
					return {
						input: {
							Model: function(){},
							States: {
								state: function(){},
								badState: testCase
							}
						},
						error: 'Incorrect type of a state "badState", Function expected'
					};
				})
			).forEach(function(testCase){
				test('Input: ' + JSON.stringify(testCase.input) + '; exception: ' + testCase.error, function() {
					assert.throw(function() {
						AFMVCModule(testCase.input);
					}, Error, testCase.error);
				});
			});
		});
	});

	suite('Integration', function() {
		test('Constructing of each module\'s components', function() {
			var Module = sinon.spy();
			var Model = sinon.spy();
			var State = sinon.spy();

			var Builder;
			var result;
			assert.doesNotThrow(function() {
				Builder = AFMVCModule({
					Model: Model,
					States: {
						state: State
					},
					Module: Module
				});

				result = Builder();
			});

			assert.isTrue(Model.calledWithNew(), 'Model\'s constructor should be called with "new" operator');
			var model = Model.returnValues[0];

			assert.isTrue(State.calledWithNew(), 'State\'s constructor should be called with "new" operator');
			assert.isTrue(State.calledWithExactly(model, undefined), 'Arguments for the state\'s "state" constructor were incorrectly passed');
			var state = State.returnValues[0];

			assert.isTrue(Module.calledWithNew(), 'Module\'s constructor should be called with "new" operator');
			assert.equal(Module.args[0].length, 3, 'Incorrect amount of input arguments is passed into the module\'s constructor');
			assert.equal(Module.args[0][0], model, 'Model should be the first argument');
			assert.isObject(Module.args[0][1], 'Second argument should be an object of mode\'s states');
			assert.equal(Module.args[0][1].state, state, 'State "state" was incorrectly passed');

			assert.equal(result, Module.returnValues[0], 'Builder should return a result of module\'s constructor');
		});

		test('Default module\'s constructor', function() {
			var Model = sinon.spy();
			var State = sinon.spy();

			var Builder;
			var result;
			assert.doesNotThrow(function() {
				Builder = AFMVCModule({
					Model: Model,
					States: {
						state: State
					}
				});

				result = Builder();
			});

			var model = Model.returnValues[0];
			var state = State.returnValues[0];

			assert.instanceOf(result, MVCModule, 'Builder should call MVCModule\'s constructor');
		});

		test('Input arguments for a builder function.', function() {
			var Module = sinon.spy();
			var Model = sinon.spy();
			var State = sinon.spy();
			var State1 = sinon.spy();

			var modelArgs = [{}, {}];
			var statesConfigs = {
				state: {}
			};

			var Builder;
			var result;
			assert.doesNotThrow(function() {
				Builder = AFMVCModule({
					Model: Model,
					States: {
						state: State,
						state1: State1
					},
					Module: Module
				});

				result = Builder(modelArgs, null, statesConfigs);
			});

			assert.isTrue(Model.calledWithExactly.apply(Model, modelArgs), 'Arguments for a model\'s constructor were incorrectly passed');
			var model = Model.returnValues[0];

			assert.isTrue(State.calledWithExactly(model, statesConfigs.state), 'Arguments for the state\'s "state" constructor were incorrectly passed');
			var state = State.returnValues[0];

			assert.isTrue(State1.calledWithExactly(model, undefined), 'Arguments for the state\'s "state1" constructor were incorrectly passed');
			var state1 = State1.returnValues[0];

			assert.equal(Module.args[0].length, 3, 'Incorrect amount of input arguments is passed into the module\'s constructor');
			assert.equal(Module.args[0][0], model, 'Model should be the first argument');
			assert.isObject(Module.args[0][1], 'Second argument should be an object of mode\'s states');
			assert.equal(Module.args[0][1].state, state, 'State "state" was incorrectly passed');
			assert.equal(Module.args[0][1].state1, state1, 'State "state1" was incorrectly passed');
		});
	});
});
