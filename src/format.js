module.exports = function(date, fmt) {
	if(!(date instanceof Date)){
		return "";
	}
	var day = date.getDate(),
		month = date.getMonth() + 1,
		year = date.getFullYear()
		o = {
			"m+": month,
			"d+": day,
			"q+": Math.floor((month + 2) / 3)
		};
	if (/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o){
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};