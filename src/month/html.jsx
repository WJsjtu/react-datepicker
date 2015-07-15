// import language file
var locales = require("../locales/" + __LOCALE__ + ".js");

// import Month class
var Month = require("../utils/month.js");

module.exports = function(currMonth){

	/**
	*
	* this refers to this in React Components
	* date refers to the picker panel which the date is in
	* onSwitch is a event handler to go to month select panel
	*
	**/
	var instance = this;

	//according to the usage day events should implement "select[dateObj, monthObj]", "year[year]", "go[monthObj]" events
	var events = instance.events.month;

	var eventBinder = function(name, arg1){
		return events[name].bind(instance, arg1);
	};

	var thead = <thead>
					<tr>
						<th className="prev" onClick={eventBinder("move", currMonth.year - 1)}>«</th>
						<th colSpan="5" className="datepicker-switch" onClick={eventBinder("year", currMonth.year)}>{currMonth.year}</th>
						<th className="next" onClick={eventBinder("move", currMonth.year + 1)}>»</th>
					</tr>
				</thead>;

	var spans = [];
	for(var i = 0; i < 12; i++){
		spans.push([locales.month[i], "month"]);
	}

	var addSpecialMonth = function(date, className){
		if(!date){
			return;
		}
		var month = Month.prototype.parse(date);
		if(month.year == currMonth.year){
			spans[month.month][1] += className;
		}
	};
	addSpecialMonth(new Date, " today");
	addSpecialMonth(instance.state.active, " active");

	var tbody = <tbody onWheel={eventBinder("wheel", currMonth.year)}>
					<tr>
						<td colSpan="7">
							{spans.map(function(ele, index){
								return <span className={ele[1]} key={index} onClick={eventBinder("select", index)}>{ele[0]}</span>;
							})}
						</td>
					</tr>
				</tbody>;

	return <div className="datepicker-days" style={{display: "block"}}>
				<table className="table">
					{thead}
					{tbody}
				</table>
			</div>;
};
