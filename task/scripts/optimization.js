var fs = require('fs');
var uglifyJS = require('uglify-js');

var regSpecialChars = '\\$()*+.[]?^{}|'.split('');
var regSpecialCharsEscape = '\\\\ \\$ \\( \\) \\* \\+ \\. \\[ \\] \\? \\^ \\{ \\} \\|'.split(' ');

var jsKeywords = 'break do instanceof typeof case else new var catch finally return void continue for switch while debugger function this with default if throw delete in try'.split(' ');

var stringReplace = [
    "object",
    "function",
    "Cannot call a class as a function",
    "this hasn't been initialised - super() hasn't been called",
    "Super expression must either be null or a function, not ",
    "default"
];

var propsReplace = [
    "enumerable",
    "configurable",
    "writable",
    "prototype",
    "__proto__",
    "setPrototypeOf",
    "defineProperty",
    "getPrototypeOf",
    "call",
    "length"
];

var funcReplace = [
    "__esModule",
    "exports",
    "key"
];

/*
 option : {
 prop,
 str,
 func:
 }


 */


module.exports = function (filePath, option, cb) {
    fs.readFile(filePath, {encoding: 'utf8'}, function (err, data) {
        if (err) {
            cb(err);
        } else {

            var getUniqueArray = function (arr) {
                var hashObject = {}, result = []; //n为hash表，r为临时数组
                for (var i = 0; i < arr.length; i++) //遍历当前数组
                {
                    if (!hashObject['getUniqueArrayHash_' + arr[i]]) //如果hash表中没有当前项
                    {
                        hashObject['getUniqueArrayHash_' + arr[i]] = true; //存入hash表
                        result.push(arr[i]); //把当前数组的当前项push到临时数组里面
                    }
                }
                return result;
            };

            if (!option.func.length) {
                option.func = [];
            }
            if (!option.prop.length) {
                option.prop = [];
            }
            if (!option.str.length) {
                option.str = [];
            }
            var _stringReplace = getUniqueArray(Array.prototype.concat.call(stringReplace, option.str, option.func, funcReplace));
            var _propsReplace = getUniqueArray(Array.prototype.concat.call(propsReplace, option.prop, option.func, funcReplace));
            var declareArr = [];

            for (var i in _propsReplace) {
                if (_propsReplace.hasOwnProperty(i)) {
                    var propContent = _propsReplace[i];
                    regSpecialChars.forEach(function (ele, index) {
                        propContent = propContent.replace(new RegExp('\\' + ele, 'g'), regSpecialCharsEscape[index]);
                    });
                    var newPropVar = "optimization__propReplacement_" + i + "__";
                    if (data.match(new RegExp("[.]" + propContent + "(?=[^a-zA-Z0-9])", "g"))) {
                        data = data.replace(new RegExp("[.]" + propContent + "(?=[^a-zA-Z0-9])", "g"), "[" + newPropVar + "]");
                        declareArr.push(newPropVar + "=\"" + propContent + "\"");
                    }
                }
            }

            for (var j in _stringReplace) {
                if (_stringReplace.hasOwnProperty(j)) {
                    var stringContent = _stringReplace[j];
                    regSpecialChars.forEach(function (ele, index) {
                        stringContent = stringContent.replace(new RegExp('\\' + ele, 'g'), regSpecialCharsEscape[index]);
                    });
                    var newStringVar = "optimization__stringReplacement_" + j + "__";
                    if (jsKeywords.indexOf(stringContent) !== -1) {
                        if (data.match(new RegExp("[\\[]\"" + stringContent + "\"[\\]]", 'g'))) {
                            data = data.replace(new RegExp("[\\[]\"" + stringContent + "\"[\\]]", 'g'), "[" + newStringVar + "]");
                            declareArr.push(newStringVar + "=\"" + stringContent + "\"");
                        }
                        if (data.match(new RegExp("\"" + stringContent + "\"(?=!=typeof)", 'g'))) {
                            data = data.replace(new RegExp("\"" + stringContent + "\"(?=!=typeof)", 'g'), newStringVar + " ");
                            declareArr.push(newStringVar + "=\"" + stringContent + "\"");
                        }
                    } else {
                        if (data.match(new RegExp("\"" + stringContent + "\"(?=[^a-zA-Z0-9])", "g"))) {
                            data = data.replace(new RegExp("\"" + stringContent + "\"(?=[^a-zA-Z0-9])", "g"), newStringVar);
                            declareArr.push(newStringVar + "=\"" + stringContent + "\"");
                        }
                    }
                }
            }

            data = data.replace(new RegExp("\"use strict\"", "g"), "");

            var declareStr = "var " + declareArr.join(",") + ";";

            var fileStr = "(function(Object,TypeError,ReferenceError){" + declareStr + data + "})(Object,TypeError,ReferenceError);";

            fileStr = uglifyJS.minify(fileStr, {
                fromString: true, mangle: {
                    eval: true
                }
            }).code;

            fs.writeFileSync(filePath, fileStr, {encoding: 'utf8'});

            cb();
        }
    });
};