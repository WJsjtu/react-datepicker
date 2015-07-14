require("./utils/bind.js");

var Month = require("./utils/month.js");

var clearTime = function(date){
	var daySec = 86400000, time;
	if(typeof date == "number"){
		time = parseInt(date / daySec) * daySec;
	} else if(date instanceof Date){
		time = parseInt(date.getTime() / daySec) * daySec;
	} else {
		if (__DEV__) {
			console.log(date);
			throw new TypeError("Function clearTime require Date or number args");
		}
	}
	var result = new Date;
	result.setTime(time);
	return result;
};


var dateFormat = require("./format.js");

/**
*
* props: active current focused rule preserve format onSelect
**/

window.Datepicker = React.createClass({
	getDefaultProps: function() {
		return {
		  	
		};
	},
	getInitialState: function(){
		var propActive = this.props.active, propCurrent = this.props.current || this.props.active || new Date;
		if(propActive){
			propActive = clearTime(propActive);
		}
		propCurrent = clearTime(propCurrent);
		return {
			active: propActive,
			current: propCurrent,
			focused: this.props.focused,
			panel: 1
		};
	},
	componentWillReceiveProps: function(nextProps){
		var newActive = nextProps.active, currActive = this.state.active, newCurrent = nextProps.current || currActive || new Date, obj = {};
		if(newActive){
			obj.active = clearTime(newActive);
		}
		obj.current = clearTime(newCurrent);
		this.setState(obj);
			
	},
	componentDidMount: function(){
		if(this.props.focused){
			React.findDOMNode(this.refs.input).focus();
		}
	},
	events: {
		day: require("./day/event.js"),
		month: require("./month/event.js"),
		year: require("./year/event.js")
	},
	isEnter: false,
	onFocus: function(){
		if(!this.state.focused){
			this.setState({
				focused: true
			});
		}
	},
	onBlur: function(){
		var self = this;
		if(!self.isEnter){
			var obj = {
				focused: false
			};
			if(!self.props.preserve){
				obj.panel = 1;
				obj.current = self.state.active || new Date;
			}
			self.setState(obj);
		}
	},
	onMouseEvent: function(isIn, event){
		this.isEnter = isIn;
	},
	onClick: function(){
		React.findDOMNode(this.refs.input).focus();
		this.setState({
			focused: true
		});
	},
	render: function(){

		var func, self = this, stateArgs = self.state;
		if(stateArgs.panel == 1){
			func = require("./day/html.jsx");
		} else if(stateArgs.panel == 2){
			func = require("./month/html.jsx");
		} else if(stateArgs.panel == 3){
			func = require("./year/html.jsx");
		}

		var format = self.props.format || function(date, fmt){
			return fmt(date, "mm/dd/yyyy");
		};

		var inline = func.bind(self, Month.prototype.parse(stateArgs.current))(),
			position = +self.props.position,
			input = <input type="text" key={0} ref="input"
							className="form-control" 
							value={format(stateArgs.active, dateFormat)} 
							onFocus={self.onFocus} 
							onBlur={self.onBlur} />,
			style = {};

		if(!(position < 7 || position >= 0)){
			position = 5;
		}
		position = parseInt(position);

		if(position % 3 == 2){
			style.left = 0;
		} else if(position % 3 == 0){
			style.right = 0;
		} else if(position){
			style.left = "50%";
			style.marginLeft = - 107;
		}

		if(position == 0){
			return <div className="datepicker datepicker-inline">{inline}</div>;
		} else {
			var datepicker = <div key={1} className="datepicker datepicker-dropdown" style={style}>{inline}</div>;
			if(position < 4){
				style.bottom = 36;
			} else {
				style.top = 36;
			}
			var content = stateArgs.focused ? [input, datepicker] : [input];
			return <div style={{position: "relative"}} 
						onMouseEnter={self.onMouseEvent.bind(self, true)} 
						onMouseLeave={self.onMouseEvent.bind(self, false)}
						onClick={self.onClick}>
						{content}
					</div>;
		}
	}
	
});

Datepicker.position = {
	INLINE: 0,
	TOP: {
		AUTO: 1,
		LEFT: 2,
		RIGHT: 3
	},
	BOTTOM: {
		AUTO: 4,
		LEFT: 5,
		RIGHT: 6
	},
};