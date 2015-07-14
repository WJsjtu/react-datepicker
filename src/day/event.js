var dateFormat = require("../format.js");

module.exports = {
	select: function(dateObj, monthObj, event){
		var self = this;
		self.setState({
			active: dateObj,
			current: monthObj.date()
		});
		if(typeof self.props.onSelect == "function"){
			self.props.onSelect(dateObj, dateFormat);
		}
	},
	month: function(monthObj, event){
		this.setState({
			panel: 2
		});
	},
	move: function(monthObj, event){
		this.setState({
			current: monthObj.date()
		});
	},
	wheel: function(monthObj, deltaMode){
    	deltaMode.preventDefault();
    	this.setState({
    		current: (deltaMode.deltaY < 0 ? monthObj.next() : monthObj.prev()).date()
    	});
    }
};