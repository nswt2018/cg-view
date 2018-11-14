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

    //去导航菜单二级页面或三级页面
    else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            var hasMenu;
            if (item.children.length <= 1) {
                hasMenu = item.children[0].name === name;
                return hasMenu;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    //如果是三级页面按钮，则在二级按钮数组中找不到这个按钮名称
                    //需要二级页面下可能出现三级子菜单的情况逻辑加入
                    if (childArr[i].name === name) {
                        hasMenu = true;
                        return hasMenu;
                    }
                    i++;
                }

                //如果一级，二级菜单下都没有此按钮名称，则遍历三级菜单
                if(!hasMenu){
                    for(let m=0;m<childArr.length;m++){
                        if(!childArr[m].children) continue;
                        let sonArr = childArr[m].children;
                        for(let n=0;n<sonArr.length;n++){
                            if(sonArr[n].name === name){
                                hasMenu = true;
                                return hasMenu;
                            }
                        }
                    }
                }
                return false;
            }
        })[0];
        
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
             //如果是三级页面按钮，则在二级按钮数组中找不到这个按钮名称
             //需要二级页面下可能出现三级子菜单的情况逻辑加入
            let childObj = currentPathObj.children.filter((child) => {
                return  child.name === name;
            })[0];

           // let thirdLevelObj =
           console.log(childObj)

           //二级页面
            if (childObj) {
                currentPathArr = [
                    {
                        title: '首页',
                        path: '/home',
                        name: 'home_index'
                    },
                    {
                        title: currentPathObj.title,
                        path: '',
                        name: currentPathObj.name
                    },
                    {
                        title: childObj.title,
                        path: currentPathObj.path + '/' + childObj.path,
                        name: name
                    }
                ];
            }

            //childobj为undefined，再从三级页面中遍历
            else {
                let thirdObj;
                let childObj = currentPathObj.children.filter((child) => {
                    let hasChildren;
                    hasChildren = child.name === name;
                    if (hasChildren) return hasChildren

                    if (child.children) {
                        let sonArr = child.children;
                        for (let n = 0; n < sonArr.length; n++) {
                            if (sonArr[n].name === name) {
                                thirdObj = sonArr[n];
                                hasChildren = true;
                                return hasChildren;
                            }
                        }
                    }
                    return hasChildren
                })[0];
 
                if(thirdObj && childObj){
                    currentPathArr = [
                        {
                            title: '首页',
                            path: '/home',
                            name: 'home_index'
                        },
                        {
                            title: currentPathObj.title,
                            path: '',
                            name: currentPathObj.name
                        },
                        {
                            title: childObj.title,
                            path: '',               //设为空是因为此二级菜单没有实际页面且用于面包屑组件显示，path为空的将不可单击
                            name: childObj.name
                        },
                        {
                            title: thirdObj.title,
                            path: currentPathObj.path + '/' + childObj.path + '/' + thirdObj.path,
                            name: thirdObj.name
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
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
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
