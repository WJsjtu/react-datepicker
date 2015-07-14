// import language file
var locales = require("../locales/" + __LOCALE__ + ".js");

// import Month class
var Month = require("../utils/month.js");

var dateFormat = require("../format.js");

module.exports = function(currMonth){

	/**
	*
	* this refers to this in React Components
	* date refers to the picker panel which the date is in
	* onSwitch is a event handler to go to month select panel
	*
	**/
	var instance = this;

	var rule = instance.props.rule;

	if(typeof rule != "function"){
		rule = undefined;
	}

	var prevMonth = currMonth.prev(),
		nextMonth = currMonth.next();

	var prevDays = currMonth.date().getDay();

	// add a row before this month when the first day of this month is Sunday
	if(!prevDays){
		prevDays = 7;
	}

	var daysArr = [], dayDate, className, validate;

	for(var i = 0; i < prevDays; i++){
		dayDate = prevMonth.date();
		dayDate.setDate(prevMonth.days - prevDays + 1 + i);
		validate = !rule || (rule(dayDate, dateFormat) !== false);
		className = (validate ? "day" : "day disabled") + " old";
		daysArr.push([dayDate, className, validate, prevMonth]);
	}

	for(var i = 0; i < currMonth.days; i++){
		dayDate = currMonth.date();
		dayDate.setDate(i + 1);
		validate = !rule || (rule(dayDate, dateFormat) !== false);
		className = (validate ? "day" : "day disabled");
		daysArr.push([dayDate, className, validate, currMonth]);
	}

	for(var i = 0; i < 42 - prevDays - currMonth.days; i++){
		dayDate = nextMonth.date();
		dayDate.setDate(i + 1);
		validate = !rule || (rule(dayDate, dateFormat) !== false);
		className = (validate ? "day" : "day disabled") + " new";
		daysArr.push([dayDate, className, validate, nextMonth]);
	}


	var addSpecialDay = function(date, className){
		if(!date){
			return;
		}
		var month = Month.prototype.parse(date), _date = date.getDate();
		if(!month.compare(prevMonth)){
			if(_date >= prevMonth.days - prevDays + 1){
				daysArr[_date - prevMonth.days + prevDays - 1][1] += className;
			}
		} else if(!month.compare(currMonth)){
			daysArr[prevDays + _date - 1][1] += className;
		} else if(!month.compare(nextMonth)){
			if(_date < 42 - prevDays - currMonth.days){
				daysArr[prevDays + currMonth.days + _date - 1][1] += className;
			}
		}
	};
	addSpecialDay(new Date, " today");
	addSpecialDay(instance.state.active, " active");


	//according to the usage day events should implement "select[dateObj, monthObj]", "year[year]", "go[monthObj]" events
	var events = instance.events.day;

	var eventBinder = function(name, arg1, arg2){
		return arg2 ? events[name].bind(instance, arg1, arg2) : events[name].bind(instance, arg1);
	};

	var rows = [], row, item, className;
	for(var i = 0; i < 6; i++){
		row = [];
		for(var j = 0; j < 7; j++){
			item = daysArr[7 * i + j];
			row.push(
				item[2] ? 
				<td key = {j} className={item[1]} onClick={eventBinder("select", item[0], item[3])}>{item[0].getDate()}</td> :
				<td key = {j} className={item[1]} >{item[0].getDate()}</td>
			);
		}
		rows.push(<tr key={i}>{row}</tr>);
	}

	var tbody = <tbody onWheel={eventBinder("wheel", currMonth)}>{rows}</tbody>;


	var thead = <thead>
					<tr>
						<th className="prev" onClick={eventBinder("move", prevMonth)}>«</th>
						<th colSpan="5" className="datepicker-switch" onClick={eventBinder("month", currMonth)}>
							{locales.month[currMonth.month] + " " + currMonth.year}
						</th>
						<th className="next" onClick={eventBinder("move", nextMonth)}>»</th>
					</tr>
					<tr>{locales.week.map(function(ele, index){
						return <th key={index} className="dow">{ele}</th>;
					})}</tr>
				</thead>;

	return 	<div className="datepicker-days" style={{display: "block"}}>
				<table className="table">
					{thead}
					{tbody}
				</table>
			</div>

};
