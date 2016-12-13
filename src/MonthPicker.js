const {createElement} = React;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const PanelMixin = require('./PanelMixin');
const DateMixin = require('./DateMixin');
const language = require('./language');

const styles = require('./style.less');

module.exports = React.createClass({

    displayName: 'MonthPicker',

    mixins: [PureRenderMixin, PanelMixin, DateMixin],

    onCellClick: function (month, event) {
        event.stopPropagation();
        this.props.onCellSelect(month);
    },

    render: function () {

        const {panelYear, currentYear, currentMonth, activeYear, activeMonth} = this.state;

        const cellArray = [];

        let keyIndex = 0;

        const lang = language[this.props.lang] || language.en;

        const getCellElement = (function (year, month, classNames) {
            const classArray = ['cell', 'large'].concat(classNames);
            if (year == currentYear && month == currentMonth) classArray.push('current');
            if (year == activeYear && month == activeMonth) classArray.push('active');

            return (
                <div key={keyIndex++}
                     className={classArray.map((className) => styles[className]).join(' ')}
                     onClick={this.onCellClick.bind(this, month)}
                >
                    <span>{lang.month[month - 1]}</span>
                </div>
            );
        }).bind(this);

        for (let i = 0; i < 12; i++) {
            cellArray.push(getCellElement(panelYear, i + 1, []));
        }

        const tableRows = [];
        for (let i = 0; i < 3; i++) {
            const oneRow = [];
            for (let j = 0; j < 4; j++) {
                oneRow.push(cellArray[4 * i + j]);
            }
            tableRows.push(
                <tr key={i}>
                    <td colSpan='7'>{oneRow}</td>
                </tr>
            );
        }

        return <tbody>{tableRows}</tbody>;
    }
});