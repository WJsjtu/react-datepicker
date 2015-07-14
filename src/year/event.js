module.exports = {
	select: function(year, event){
		var current = this.state.current;
		current.setFullYear(year);
		this.setState({
			panel: 2,
			current: current
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