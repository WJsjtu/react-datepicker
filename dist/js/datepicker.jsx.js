(function(React, window){var __ReactCreateElement = React.createElement;var monthDays = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
	yearMonths = ["一","二","三","四","五","六","七","八","九","十","十一","十二"],
	classPreffix = "class-",
	itemPreffix = "item-",
	dayClassSet = {
		BASIC: "am-datepicker-day",
		ACTIVE: "am-datepicker-day am-active",
		DISABLED: "am-datepicker-day am-disabled",
		CURRENT: "am-datepicker-day am-datepicker-current"
	},
	monthClassSet = yearClassSet = {
		BASIC: "",
		ACTIVE: "am-active",
		CURRENT: "am-datepicker-current"
	},
    getDayOfWeek = function(year, month){
    	var _date = new Date();
		_date.setFullYear(year);
		_date.setMonth(month - 1);
		_date.setDate(1);
		return _date.getDay();
    },
    getMonthDayCount = function(year, month){
    	var leap = (month == 2) && (year % 4 == 0 && year % 100!=0 || year % 400 == 0) ? 1 : 0;
    	return monthDays[month - 1] + 30 + leap;
    },
    getDayCaculate = function(year, month, day){
		var i, j, k, index = 0, dayList = {},
	   		currCnt = getMonthDayCount(year, month),
	   		lastCnt = getMonthDayCount(month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1),
	   		nextCnt = getMonthDayCount(month == 12 ? year + 1 : year, month == 12 ? 1 : month + 1),
	   		dayOfWeek = getDayOfWeek(year, month),
	   		dayOfWeek = dayOfWeek == 1 ? 7 : (dayOfWeek ? dayOfWeek - 1 : 6);
	   	for(i = 0; i < dayOfWeek; i++, index++) {
	   		dayList[classPreffix + index] = -1;
	   		dayList[itemPreffix + index] = lastCnt - dayOfWeek + 1 + i;
		}
	   	for(j = 0; j < currCnt; j++, index++) {
	   		dayList[classPreffix + index] = 0;
	   		dayList[itemPreffix + index] = j + 1;
	   	}
	   	for(k = 0; k < 42 - currCnt - dayOfWeek; k++, index++) {
	   		dayList[classPreffix + index] = -1;
	   		dayList[itemPreffix + index] = k + 1;
	   	}
	   	day ? dayList[classPreffix + (dayOfWeek + day - 1)] = 2 : dayList[classPreffix + dayOfWeek] = 1;
	   	return {
	   		active: day ? "" + (dayOfWeek + day - 1) : "" + dayOfWeek,
	   		obj: dayList
	   	};
    },
    getMonthCaculate = function(month){
    	var monthList = {}, i = 0;
    	for(; i < 12; i++){
    		monthList[classPreffix + i] = 0;
    		monthList[itemPreffix + i] = i + 1;
    	}
    	month ? monthList[classPreffix + (month - 1)] = 2 : monthList[classPreffix + "0"] = 1;
    	return {
	   		active: month ? "" + (month - 1) : "0",
	   		obj: monthList
	   	};
    },
    getYearCaculate = function(start ,year){
    	var yearList = {}, i = 0;
    	for(; i < 12; i++){
    		yearList[classPreffix + i] = 0;
    		yearList[itemPreffix + i] = start + i;
    	}
    	year ? yearList[classPreffix + (year - start)] = 2 : yearList[classPreffix + "0"] = 1;
    	return {
	   		active: year ? "" + (year - start) : "0",
	   		obj: yearList
	   	};
    },
    tbodyMixin = {
		activeItem: null,
		getInitialState: function() {
			var result = this.getCaculate(this.props);
			this.activeItem = result.active;
	    	return result.obj;
		},
		componentWillReceiveProps: function(nextProps){
			var result = this.getCaculate(nextProps);
			this.activeItem = result.active;
			this.setState(result.obj);
		},
		onClick: function(name, event){
			event && event.stopPropagation();
			var _name = this.activeItem, temp = {};
			if(_name !== null && _name !== name && this.state[classPreffix + _name] === 1){
				temp[classPreffix + _name] = 0;
			}
			if(_name !== name){
				temp[classPreffix + name] = this.state[classPreffix + name] == 2 ? 2 : 1;
				this.activeItem = name;
				this.setState(temp);
			}
			typeof this.props.select === "function" && this.props.select(this.state[itemPreffix + name]);
		}
	},
	DatepickerDayTbody = React.createClass({displayName: "DatepickerDayTbody",
		mixins: [tbodyMixin],
		getCaculate: function(obj){
			return getDayCaculate(obj.year, obj.month, obj.day);
		},
		render: function(){
			var tbody = [];
		  	for(i = 0; i < 6; i++){
		  		var tr = [];
		  		for(j = 0; j < 7; j++){
		  			var name = 7 * i + j, className, onClick = this.onClick.bind(this, name);
		  			switch (this.state[classPreffix + name]){
		  				case -1: className = dayClassSet.DISABLED; onClick = null; break;
		  				case 0: className = dayClassSet.BASIC; break;
		  				case 1: className = dayClassSet.ACTIVE; break;
		  				case 2: className = dayClassSet.CURRENT; break;
		  			}
		  			tr.push(React.createElement("td", {key: name, className: className, onClick: onClick}, this.state[itemPreffix + name]));
		  		}
		  		tbody.push(React.createElement("tr", {key: i}, tr));
		    }
			return React.createElement("tbody", null, tbody);
    	}
	}),
	DatepickerMonthTbody = React.createClass({displayName: "DatepickerMonthTbody",
		mixins: [tbodyMixin],
		getCaculate: function(obj){
			return getMonthCaculate(obj.month);
		},
		render: function(){
			var spans = [], i = 0, className, onClick;
			for(; i < 12; i++){
				onClick = this.onClick.bind(this, i);
				switch (this.state[classPreffix + i]){
		  			case 0: className = monthClassSet.BASIC; break;
		  			case 1: className = monthClassSet.ACTIVE; break;
		  			case 2: className = monthClassSet.CURRENT; break;
		  		}
		  		spans.push(React.createElement("span", {key: "m-" + i, className: className, onClick: onClick}, yearMonths[this.state[itemPreffix + i] - 1] + "月"));
			}
			return React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {colSpan: "7"}, spans)));
		}
	}),
	DatepickerYearTbody = React.createClass({displayName: "DatepickerYearTbody",
		mixins: [tbodyMixin],
		getCaculate: function(obj){
			return getYearCaculate(obj.start, obj.year);
		},
		render: function(){
			var spans = [], i = 0, className, onClick;
			for(; i < 12; i++){
				onClick = this.onClick.bind(this, i);
				switch (this.state[classPreffix + i]){
		  			case 0: className = yearClassSet.BASIC; break;
		  			case 1: className = yearClassSet.ACTIVE; break;
		  			case 2: className = yearClassSet.CURRENT; break;
		  		}
		  		spans.push(React.createElement("span", {key: "y-" + i, className: className, onClick: onClick}, this.state[itemPreffix + i]));
			}
			return React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {colSpan: "7"}, spans)));
		}
	}),
	Datepicker = React.createClass({displayName: "Datepicker",
		getDate: function(){
			return {
				year: this.state.year,
				month: this.state.month,
				day: this.state.day
			};
		},
		getInitialState: function () {
			var year = this.props.year,
				month = this.props.month,
				day = this.props.day;
			return {
				year: year,
				month: month,
				day: day,
		  		panel: 1
			};
		},
    	changePanel: function(){
			this.setState({panel: this.state.panel + 1});
    	},
    	selectDay: function(day){
    		var month = this.state.month < 10 ? "0" + this.state.month : "" + this.state.month,
    			day = day < 10 ? "0" + day : "" + day;
    		typeof this.props.select === "function" && this.props.select(this.state.year, month, day);
    	},
    	selectMonth: function(month){
	    	var year = this.state.year,
				day = (year == this.props.year && month == this.props.month) ? this.props.day : null;
			this.setState({
				month: month,
				day: day,
			  	panel: 1
			});
    	},
    	selectYear: function(year){
	    	var month = this.state.month;
			this.setState({
				year: year,
			  	panel: 2
			});
    	},
    	onWheel: function(deltaMode){
    		deltaMode.deltaY > 0 ? this.goNext() : this.goPrev();
    	},
		goPrev: function(event){
    		event && event.stopPropagation();
    		if(this.state.panel == 1){
		    	var year = this.state.year - (this.state.month == 1 ? 1 : 0),
		    		month = this.state.month == 1 ? 12 : this.state.month - 1,
		   			day = year == this.props.year && month == this.props.month ? this.props.day : null;
		   		this.setState({
					year : year,
					month: month,
					day: day
				});
		   	} else if(this.state.panel == 2){
				var year = this.state.year - 1,
			   		month = year == this.props.year ? this.props.month : null;
		  		this.setState({
		  			year : year,
		   			month: month,
		   			day: null
				});
		   	} else if(this.state.panel == 3){
		   		var year = this.state.year - 12,
			   		month = year == this.props.year ? this.props.month : null;
		  		this.setState({
		  			year : year,
		   			month: month,
		   			day: null
				});
		   	}
    	},
    	goNext: function(event){
    		event && event.stopPropagation();
    		if(this.state.panel == 1){
		    	var year = this.state.year + (this.state.month == 12 ? 1 : 0),
		    		month = this.state.month == 12 ? 1 : this.state.month + 1,
		    		day = year == this.props.year && month == this.props.month ? this.props.day : null;
		    	this.setState({
			   		year : year,
		   			month: month,
		   			day: day
			  	});
		    } else if(this.state.panel == 2){
				var year = this.state.year + 1,
			   		month = year == this.props.year ? this.props.month : null;
		  		this.setState({
		  			year : year,
		   			month: month,
		   			day: null
				});
		   	} else if(this.state.panel == 3){
		   		var year = this.state.year + 12,
			   		month = year == this.props.year ? this.props.month : null;
		   		this.setState({
		  			year : year,
		   			month: month,
		   			day: null
				});
		   	}
    	},
		render: function() {
			var table = null;
			if(this.state.panel == 1){
				table = React.createElement("table", {className: "am-datepicker-table", onWheel: this.onWheel}, 
							React.createElement("thead", null, 
									React.createElement("tr", {className: "am-datepicker-header"}, 
										React.createElement("th", {className: "am-datepicker-prev"}, 
										    React.createElement("i", {className: "am-datepicker-prev-icon", onClick: this.goPrev})
										), 
										React.createElement("th", {colSpan: "5", className: "am-datepicker-switch"}, 
											React.createElement("div", {className: "am-datepicker-select", onClick: this.changePanel}, this.state.year, "年", this.state.month, "月")
										), 
										React.createElement("th", {className: "am-datepicker-next"}, 
										    React.createElement("i", {className: "am-datepicker-next-icon", onClick: this.goNext})
										)
									), 
									React.createElement("tr", null, 
										["一","二","三","四","五","六","日"].map(function(day, index){
										    return React.createElement("th", {key: "th-"+ index, className: "am-datepicker-dow"}, day)
										})
									)
							), 
		  					React.createElement(DatepickerDayTbody, {year: this.state.year, month: this.state.month, day: this.state.day, select: this.selectDay})
		  				);
			} else if(this.state.panel == 2){
				table = React.createElement("table", {className: "am-datepicker-table", onWheel: this.onWheel}, 
							React.createElement("thead", null, 
								React.createElement("tr", {className: "am-datepicker-header"}, 
									React.createElement("th", {className: "am-datepicker-prev"}, 
									    React.createElement("i", {className: "am-datepicker-prev-icon", onClick: this.goPrev})
									), 
									React.createElement("th", {colSpan: "5", className: "am-datepicker-switch"}, 
										React.createElement("div", {className: "am-datepicker-select", onClick: this.changePanel}, this.state.year)
									), 
									React.createElement("th", {className: "am-datepicker-next"}, 
									    React.createElement("i", {className: "am-datepicker-next-icon", onClick: this.goNext})
									)
								)
							), 
							React.createElement(DatepickerMonthTbody, {month: this.state.month, select: this.selectMonth})
						);
			} else if(this.state.panel == 3){
				var start = this.state.year - this.state.year % 10,
					year = start == (this.props.year - this.props.year % 10) ? this.props.year : null;
				table = React.createElement("table", {className: "am-datepicker-table", onWheel: this.onWheel}, 
							React.createElement("thead", null, 
								React.createElement("tr", {className: "am-datepicker-header"}, 
									React.createElement("th", {className: "am-datepicker-prev"}, 
									    React.createElement("i", {className: "am-datepicker-prev-icon", onClick: this.goPrev})
									), 
									React.createElement("th", {colSpan: "5", className: "am-datepicker-switch"}, 
										React.createElement("div", {className: "am-datepicker-select"}, start, "-", start + 9)
									), 
									React.createElement("th", {className: "am-datepicker-next"}, 
									    React.createElement("i", {className: "am-datepicker-next-icon", onClick: this.goNext})
									)
								)
							), 
							React.createElement(DatepickerYearTbody, {start: start, year: year, select: this.selectYear})
						);
			}
		    return React.createElement("div", {className: "am-datepicker", style: {display: "block"}, onWheel: this.onWheel}, 
			    		React.createElement("div", {className: "am-datepicker-days", style: {display: "block"}}, table)
			    	);
		 }
    });
window.Datepicker = function(dom, date, select){
	if(!date) date = new Date();
	React.render(
        React.createElement(Datepicker, {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), select: select}),
        dom
    );
};})(React, window);