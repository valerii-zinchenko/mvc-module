'use strict';

suite('EventHandler', function(){
	test('Constructor', function() {
		assert.doesNotThrow(function(){
			new EventHandler();
		});
	});

	suite('Methods', function(){
		test('listen()', function(){
			var events = new EventHandler();
			assert.doesNotThrow(function(){
				events.listen('event', function(){});
				events.listen({
					someEvent: function(){},
					event2: function(){}
				});
				events.listen('event2', function(){});
			});
		});

		suite('trigger()', function(){
			var events;
			var fn;
			setup(function(){
				fn = sinon.spy();
				events = new EventHandler();
				events.listen('event', fn);
			});
			teardown(function(){
				events = null;
				fn = null;
			});

			test('trigger event without registered handlers', function(){
				assert.doesNotThrow(function(){
					events.trigger('nothing');
				});
				assert.isFalse(fn.called, 'Event handler registered for other event name should not be triggered');
			});

			test('trigger event with registered handlers', function(){
				assert.doesNotThrow(function(){
					events.trigger('event');
				});
				assert.isTrue(fn.called, 'Event handler registered for triggered event name should be called');
			});

			test('trigger event with two handlers', function(){
				var fn1 = sinon.spy();
				assert.doesNotThrow(function(){
					events.listen('event', fn1);
					events.trigger('event');
				});
				assert.isTrue(fn.calledOnce, 'First registered function should be called once');
				assert.isTrue(fn1.calledOnce, 'Second registered function should be called once');
				assert.isTrue(fn1.calledAfter(fn), 'The handlers shoud be executed in the same order as they were registered');
			});

			test('trigger event with arguments', function(){
				var value = 2;
				var obj = {};
				assert.doesNotThrow(function(){
					events.trigger('event', value, obj);
				});
				assert.isTrue(fn.called, 'Event handler registered for triggered event name should be called');
				assert.equal(fn.args[0][0], events, 'The first argument should be "this" object');
				assert.equal(fn.args[0][1], value, 'The second argument should be the same as the second argument for trigger() method');
				assert.equal(fn.args[0][2], obj, 'The third argument should be the same as the third argument for trigger() method');
			});
		});

		suite('removeListener()', function(){
			var fn;
			var events;
			setup(function(){
				fn = sinon.spy();
				events = new EventHandler();
				events.listen('event', fn);
			});
			teardown(function(){
				fn = null;
				events = null;
			});

			test('event without any registered handler', function(){
				assert.doesNotThrow(function(){
					events.removeListener('nothing');
				});
			});

			test('event with registered listener', function(){
				assert.doesNotThrow(function(){
					events.removeListener('event', fn);
					events.trigger('event');
				});
				assert.isFalse(fn.called, 'Event listener after unregistering should not be executed');
			});

			test('try to unregister incorrect listener', function(){
				var fn1 = sinon.spy();
				assert.doesNotThrow(function(){
					events.removeListener('event', fn1);
					events.trigger('event');
				});

				assert.isTrue(fn.called, 'Registered event should not be tuched');
			});
		});
	});
});
