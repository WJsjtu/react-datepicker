var fs = require("fs");
var UglifyJS = require("uglify-js");

module.exports = function (filePath, functionNames, propsNames, stringNames, cb) {
    fs.readFile(filePath, {encoding: 'utf8'}, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            var stringReplacePairs = {
                "object": "object",
                "function": "function",
                render: "render",
                string__esModule: "__esModule",
                componentWillReceiveProps: "componentWillReceiveProps",
                Cannot_call_a_class_as_a_function: "Cannot call a class as a function",
                string__this_hasnt_been_initialised: "this hasn't been initialised - super() hasn't been called",
                Super_expression_must_either_be_null_or_a_function: "Super expression must either be null or a function, not "
            };

            stringReplacePairs = Object.assign({}, stringNames, stringReplacePairs, functionNames);

            var propReplacePairs = {
                prop__enumerable: "enumerable",
                prop__configurable: "configurable",
                prop__writable: "writable",
                prop__esModule: "__esModule",
                exports: "exports",
                Component: "Component",
                createElement: "createElement",
                prop__prototype: "prototype",
                prop__proto__: "__proto__",
                prop_setPrototypeOf: "setPrototypeOf",
                prop_defineProperty: "defineProperty",
                prop_getPrototypeOf: "getPrototypeOf",
                prop_call: "call",
                state: "state",
                props: "props",
                PropTypes: "PropTypes",
                bind: "bind",
                setState: "setState",
                stopPropagation: "stopPropagation",
                preventDefault: "preventDefault",
                onClick: "onClick",
                prop_key: "key",
                prop_length: "length"
            };

            propReplacePairs = Object.assign({}, propsNames, propReplacePairs, functionNames);

            var propsArr = [], propsDeclareStr = "";

            for (var i in propReplacePairs) {
                var prop = propReplacePairs[i];
                var newPropName = "__propReplacement_" + i + "__";
                data = data.replace(new RegExp("[.]" + prop + "(?=[^a-zA-Z0-9])", "g"), "[" + newPropName + "]");
                propsArr.push(newPropName + "=\"" + prop + "\"");
            }

            if (propsArr.length) {
                propsDeclareStr = "var " + propsArr.join(",") + ";";
            }

            var stringArr = [], stringDeclareStr = "";
            for (var i in stringReplacePairs) {
                var stringContent = stringReplacePairs[i];
                stringContent = stringContent.replace(/\(/g, "\\(");
                stringContent = stringContent.replace(/\)/g, "\\)");
                var newStringName = "__stringReplacement_" + i + "__";
                data = data.replace(new RegExp("\"" + stringContent + "\"(?=[^a-zA-Z0-9])", "g"), newStringName);
                stringArr.push(newStringName + "=\"" + stringContent + "\"");
            }
            stringArr.push("__stringReplacement_default__ = \"default\"");
            data = data.replace(/[\[]"default"[\]]/g, "[__stringReplacement_default__]");
            stringDeclareStr = "var " + stringArr.join(",") + ";";

            data = data.replace(new RegExp("\"use strict\"", "g"), "");

            var fileStr = "(function(Object){" + propsDeclareStr + stringDeclareStr + data
                + "})(Object);";
            fileStr = UglifyJS.minify(fileStr, {fromString: true, mangle: true}).code;

            fs.writeFile(filePath, fileStr, {encoding: 'utf8'}, function (_err) {
                cb(_err);
            });
        }
    });
};