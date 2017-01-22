import locale from './../locale';

import {Component} from 'react';

import PanelDecorator  from './../utils/PanelDecorator';
import styles from './../style.less';

/**
 * @class MonthPicker
 * @extends React.Component
 */
@PanelDecorator
class MonthPicker extends Component {

    render() {

        const {
            panelYear,
            currentYear,
            currentMonth,
            activeYear,
            activeMonth,
            lang
        } = this.props;

        const cellArray = [];

        let keyIndex = 0;

        const language = locale[lang] || locale.en;

        const getCellElement = (year, month, classNames) => {
            const classArray = ['cell', 'large'].concat(classNames);
            if (year == currentYear && month == currentMonth) classArray.push('current');
            if (year == activeYear && month == activeMonth) classArray.push('active');

            return (
                <div key={keyIndex++}
                     className={classArray.map((className) => styles[className]).join(' ')}
                     onClick={this.onCellClick.bind(this, month)}
                >
                    <span>{language.month[month - 1]}</span>
                </div>
            );
        };

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
}

/**
 * @export MonthPicker
 * @module MonthPicker
 */
export default MonthPicker;