function Month(year, month){
	this.year = year;
	this.month = month;
	this.leap = ((month == 2) && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0));
	this.days = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1][month] + 30 + this.leap;
}

var proto = Month.prototype;

proto.next = function(){
	if(this.month != 11){
		return new Month(this.year, this.month + 1);
	} else {
		return new Month(this.year + 1, 1);
	}
};

proto.prev = function(){
	if(this.month != 0){
		return new Month(this.year, this.month - 1);
	} else {
		return new Month(this.year - 1, 11);
	}
};

proto.compare = function(monthObj){
	if(this.year == monthObj.year){
		return this.month - monthObj.month;
	} else {
		return this.year - monthObj.year;
	}
}

proto.date = function(){
	var date = new Date;
	date.setFullYear(this.year);
	date.setMonth(this.month);
	date.setDate(1);
	return date;
};

proto.parse = function(date){
	return new Month(date.getFullYear(), date.getMonth());
};

module.exports = Month;
