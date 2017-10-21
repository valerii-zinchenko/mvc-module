module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var src = 'lib/';

	var banner = '// <%= pkg.description %>\n'+
				 '// v<%= pkg.version %>\n' +
				 '// Copyright (c) 2016-2017 <%= pkg.author %>\n' +
				 '// Licensed under <%= pkg.license %> (http://valerii-zinchenko.github.io/<%= pkg.name %>/blob/master/LICENSE.txt)\n' +
				 '// All source files are available at: http://github.com/<%= pkg.repository %>\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '\n',
				banner: banner
			},
			dest: {
				src: [
					'dep2vars',
					'utils',
					'AModeComponent',
					'AControl',
					'AView',
					'StaticView',
					'DynamicView',
					'ADecorator',
					'Mode',
					'AFMode',
					'MVCModule',
					'AFMVCModule'
				].map(function(item) { return src + item + '.js'; }),
				dest: '<%= pkg.directories.dest %>/<%= pkg.name %>.js'
			}
		},

		wrap: {
			pkg: {
				src: '<%= pkg.directories.dest %>/<%= pkg.name %>.js',
				dest: '<%= pkg.directories.dest %>/<%= pkg.name %>.js',
				options: {
					wrapper: [
						'(function (root, factory) {\n' +
						'	if(typeof define === "function" && define.amd) {\n' +
						'		define(["class-wrapper", "lodash"], function() {\n' +
						'			return factory.apply(null, arguments);\n' +
						'		});\n' +
						'	} else if(typeof module === "object" && module.exports) {\n' +
						'		module.exports = factory.apply(null, [require("class-wrapper"), require("lodash")]);\n' +
						'	} else {\n' +
						'		root["<%= pkg.name %>"] = factory.apply(null, [root["class-wrapper"], root["lodash"]]);\n' +
						'	}\n' +
						'})(this, function(ClassWrapper, _) {',
						// code will be placed right here
						'	return {\n' +
						'		AControl: AControl,\n' +
						'		AFMVCModule: AFMVCModule,\n' +
						'		AFMode: AFMode,\n' +
						'		AModeComponent: AModeComponent,\n' +
						'		AView: AView,\n' +
						'		DynamicView: DynamicView,\n' +
						'		MVCModule: MVCModule,\n' +
						'		Mode: Mode,\n' +
						'		StaticView: StaticView,\n' +
						'		utils: utils\n' +
						'	};\n' +
						'});'
					]
				}
			}
		},

		uglify: {
			options: {
				banner: banner
			},
			dist: {
				files: {
					'<%= pkg.directories.dest %>/<%= pkg.name %>.min.js': '<%= pkg.directories.dest %>/<%= pkg.name %>.js'
				}
			}
		},

		template: {
			test: {
				options: {
					data: {
						isPROD: false,
						jsFolder: '../' + src
					}
				},
				files: {
					'<%= pkg.directories.test %>/index.html': ['<%= pkg.directories.test %>/index.tpl.html']
				}
			},
			coverage: {
				options: {
					data: {
						isPROD: false,
						jsFolder: '../js-cov/'
					}
				},
				files: {
					'<%= pkg.directories.test %>/index.html': ['<%= pkg.directories.test %>/index.tpl.html']
				}
			},
			'prod-test': {
				options: {
					data: {
						isPROD: true
					}
				},
				files: {
					'<%= pkg.directories.test %>/index.html': ['<%= pkg.directories.test %>/index.tpl.html']
				}
			}
		},

		prepareForCoverage: {
			instrument: {
				files: [{
					expand: true,
					cwd: './' + src,
					src: '*.js',
					dest: 'js-cov'
				}]
			}
		},
		mocha: {
			test: {
				options: {
					run: false,
					reporter: 'Spec',
					log: true,
					logErrors: true
				},
				src: ['<%= pkg.directories.test %>/index.html']
			},
			coverage: {
				options: {
					run: false,
					reporter: 'Spec',
					log: true,
					logErrors: true,
					coverage: {
						htmlReport: '<%= pkg.directories.coverage %>'
					}
				},
				src: ['<%= pkg.directories.test %>/index.html']
			}
		},

		jsdoc: {
			options: {
				configure: 'jsdoc.conf.json',
			},

			doc: {
				src: [src + '*.js'],
				options: {
					package: "package.json",
				}
			},

			nightly: {
				src: [src + '*.js'],
			}
		},

		clean: {
			coverage: ['js-cov'],
			build: ['dest']
		}
	});


	grunt.registerMultiTask('prepareForCoverage', 'Generates coverage reports for JS using Istanbul', function() {
		var istanbul = require('istanbul');
		var ignore = this.data.ignore || [];
		var instrumenter = new istanbul.Instrumenter();

		this.files.forEach(function(file) {
			var filename = file.src[0];
			var instrumented = grunt.file.read(filename);

			if (!grunt.file.isMatch(ignore, filename)) {
				instrumented = instrumenter.instrumentSync(instrumented, filename);
			}

			grunt.file.write(file.dest, instrumented);
		});
	});


	[
		['build', ['clean:build', 'concat', 'wrap', 'uglify', 'template:test']],
		['test', ['template:test', 'mocha:test']],
		['coverage', ['prepareForCoverage', 'template:coverage', 'mocha:coverage', 'clean:coverage', 'template:test']],
		['doc', ['jsdoc']]
	].forEach(function(registry){
		grunt.registerTask(registry[0], registry[1]);
	});
};
