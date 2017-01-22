import {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import locale from './../locale';

/**
 *
 * @param {React.Component} component
 * @return {React.Component}
 * @constructor
 */
export default function PanelDecorator(component) {

    const proto = component.prototype;

    proto.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(proto);

    proto.onCellClick = function () {
        const event = arguments[arguments.length - 1];
        event.stopPropagation();

        const args = Array.prototype.slice.call(arguments, 0, -1);

        this.props.onCellSelect.apply(this, args);

    };

    component.propTypes = process.env.NODE_ENV === "production" ? undefined : {
        activeYear: PropTypes.number.isRequired,
        activeMonth: PropTypes.number.isRequired,
        activeDay: PropTypes.number.isRequired,
        currentYear: PropTypes.number.isRequired,
        currentMonth: PropTypes.number.isRequired,
        currentDay: PropTypes.number.isRequired,
        panelYear: PropTypes.number.isRequired,
        panelMonth: PropTypes.number.isRequired,
        onCellSelect: PropTypes.func.isRequired,
        rule: PropTypes.func.isRequired,
        lang: PropTypes.oneOf(Object.keys(locale)).isRequired
    };

    return component;
}