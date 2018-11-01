let datetool = {

};
datetool.format = function (d) {
	//console.log(d);
	//console.log(new Date(d));
	//console.log(new Date(d).toLocaleString());
	if(d) {
		var date = new Date(d);
		var m = date.getMonth()+1;
		var r = date.getDate();
		return date.getFullYear()+'-'+ (m >= 10 ? m : '0'+m) +'-'+ (r>=10?r : '0'+r);
	}      	
	else 
		return "";
};

export default datetool;
