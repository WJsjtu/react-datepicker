import DatePicker from './DatePicker';
import React from 'react';
import ReactDOM from 'react-dom';

window.React = React;
window.ReactDOM = ReactDOM;

$(function () {
    let positionRadio = $("#position-radio");
    ['TOP.LEFT', 'TOP.AUTO', 'TOP.RIGHT', 'BOTTOM.LEFT', 'BOTTOM.AUTO', 'BOTTOM.RIGHT']
        .forEach(function (ele) {
            let str =
                `<label for="position" class="radio" style="width:50%;display:inline-block; padding-left:10px;">
                    <input name="position" value="DatePicker.Positions.` + ele + `" type="radio" />
                    DatePicker.Positions.` + ele +
                `</label>`;
            positionRadio.append($(str));
        });

    positionRadio.append($(
        `<label for="position" class="radio" style="width:100%;display:inline-block; padding-left:10px;">
            <input name="position" value="DatePicker.Positions.INLINE" type="radio" />
            DatePicker.Positions.INLINE
        </label>`
    ));

    $('#prettify-html').html(prettyPrintOne(
        `<div id="datepicker" style="width: 400px;"></div>`.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        'html',
        true
    ));

    let js = $("#js-date-format").text().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\t/g, '  ');

    let printObj = function (obj) {
        let str = "{\n", tag = "    ";
        for (let i in obj) {
            let propStr = obj[i];
            propStr = propStr.replace(/\n/g, "\n" + tag);
            propStr = propStr.replace(/\n\s*$/g, '');
            str += tag + i + ": " + propStr + ",\n";
        }
        str = str.replace(/[,]\n$/g, '\n');
        str += "}";
        return str;
    };

    let onClick = function () {
        $("#info").html("");
        let pairs = $("#form").serialize().split("&"), obj = {};
        pairs.forEach(function (pairStr) {
            let pair = pairStr.split("=");
            if (pair[1] && pair[1].trim() != "") {
                obj[pair[0].trim()] = decodeURIComponent(pair[1].replace(/[+]/g, ' '));
            }
        });

        let code = "ReactDOM.render(React.createElement(DatePicker, " + printObj(obj) + "), document.getElementById('datepicker'));";

        $('#prettify-js').html(prettyPrintOne(
            code.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
            'js',
            true
        ));
        try {
            eval(code);
        } catch (e) {
            $("#info").html(code);
            alert(e.toString());
        }
    };
    $("#render").on("click", onClick);
    onClick();
});
