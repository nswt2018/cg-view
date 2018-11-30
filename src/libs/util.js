import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';

let util = {

};
util.title = function (title) {
    title = title || '新宇平台';
    window.document.title = title;
};

const ajaxUrl = (env === 'development' ? '/api' : (env === 'production' ? '' : '/api'));

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.o2Arr = function(object) {
	//alert(object);
    var arr = [];
    var i = 0;
    for (var item in object) {
        arr[i] = item;
        i++;
		//alert(i+":"+arr[i]);
    }
    return arr;
};

util.showThisRoute = function (curRight, cacheRight) {
	if(!cacheRight) return false;
	let myArr = cacheRight.split(",");	
	//alert(curRight+"\r\n"+cacheRight+"\r\n"+myArr.join("|")+"\r\n"+util.oneOf(curRight, myArr));
    if (typeof myArr === 'object' || Array.isArray(myArr)) {		
        return util.oneOf(curRight, myArr);
    } else {
        return curRight === cacheRight;
    }
};

util.showThisRoute_old = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];

    //去首页
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } 

    //去导航菜单一级页面或者OtherRouter路由中的页面
    else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } 

    //去导航菜单二级页面或三级页面或四级页面
    else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            var hasMenu;
			let cArr2 = item.children;
			for(let i=0;i<cArr2.length;i++){
				if(cArr2[i].children){
					let cArr3 = cArr2[i].children;
					for(let j=0;j<cArr3.length;j++){
						if(cArr3[j].children){
							let cArr4 = cArr3[j].children;
							for(let k=0;k<cArr4.length;k++){
								if(cArr4[k].name === name){ //四级菜单
									hasMenu = true;
									return hasMenu;
								}
							}
						}else{ //三级菜单
							if(cArr3[j].name === name){
								hasMenu = true;
								return hasMenu;
							}
						}
					}
					
				}else{ //二级菜单
					if(cArr2[i].name === name){
						hasMenu = true;
						return hasMenu;
					}
				}
			}
			
			return false;
			
        })[0];
        
		let cArr2 = currentPathObj.children;
		for(let i=0;i<cArr2.length;i++){
			if(cArr2[i].children){
				let cArr3 = cArr2[i].children;
				for(let j=0;j<cArr3.length;j++){
					if(cArr3[j].children){
						let cArr4 = cArr3[j].children;
						for(let k=0;k<cArr4.length;k++){
							if(cArr4[k].name === name){ //四级菜单
								currentPathArr = [
									{
										title: '首页',
										path: '',
										name: 'home_index'
									},
									{
										title: currentPathObj.title,
										path: '',
										name: currentPathObj.name
									},
									{
										title: cArr2[i].title,
										path: '',
										name: name
									},
									{
										title: cArr3[j].title,
										path: '',
										name: name
									},
									{
										title: cArr4[k].title,
										path: '',
										name: name
									}
								];
							}
						}
					}else{ //三级菜单
						if(cArr3[j].name === name){
							currentPathArr = [
								{
									title: '首页',
									path: '',
									name: 'home_index'
								},
								{
									title: currentPathObj.title,
									path: '',
									name: currentPathObj.name
								},
								{
									title: cArr2[i].title,
									path: '',
									name: name
								},
								{
									title: cArr3[j].title,
									path: '',
									name: name
								}
							];
						}
					}
				}
			}else{ //二级菜单
				if(currentPathObj.name === 'home'){
					currentPathArr = [
						{
							title: '首页',
							path: '',
							name: 'home_index'
						}
					];
				}else{
					currentPathArr = [
						{
							title: '首页',
							path: '',
							name: 'home_index'
						},
						{
							title: currentPathObj.title,
							path: '',
							name: name
						},
						{
							title: cArr2[i].title,
							path: '',
							name: name
						}
					];
				}
			}
		}
    }
    vm.$store.commit('setCurrentPath', currentPathArr);
    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
				let cArr = item.children;
				for (let i = 0; i < cArr.length; i++) {
					if(cArr[i].children){
						let cArr2 = cArr[i].children;
						for(let j=0;j<cArr2.length;j++){
							if(name === cArr2[j].name){
								return true;
							}
						}
					}else{
						if(name === cArr[i].name){
							return true;
						}
					}
				}
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
			if(tag.children){
				let cArr = tag.children;
				for (let i = 0; i < cArr.length; i++) {
					if(cArr[i].children){
						let cArr2 = cArr[i].children;
						for(let j=0;j<cArr2.length;j++){
							if(name === cArr2[j].name){
								tag = cArr2[j];
								break;
							}
						}
					}else{
						if(name === cArr[i].name){
							tag = cArr[i];
							break;
						}
					}
				}
			}
			
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (semver.lt(packjson.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin更新啦',
                desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
            });
        }
    });
};

export default util;
