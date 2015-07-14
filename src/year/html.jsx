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
	var events = instance.events.year;

	var eventBinder = function(name, arg1){
		return events[name].bind(instance, arg1);
	};

	var startYear = parseInt(currMonth.year / 10) * 10 - 1;

	var thead = <thead>
					<tr>
						<th className="prev" onClick={eventBinder("move", startYear - 9)}>«</th>
						<th colSpan="5" className="datepicker-switch">{startYear + 1}-{startYear + 10}</th>
						<th className="next" onClick={eventBinder("move", startYear + 11)}>»</th>
					</tr>
				</thead>;

	var spans = [];
	for(var i = 0; i < 12; i++){
		spans.push([startYear + i, "year"]);
	}
	spans[0][1] += " old";
	spans[11][1] += " new";

	var tbody = <tbody onWheel={eventBinder("wheel", currMonth.year)}>
					<tr>
						<td colSpan="7">
							{spans.map(function(ele, index){
								return <span className={ele[1]} key={index} onClick={eventBinder("select", ele[0])}>{ele[0]}</span>;
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
