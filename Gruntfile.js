module.exports = function(grunt) {
	//Load tasks provided by each plugin
    	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	/*
	 *The following two lines are equivalent, which basically means
	 that it makes alot of sense to release your own modules, instead of having them as files.
	 The example of publishing your module, looks pretty straightforward, and is found on page 105 in the book.
	 */
	/*
	 *grunt.loadNpmTasks("grunt-contrib-copy");
	 *grunt.loadTasks("./node_modules/grunt-contrib-copy");
	 */
	/*
	 *For grunt to maintain just a little seperation of concerns, it uses 
	 *this loadTasks, which loads a task such as myTask and enables us to use it, which enables us to add our own
         * tasks to the build without bloathing the gruntfile.js. Right now this doesnt seem to work, but i think its a weird 
	 * example anyway.
	 */
	grunt.loadTasks("./tasks"); 
	//project configuration
	grunt.initConfig({
	    	myTask: {
			bar:42
		},
		coffee: {
			build:	{
			    	options: {
					/*
					 *    the coffee script plugin, allows us to 
					 *concat the files into one, otherwise we would have to do a seperate
					 *concat function. 
					 */
					join:true
			    	},
				/*
				 *The following code fixes a error that would occur, when we would concat code that uses
				 *functions before theyre defined, we manually have to keep track of this trend, thats why we in this case,
				 *add all of the coffeescript files, and then remove the ones that call method declarations. i wonder how this would work
				 *in a bigger project. On another note even if we dont use coffeescript it still makes sense to concat out files, which would be 
				 done in similar fashion, but just with the concat plugin and .js postfix.
				 */
				src:[
					"src/scripts/**/*.coffee",
					"!src/scripts/app.coffee",
					"src/scripts/app.coffee"
				],
				dest:"build/js/app.js"
			}
		},
		stylus: {
			build: {
				src:"src/styles/app.styl",
				dest:"build/css/app.css"
			}
		},
		jade: {
		    build: {
			options: {
				pretty:true
			},
			src:[
				"src/views/app.jade"	
			],
			dest: "build/app.html"
		    }
		},
		uglify: {
		    /*
		     *These src and dest looks a little weird, because basically
		     *we take the concat files, and then we overwrite them self with the minified version.
		     *    the alternative is to make a  %.min.js file. next to the concat one. 
		     */
			compress: {
				src:"<%= coffee.build.dest %>",
				dest:"<%= coffee.build.dest %>"
			}
		},
		cssmin: {
			compress:{
				src:"<%= stylus.build.dest %>",
				dest:"<%= stylus.build.dest %>"
			}
		},
		htmlmin : {
			options: {
				removeComments:true,
				collapseWhitespace:true,
				collapseBooleanAttributes:true,
				removeAttributeQuotes:true,
				removeRedundantAttributes:true,
				removeOptionalTags:true
			},
			compress: {
				src: "<%= jade.build.dest %>",
				dest: "<%= jade.build.dest %>"
			}
		},
		watch: {
			scripts:{
				files:"src/scripts/**/*.coffee",
				tasks:"scripts"
		},
		styles: {
				files:"src/styles/**/*.styl",
				tasks:"styles"
		},
		views: {
				files:"src/views/**/*.jade",
				tasks:"views"
		}
	}

	});	
	/*
	 *This task is being run with prod on if we:
	 *        grunt --env=prod
	 */
	var env = grunt.option('env') || 'dev';
	if(env === 'prod'){
		grunt.registerTask('scripts', ['coffee','uglify']);
		grunt.registerTask('styles', ['stylus', 'cssmin']);
		grunt.registerTask('views', ['jade','htmlmin']);
	} else {
		grunt.registerTask('scripts',['coffee']);
		grunt.registerTask('styles', ['stylus']);
		grunt.registerTask('views', ['jade']);
	}

	grunt.registerTask('build', ['scripts','styles','views']);
	grunt.registerTask('default', ['build','watch']);
	/*
	 *The alternative is to do the following(which may me more of a DRY solution):
	 */
	/*
	 *grunt.registerTask('scripts', function(){
	 *        grunt.task.run('coffee');
	 *        if(env==='prod'){
	 *                grunt.task.run('uglify');
	 *        }	
	 *});
	 */
};
