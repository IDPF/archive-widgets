module.exports = function(grunt) {
var widgetName = "all";
var compressSource = ['*', 'book-shared/**/*'];
if(grunt.option( "widget" )) {
    widgetName = grunt.option( "widget" );
    compressSource.push('widgets/'+widgetName+'/**/*');
} else {
    compressSource.push('widgets/**/*');
}
grunt.log.writeln("# " + widgetName);
  // Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
        build: ["dist"],
        all: ["dist"],
    },

    // copy: {
    //     build: {
    //         src: 'package/**',
    //         dest: 'build/build_temp/'
    //     }
    // },

    // uglify: {
    //     options: {
    //         banner: '/*\nPart of Poe eBook Framework\nCopyright 2011-2013 Metrodigi, Inc. All rights reserved.\n' +
    //         '<%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //     },
    //     build: {
    //         files: [{
    //             expand: true,
    //             src: ['build/build_temp/**/*.js', '!build/build_temp/**/*.min.js'],
    //             dest: '.',
    //         }]
    //     },
    //     single: {
    //         files: [{
    //             expand: true,
    //             src: ['./build/js_build/epub.uncompressed.js'],
    //             dest: './build/js_build/epub.js',
    //         }]
    //         //'build/<%= grunt.template.today("yyyy-mm-dd|hh:MM:ss") %>/book-shared/js/epub.js' : 'package/book-shared/js/epub.js'
    //     }
    // },

    compress: {
        build: {
            options: {
                archive: 'dist/epubWidget-'+widgetName+'.zip',
                mode: 'zip'
            },
            expand: true,
            cwd: '../package/',
            src: compressSource,
            dest: '.'
        }
    },

    // //For single file genration
    // concat: {
    //     options: {
    //         separator: '\n',
    //         stripBanners: true,
    //         banner: '/*\nPoe eBook Framework\nCopyright 2011-2013 Metrodigi, Inc. All rights reserved.\n'+
    //             '<%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
    //     },
    //     single: {
    //         src: ['package/common-shared/**/*.js', 'package/book-shared/**/*.js', 'package/widgets/*/book/*.js'],
    //         dest: 'build/js_build/epub.uncompressed.js'
    //     }
    // }
});

// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-clean');
// grunt.loadNpmTasks('grunt-contrib-uglify');
// grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-compress');
// grunt.loadNpmTasks('grunt-contrib-concat');

// Default task(s).
grunt.registerTask('dist', "creates Package for distribution", ['compress:build']);

// grunt.registerTask('build', "creates Package for development/testing (no minify)", ['clean:build', 'copy:build', 'compress:build']);

// grunt.registerTask('dist-single', "creates single script file for manual widget development", ['clean:single', 'concat:single', 'uglify:single']);

//clean All folders
grunt.registerTask('clear', "Clears all data (Build files)", ['clean:all']);

};