import util from '@/libs/util.js';

let hardwarefun={};
let spa ;

const header = {'Content-Type': 'application/json;charset=UTF-8'};
hardwarefun.setThis = function(obj) {
	this.spa = obj;
};

hardwarefun.getHardwareInfo = function (data,type) {   
	util.ajax.post(data, "", header).then((rres) => {
    	if(rres.data) {
    		if(type=="ifstat"){
    			this.spa.data_list=rres.data.ifStat;
    		}else if(type=="cpuperc"){
    			this.spa.data_list=rres.data.cpuPerc;
    		}
		}else{
			this.spa.$Modal.error({
                title: '提示',
                content: ''
            });
		}
	}).catch((err) => {              		
		this.spa.$Modal.error({
            title: '出错啦',
            content: err
        });
	});
};

export default hardwarefun;