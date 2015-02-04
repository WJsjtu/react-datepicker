# react-datepicker
A datepicker component written in React.js

###Demo
![](http://wjsjtu.github.io/react-datepicker/demo.PNG)
[See demo here.](http://wjsjtu.github.io/react-datepicker/)

###Usage
####Create DOM like:
```html
<div class="demo">
	<h1>example1</h1>
	<div id="example1"></div>
</div>
<div class="demo">
	<h1>example2</h1>
	<div id="example2"></div>
</div>
<div class="demo">
	<h1>example3</h1>
	<div id="example3"></div>
</div>
```
####Javacript code:

```javascript
//to avoid conflict
	var myDatepicker = Datepicker.noConflict();
  
  React.render(React.createElement(myDatepicker, {
		current: null,
		onSelect: function(date) {
			console.log(date);
		}
	}), document.getElementById('example1'));
	
	var test = new Date;
	    test.setFullYear(2008);
			test.setMonth(4);
			test.setDate(12);

	React.render(React.createElement(myDatepicker, {
		current: test,
		panel: 2,
		onSelect: function(date) {
			console.log(date);
		}
	}), document.getElementById('example2'));

	var weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
		yearMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	myDatepicker.addLang("en", {
		dayTitle: weekDays,
		monthTitle: yearMonths,
		dateTitle: function(year, month, day){
			return year + " " + yearMonths[month - 1];
		}
	});

	React.render(React.createElement(myDatepicker, {
		current: null,
		panel: 1,
		lang: "en",
		onSelect: function(date) {
		  console.log(date);
		}
	}), document.getElementById('example3'));
```

### Options

#### current
Type: `Date` 
Default: `new Date`

Set the start date of this datepicker.

#### panel
Type: `Number`
Default: `1`

Panel `1` refers to the date panel.`2` refers to month panel like `example2 & example3`. `3` refers to year panel.

#### lang
Type: `String`
Default: `"zh"`

Set the language of this datepicker.

#### onSelect
Type: `"Function( Object )"`
Default: `null`

This sets the callback when you select a day.And the`Object` is a new class `DateItem`, the following code is about its details:
```javascript
DateItem = function(date){
	if(!(date instanceof Date)){
		date = new Date;
	}
	var self = this; self.init = {};
	self.init.y = self.y = date.getFullYear();
	self.init.m = self.m = date.getMonth() + 1;
	self.init.d = self.d = date.getDate();
},
DateItem.prototype.toDate = function(){
	var self = this, date = new Date;
	date.setFullYear(self.y);
	date.setMonth(self.m - 1);
	date.setDate(self.d);
	return date;
};
DateItem.prototype.monthDays = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
DateItem.prototype.nextMonth = function(){
	var self = this;
	if(self.m == 12){
		self.y += 1;
		self.m = 1;
	} else {
		self.m += 1;
	}
	self.d = 1;
	return self;
};
DateItem.prototype.prevMonth = function(){
	var self = this;
	if(self.m == 1){
		self.y -= 1;
		self.m = 12;
	} else {
		self.m -= 1;
	}
	self.d = 1;
	return self;
};
DateItem.prototype.getMonthDays = function(){
	var self = this, leap = (self.m == 2) && (self.y % 4 == 0 && self.y % 100!=0 || self.y % 400 == 0) ? 1 : 0;
    return self.monthDays[self.m - 1] + 30 + leap;
};
DateItem.prototype.format = function(fmt) {
	var self = this, o = {
		"M+": self.m,
		"d+": self.d,
		"q+": Math.floor((self.m + 2) / 3)
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (self.y + "").substr(4 - RegExp.$1.length));
	for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
```

### Methods

#### Datepicker

```javascript
React.render(React.createElement(Datepicker, {
		current: null,
		panel: 1,
		lang: "en",
		onSelect: function(date) {
		  console.log(date);
		}
	}), document.getElementById('example3'));
```

It is easy to understand in JSX:

```javascript
React.render(<Datepicker current={null}
                         panel={1}
                         lang={"en"} 
                         onSelect={function(date) {console.log(date);}}
             />,
document.getElementById('example3'));
```

#### addLang
arguments `String` name, `{ dayTitle: Array, monthTitle: Array, dateTitle: String or Function }`

Note: `"zh"` is default name for lang, and the Object is configured in code.If you want to replace it. You can override the `"zh"`'s object.

For details, see code of `example3`.

#### noConflict
To avoid the confliction that caused by the same name as Datepicker.

###Todo
Add props to set range of the date.
Set style apart.
