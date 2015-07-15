function Month(year, month){
	var self = this;
	self.year = year;
	self.month = month;
	self.leap = ((month == 2) && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0));
	self.days = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1][month] + 30 + self.leap;
}

var proto = Month.prototype;

proto.next = function(){
	var self = this;
	if(self.month != 11){
		return new Month(self.year, self.month + 1);
	} else {
		return new Month(self.year + 1, 1);
	}
};

proto.prev = function(){
	var self = this;
	if(self.month != 0){
		return new Month(self.year, self.month - 1);
	} else {
		return new Month(self.year - 1, 11);
	}
};

proto.compare = function(monthObj){
	var self = this;
	if(self.year == monthObj.year){
		return self.month - monthObj.month;
	} else {
		return self.year - monthObj.year;
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
