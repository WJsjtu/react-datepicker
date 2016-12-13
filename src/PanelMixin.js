const {PropTypes} = React;

module.exports = {

    propTypes: process.env.NODE_ENV === "production" ? {} : {
        activeYear: PropTypes.number,
        activeMonth: PropTypes.number,
        activeDay: PropTypes.number,
        currentYear: PropTypes.number,
        currentMonth: PropTypes.number,
        currentDay: PropTypes.number,
        panelYear: PropTypes.number,
        panelMonth: PropTypes.number,
        onCellSelect: PropTypes.func,
        rule: PropTypes.func,
        lang: PropTypes.PropTypes.oneOf(['en', 'zh'])
    },

    getInitialState: function () {
        const {rule, onCellSelect, ..._props} = this.props;
        return _props;
    },

    componentWillReceiveProps: function (nextProps) {
        const {rule, onCellSelect, ..._props} = nextProps;
        this.setState(_props);
    }
};