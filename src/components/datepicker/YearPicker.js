const {createElement} = React;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const PanelMixin = require('./PanelMixin');
const DateMixin = require('./DateMixin');

const styles = require('./style.less');

module.exports = React.createClass({

    displayName: 'MonthPicker',

    mixins: [PureRenderMixin, PanelMixin, DateMixin],

    onCellClick: function (year, event) {
        event.stopPropagation();
        this.props.onCellSelect(year);
    },

    render: function () {

        const {panelYear, currentYear, activeYear} = this.state;

        const cellArray = [];

        let keyIndex = 0;

        const getCellElement = (function (year, classNames) {
            const classArray = ['cell', 'large'].concat(classNames);
            if (year == currentYear) classArray.push('current');
            if (year == activeYear) classArray.push('active');

            return (
                <div key={keyIndex++}
                     className={classArray.map((className) => styles[className]).join(' ')}
                     onClick={this.onCellClick.bind(this, year)}
                >
                    <span>{year}</span>
                </div>
            );
        }).bind(this);

        const startYear = parseInt(panelYear / 10) * 10 - 1;

        for (let i = 0; i < 12; i++) {
            cellArray.push(getCellElement(startYear + i, (i == 0) ? ['old'] : (i == 11 ? ['new'] : [])));
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