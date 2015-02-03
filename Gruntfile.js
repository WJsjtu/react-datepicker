"use strict";

module.exports = function(grunt) {

    var components = "components/";

    grunt.initConfig({
        reactjs: {
            main:{
                files: [{
                    src:"src/jsx/datepicker.jsx",
                    dest: "dist/js/datepicker.jsx.js"
                }],
                options: {
                    wrapper: true
                }
            }
        },
        copy: [{
            expand: true,
            cwd: components + "react/",
            src: [ "react-with-addons.min.js"],
            dest: "dist/vendor/js/"
        }, {
            expand: true,
            cwd: components + "amazeui/dist/css/",
            src: [ "amazeui.min.css" ],
            dest: "dist/vendor/css/"
        }, {
            expand: true,
            cwd: components + "amazeui/dist/",
            src: [ "fonts/*.*" ],
            dest: "dist/vendor/"
        }],
        uglify: {
            module: {
                files: [{
                    src: ["dist/js/*.jsx.js"],
                    dest: "dist/js/",
                    expand: true,
                    flatten: true,
                    ext: ".min.js"
                }],
                options: {
                    mangle: true
                }
            }
        }
    });

    grunt.loadNpmTasks("wjsjtu-reactjs");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["reactjs", "copy", "uglify:module"]);
};