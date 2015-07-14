module.exports = {
	select: function(month, event){
		var current = this.state.current;
		current.setMonth(month);
		this.setState({
			panel: 1,
			current: current
		});
	},
	year: function(year, event){
		this.setState({
			panel: 3
		});
	},
	move: function(year, event){
		var current = this.state.current;
		current.setFullYear(year);
		this.setState({
			current: current
		});
	},
	wheel: function(year, deltaMode){
    	deltaMode.preventDefault();
    	var current = this.state.current;
    	current.setFullYear(year + (deltaMode.deltaY < 0 ? 1 : -1));
    	this.setState({
    		current: current
    	});
    }
};