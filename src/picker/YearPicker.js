import {Component} from 'react';

import PanelDecorator  from './../utils/PanelDecorator';
import styles from './../style.less';

/**
 * @class YearPicker
 * @extends React.Component
 */
@PanelDecorator
class YearPicker extends Component {

    render() {

        const {
            panelYear,
            currentYear,
            activeYear
        } = this.props;

        const cellArray = [];

        let keyIndex = 0;

        const getCellElement = (year, classNames) => {
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
        };

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
}

/**
 * @export YearPicker
 * @module YearPicker
 */
export default YearPicker;