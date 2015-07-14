/* jshint node: true */
'use strict';

var es = require('event-stream');
var gutil = require('gulp-util');
var UglifyJS = require("uglify-js");

var reactUglifyPlugin = function(replaceWord, unsafe) {
	replaceWord = replaceWord || '__react_create_element';
	var rawWord = "React.createElement";

	return es.map(function(file, cb){

		var contentStr = String(file.contents).replace(new RegExp(rawWord, "g"), replaceWord);

		var otherVars = "";
		
		if(unsafe){
			contentStr = contentStr.replace(new RegExp("\.prototype", "g"), "[__prototype__]");
			contentStr = contentStr.replace(new RegExp("\.bind", "g"), "[__bind__]");
			contentStr = contentStr.replace(new RegExp("\.state", "g"), "[__state__]");
			contentStr = contentStr.replace(new RegExp("\.props", "g"), "[__props__]");

			otherVars = "var __prototype__='prototype', __state__='state',__props__='props',__bind__='bind';";
		}

		//contentStr = contentStr.replace(new RegExp("\"use strict\";", "g"), "");


		var fileStr = "(function(React){var " + replaceWord + " = " + rawWord + ";" + otherVars
			+ contentStr
			+ "})(React);";

		fileStr = UglifyJS.minify(fileStr, {fromString: true, mangle: true}).code;
		
		file.contents = new Buffer(fileStr),
		cb(null, file);
	});
};

module.exports = reactUglifyPlugin;