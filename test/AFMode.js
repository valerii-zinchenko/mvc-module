suite('AFMode', function(){
	suite('incorrect input argument', function(){
		[].concat(
			[
				undefined,
				null,
				false,
				true,
				0,
				1,
				'',
				'str',
				[],
				function(){}
			].map(function(input){
				return {
					title: 'type of an input argument: ' + Object.prototype.toString.call(input) + ' with a value: ' + input,
					input: input,
					expected: 'Incorrect type of the constructors. Object expected.'
				};
			})
		).forEach(function(testCase){
			test(testCase.title, function(){
				assert.throw(function(){
					AFMode(testCase.input);
				}, Error, testCase.expected);
			});
		});
	});

	suite('correct arguments', function(){
		[
			{
				View: function(){}
			},
			{
				View: function(){},
				Constrol: function(){}
			},
			{
				View: function(){},
				Decorators: {
					Deco: function(){}
				}
			},
			{
				View: function(){},
				Constrol: function(){},
				Decorators: {
					Deco: function(){}
				}
			}
		].forEach(function(testCase){
			test(JSON.stringify(testCase), function(){
				assert.doesNotThrow(function(){
					AFMode(testCase);
				});
			});
		});
	});

	suite('Mode factory. Integration tests with Mode', function(){
		setup(function(){
			sinon.spy(AModeComponent.prototype, "connect");
		});
		teardown(function(){
			AModeComponent.prototype.connect.restore();
		});

		test('without model in input arguments', function(){
			var result;
			assert.throw(function(){
				result = (AFMode({View: AView}))();
			}, Error, 'Incorrect type of the model. Expected: Object');
		});

		test('without ControlConstructor', function(){
			var model = {};

			var result = (AFMode({View: AView}))(model);
		});

		test('with ControlConstructor', function(){
			var model = {};

			var result = (AFMode({
				View: AView,
				Control: AControl
			}))(model);
		});

		test('with Decorators', function(){
			var Deco = Class(ADecorator, null, {});

			var result = (AFMode({
				View: AView,
				Decorators: {
					Deco: Deco
				}
			}))({});
		});

		test('mode\'s configuration', function(){
			var config = {};

			var result = (AFMode({
				View: AView,
				Control: AControl
			}))({}, config);
		});
	});
});
