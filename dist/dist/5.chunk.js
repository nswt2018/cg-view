webpackJsonp([5],{

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_commonFieldDefinition_manage_vue__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_commonFieldDefinition_manage_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_commonFieldDefinition_manage_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_commonFieldDefinition_manage_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_commonFieldDefinition_manage_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_3569b1c9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_commonFieldDefinition_manage_vue__ = __webpack_require__(803);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_3569b1c9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_commonFieldDefinition_manage_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_3569b1c9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_commonFieldDefinition_manage_vue__);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(800)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_commonFieldDefinition_manage_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__babel_loader_node_modules_vue_loader_lib_template_compiler_index_id_data_v_3569b1c9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_commonFieldDefinition_manage_vue___default.a,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\system\\business\\dataDefinition\\commonField\\commonFieldDefinition-manage.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3569b1c9", Component.options)
  } else {
    hotAPI.reload("data-v-3569b1c9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var datetool = {};
datetool.format = function (d) {
	if (d) {
		var date = new Date(d);
		var m = date.getMonth() + 1;
		var r = date.getDate();
		return date.getFullYear() + '-' + (m >= 10 ? m : '0' + m) + '-' + (r >= 10 ? r : '0' + r);
	} else return "";
};

exports.default = datetool;

/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _iview = __webpack_require__(29);

var _iview2 = _interopRequireDefault(_iview);

var _util = __webpack_require__(10);

var _util2 = _interopRequireDefault(_util);

var _datetool = __webpack_require__(250);

var _datetool2 = _interopRequireDefault(_datetool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colDefinition = {};
var header = { 'Content-Type': 'application/json;charset=UTF-8' };
var DEL_SUC = '000002';
var SAV_SUC = '000001';
var UPD_SUC = '000003';
var spa = void 0;


colDefinition.setPage = function (obj) {
	this.spa = obj;
};

colDefinition.getColumns = function () {
	var _this2 = this;

	return [{
		type: 'selection',
		width: 60,
		align: 'center'
	}, {
		title: '字段名',
		key: 'colCode',
		width: 120,
		sortable: 'custom',
		align: 'center'
	}, {
		title: '中文名',
		key: 'colName',
		width: 120,
		align: 'center'
	}, {
		title: '字段类型',
		key: 'dataType',
		align: 'center'
	}, {
		title: '字段长度',
		key: 'dataLen',
		align: 'center'
	}, {
		title: '主键策略',
		key: 'pkGen',
		align: 'center',
		render: function render(h, params) {
			var _this = _this2;
			var texts = '';
			if (params.row.pkGen == 0) {
				texts = "0-手动录入";
			} else if (params.row.pkGen == 1) {
				texts = "1-自动生成";
			}
			return h('div', texts);
		}
	}, {
		title: '显示顺序',
		key: 'uiOrder',
		align: 'center'
	}];
};

colDefinition.delete = function (delurl) {
	var _this3 = this;

	if (this.spa.selectedLines < 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须选中一条记录！'
		});
	} else {
		this.spa.$Modal.confirm({
			title: '提示信息',
			content: '确认要删除选中的记录吗！',
			onOk: function onOk() {

				_util2.default.ajax.delete(delurl, header).then(function (rres) {
					if (rres.data.code === DEL_SUC) {
						_this3.spa.$Message.success('删除成功!');
						_this3.spa.deletedPks = [];
						_this3.spa.selectedLines = 0;
						_this3.spa.viewOrUpdateModel = {};
						_this3.page(_this3.spa.getSearchCond());
					} else {
						_this3.err(rres.data);
					}
				});
			},
			onCancel: function onCancel() {}
		});
	}
};

colDefinition.update = function (name) {
	var _this4 = this;

	this.spa.$refs[name].validate(function (valid) {
		if (valid) {
			_this4.spa.viewOrUpdateModel.crtDate = _datetool2.default.format(_this4.spa.viewOrUpdateModel.crtDate);
			_this4.spa.viewOrUpdateModel.updDate = _datetool2.default.format(_this4.spa.viewOrUpdateModel.updDate);
			_util2.default.ajax.put(_this4.spa.updateurl, _this4.spa.viewOrUpdateModel, header).then(function (rres) {
				if (rres.data.code === UPD_SUC) {
					_this4.spa.$Message.success('修改成功!');
					_this4.spa.viewModal = false;
					_this4.page(_this4.spa.getSearchCond());
				} else {
					_this4.spa.$Modal.error({
						title: '错误信息',
						content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
					});
				}
			});
		} else {
			_this4.spa.$Message.error('修改失败!');
			_this4.spa.loading = false;
			_this4.spa.$nextTick(function () {
				_this4.spa.loading = true;
			});
		}
	});
};

colDefinition.page = function (data) {
	var _this5 = this;

	_util2.default.ajax.post(this.spa.listurl, data, header).then(function (rres) {
		if (rres && rres.data && !rres.data.pageSize) {
			_this5.spa.$Modal.error({
				title: '提示',
				content: rres.data.msg
			});

			return;
		}
		if (rres.data.pageSize) {
			_this5.spa.list_data = rres.data.rows;
			_this5.spa.totalPage = rres.data.totalPage;
			_this5.spa.totalCount = rres.data.totalCount;
			_this5.spa.pageSize = rres.data.pageSize;

			_this5.spa.deletedPks = [];
			_this5.spa.selectedLines = 0;
		} else {
			_this5.err(rres.data);
		}
	}).catch(function (err) {
		_this5.spa.$Modal.error({
			title: '出错啦',
			content: err
		});
	});
};

colDefinition.choice = function (selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewOrUpdateModel = row;
	if (row.uiOrder == null) {
		this.spa.viewOrUpdateModel.uiOrder = '';
	}

	this.spa.deletedPks.push(row.colCode + "/" + this.spa.sTabCode);
};

colDefinition.cancel = function (selection, row) {
	this.spa.selectedLines = selection.length;

	if (this.spa.selectedLines > 0) {
		this.spa.viewOrUpdateModel = selection[0];
		this.spa.deletedPks.splice(this.spa.deletedPks.indexOf(row.colCode + "/" + this.spa.sTabCode), 1);
	} else {
		this.spa.viewOrUpdateModel = {};
		this.spa.deletedPks = [];
	}
};

colDefinition.save = function (name) {
	var _this6 = this;

	this.spa.$refs[name].validate(function (valid) {
		if (valid) {
			_util2.default.ajax.put(_this6.spa.saveurl, _this6.spa.addModel, header).then(function (rres) {
				if (rres.data.code === SAV_SUC || rres.data.code === UPD_SUC) {
					_this6.spa.$Message.success('Success!');
					_this6.spa.addModal = false;
					_this6.page(_this6.spa.getSearchCond());
				} else {
					_this6.spa.$Modal.error({
						title: '错误信息',
						content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
					});
				}k;
			});
		} else {
			_this6.spa.$Message.error('Fail!');
			_this6.spa.loading = false;
			_this6.spa.$nextTick(function () {
				_this6.spa.loading = true;
			});
		}
	});
};

colDefinition.findTable = function (params) {
	var _this7 = this;

	_util2.default.ajax.put('/business/TK0008L1.do', params, header).then(function (rres) {
		if (rres.data.code === SAV_SUC || rres.data.code === UPD_SUC) {
			_this7.spa.exist = false;
		} else {
			_this7.spa.exist = true;
		}
	});
};

colDefinition.getTabList = function (url) {
	var _this8 = this;

	_util2.default.ajax.post(url, header).then(function (rres) {
		var result = [];
		rres.data.forEach(function (d) {
			var tab = {
				value: d.split('/')[0],
				label: d
			};

			result.push(tab);
		});

		_this8.spa.tabList = result;
	});
};

colDefinition.getColList = function (url, params) {
	var _this9 = this;

	_util2.default.ajax.post(url, params, header).then(function (rres) {
		var result = [];
		rres.data.forEach(function (d) {
			var tab = {
				value: d,
				label: d
			};

			result.push(tab);
		});

		_this9.spa.colList = result;
	});
};

colDefinition.getDoMainList = function (url, params) {
	var _this10 = this;

	_util2.default.ajax.post(url, params, header).then(function (rres) {
		var result = [];
		rres.data.forEach(function (d) {
			var data = d.split(',');
			var tab = {
				value: data[1] + ',' + data[2],
				label: data[0]
			};

			result.push(tab);
		});

		_this10.spa.dmList = result;
	});
};

exports.default = colDefinition;

/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = __webpack_require__(10);

var _util2 = _interopRequireDefault(_util);

var _jsCookie = __webpack_require__(5);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _datetool = __webpack_require__(250);

var _datetool2 = _interopRequireDefault(_datetool);

var _mspagepublictool = __webpack_require__(342);

var _mspagepublictool2 = _interopRequireDefault(_mspagepublictool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pagepublictool = {};
var spa = void 0;
var header = { 'Content-Type': 'application/json;charset=UTF-8' };

pagepublictool.setPage = function (obj) {
	this.spa = obj;
};

pagepublictool.page = function (data) {
	var _this = this;

	_util2.default.ajax.post(this.spa.listurl, data, header).then(function (rres) {
		if (rres && rres.data) {
			_this.spa.data_list = rres.data.rows;
			_this.spa.totalCount = rres.data.totalCount;

			_this.spa.deleteKey = [];
			_this.spa.selectedLines = 0;
		} else {
			_this.spa.$Modal.error({
				title: '提示',
				content: rres.data.msg
			});
			return;
		}
	}).catch(function (err) {
		pagepublictool.err(err);
	});
};
pagepublictool.view = function () {
	if (this.spa.selectedLines != 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须且只能选中一条记录！'
		});
	} else {
		this.spa.viewModal = true;
	}
};
pagepublictool.add = function () {
	this.spa.addModal = true;
};
pagepublictool.update = function () {
	if (this.spa.selectedLines != 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须且只能选中一条记录！'
		});
	} else {
		this.spa.updModal = true;
	}
};
pagepublictool.delete = function (delurl) {
	var _this2 = this;

	if (this.spa.selectedLines < 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须选中一条记录！'
		});
	} else {
		this.spa.$Modal.confirm({
			title: '确认信息',
			content: '确认要删除吗！',
			onOk: function onOk() {
				_util2.default.ajax.delete(delurl, header).then(function (rres) {
					if (rres.data.code === '000002') {
						_this2.spa.$Message.success('删除成功!');
						_this2.spa.selectedLines = 0;
						_this2.spa.viewForm = {};
						_this2.spa.updForm = {};
						_this2.spa.deleteKey = [];
						pagepublictool.page(_this2.spa.getSearch());
					} else {
						_this2.spa.$Modal.error({
							title: '错误信息',
							content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
						});
					}
				}).catch(function (err) {
					pagepublictool.err(err);
				});
			}
		});
	}
};
pagepublictool.mdelete = function (delurl) {
	var _this3 = this;

	if (this.spa.selectedLines < 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须选中一条记录！'
		});
	} else {
		this.spa.$Modal.confirm({
			title: '确认信息',
			content: '确认要删除吗！',
			onOk: function onOk() {
				_util2.default.ajax.delete(delurl, header).then(function (rres) {
					if (rres.data.code === '000002') {
						_this3.spa.$Message.success('主表删除成功!');
						_this3.spa.selectedLines = 0;
						_this3.spa.viewForm = {};
						_this3.spa.updForm = {};
						_this3.spa.deleteKey = [];
						pagepublictool.page(_this3.spa.getSearch());
						pagepublictool.sdelete(_this3.spa.reledeleteurl + "?delFields=" + _this3.spa.msRelationshipFields.join(','));
					} else {
						_this3.spa.$Modal.error({
							title: '错误信息',
							content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
						});
					}
				}).catch(function (err) {
					pagepublictool.err(err);
				});
			}
		});
	}
};
pagepublictool.sdelete = function (delurl) {
	var _this4 = this;

	_util2.default.ajax.delete(delurl, header).then(function (rres) {
		if (rres.data.code === '000002') {
			_this4.spa.$Message.success('从表删除成功!');
			_this4.spa.msselectedLines = 0;
			_this4.spa.msviewForm = {};
			_this4.spa.msupdForm = {};
			_this4.spa.msdeleteKey = [];
			_this4.spa.msRelationshipFields = [];
			_mspagepublictool2.default.page(_this4.spa.getMsSearch());
		} else {
			_this4.spa.$Modal.error({
				title: '错误信息',
				content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
			});
		}
	}).catch(function (err) {
		pagepublictool.err(err);
	});
};
pagepublictool.save = function (refValue) {
	var _this5 = this;

	this.spa.$refs[refValue].validate(function (valid) {
		if (valid) {
			var data = void 0;
			var url = void 0;
			if (refValue === 'addFormRef') {
				data = _this5.spa.addForm;
				url = _this5.spa.saveurl;
			} else {
				data = _this5.spa.updForm;
				url = _this5.spa.updateurl;
			}
			_util2.default.ajax.put(url, data, header).then(function (rres) {
				if (rres.data.code === '000001' || rres.data.code === '000003') {
					_this5.spa.$Message.success('Success!');
					_this5.spa.addModal = false;
					_this5.spa.updModal = false;
					_this5.spa.addForm = {};
					pagepublictool.page(_this5.spa.getSearch());
				} else {
					_this5.spa.loading = false;
					_this5.spa.$Modal.error({
						title: '错误信息',
						content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
					});
				}
			}).catch(function (err) {
				_this5.spa.loading = false;
				pagepublictool.err(err);
			});
		} else {
			_this5.spa.$Message.error('Fail!');
			_this5.spa.addloading = false;
			_this5.spa.updloading = false;
			_this5.spa.$nextTick(function () {
				_this5.spa.addloading = true;
				_this5.spa.updloading = true;
			});
		}
	});
};
pagepublictool.msave = function (refValue) {
	var _this6 = this;

	this.spa.$refs[refValue].validate(function (valid) {
		if (valid) {
			var data = void 0;
			var url = void 0;
			if (refValue === 'addFormRef') {
				data = _this6.spa.addForm;
				url = _this6.spa.saveurl;
			} else {
				data = _this6.spa.updForm;
				url = _this6.spa.updateurl;
			}
			_util2.default.ajax.put(url, data, header).then(function (rres) {
				if (rres.data.code === '000001' || rres.data.code === '000003') {
					_this6.spa.$Message.success('Success!');
					_this6.spa.addModal = false;
					_this6.spa.updModal = false;
					_this6.spa.addForm = {};
					pagepublictool.page(_this6.spa.getSearch());
					if (refValue === 'updFormRef') {
						pagepublictool.ssave(_this6.spa.releupdateurl + "?updFields=" + _this6.spa.msRelationshipFields.join(','));
					}
					_this6.spa.msRelationshipFields = [];
					_mspagepublictool2.default.page(_this6.spa.getMsSearch());
				} else {
					_this6.spa.loading = false;
					_this6.spa.$Modal.error({
						title: '错误信息',
						content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
					});
				}
			}).catch(function (err) {
				_this6.spa.loading = false;
				pagepublictool.err(err);
			});
		} else {
			_this6.spa.$Message.error('Fail!');
			_this6.spa.addloading = false;
			_this6.spa.updloading = false;
			_this6.spa.$nextTick(function () {
				_this6.spa.addloading = true;
				_this6.spa.updloading = true;
			});
		}
	});
};
pagepublictool.ssave = function (updurl) {
	var _this7 = this;

	_util2.default.ajax.put(updurl, header).then(function (rres) {
		if (rres.data.code === '000001' || rres.data.code === '000003') {
			_this7.spa.$Message.success('从表修改成功!');
			_mspagepublictool2.default.page(_this7.spa.getMsSearch());
		} else {
			_this7.spa.loading = false;
			_this7.spa.$Modal.error({
				title: '错误信息',
				content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
			});
		}
	}).catch(function (err) {
		pagepublictool.err(err);
	});
};
pagepublictool.reset = function (ref) {
	this.spa.$refs[ref].resetFields();
};
pagepublictool.choice = function (selection, row) {
	this.spa.selectedLines = selection.length;
	this.spa.viewForm = row;
	this.spa.updForm = row;
};
pagepublictool.cancel = function (selection, row) {
	this.spa.selectedLines = selection.length;
	if (this.spa.selectedLines > 0) {
		this.spa.viewForm = selection[0];
		this.spa.updForm = selection[0];
	} else {
		this.spa.viewForm = {};
		this.spa.updForm = {};
		this.spa.deleteKey = [];
	}
};
pagepublictool.getButtons = function () {
	var _this8 = this;

	var menucode = "1001";
	if (!menucode) {
		this.spa.$Message.error('没有配置菜单权限!');
		return;
	}
	var allButtonRights = _jsCookie2.default.get("allButtonRights");
	if (!allButtonRights) {
		_util2.default.ajax.post("/system/SY0005L2.do", {}, header).then(function (rres) {
			if (rres.data) {
				_jsCookie2.default.set("allButtonRights", allButtonRights = rres.data);
				pagepublictool.doButtonExt(allButtonRights[menucode]);
			} else {
				_this8.spa.$Message.error('从服务器端获取功能按钮权限出错!');
				return;
			}
		});
	} else {
		pagepublictool.doButtonExt(JSON.parse(allButtonRights)[menucode]);
	}
};

pagepublictool.doButtonExt = function (thisMenuButtons) {
	if (!thisMenuButtons) {
		this.spa.$Message.error('没有取到相应的功能按钮权限!');
		return;
	}
	this.spa.buttonInfos = thisMenuButtons;
};
pagepublictool.getSizeValue = function () {
	var sizeValue = _jsCookie2.default.get("sizeValue");
	var size = this.$store.state.app.sizeFont;
	if (!sizeValue) {
		return size;
	} else {
		return sizeValue;
	}
};
pagepublictool.err = function (err) {
	this.spa.$Modal.error({
		title: '出错啦',
		content: err
	});
};

exports.default = pagepublictool;

/***/ }),

/***/ 342:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _util = __webpack_require__(10);

var _util2 = _interopRequireDefault(_util);

var _jsCookie = __webpack_require__(5);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _datetool = __webpack_require__(250);

var _datetool2 = _interopRequireDefault(_datetool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mspagepublictool = {};
var spa = void 0;
var header = { 'Content-Type': 'application/json;charset=UTF-8' };

mspagepublictool.setPage = function (obj) {
	this.spa = obj;
};

mspagepublictool.page = function (data) {
	var _this = this;

	_util2.default.ajax.post(this.spa.mslisturl, data, header).then(function (rres) {
		if (rres && rres.data) {
			_this.spa.msdata_list = rres.data.rows;
			_this.spa.mstotalCount = rres.data.totalCount;
		} else {
			_this.spa.$Modal.error({
				title: '提示',
				content: rres.data.msg
			});
			return;
		}
	}).catch(function (err) {
		mspagepublictool.err(err);
	});
};
mspagepublictool.view = function () {
	if (this.spa.msselectedLines != 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须且只能选中一条记录！'
		});
	} else {
		this.spa.msviewModal = true;
	}
};
mspagepublictool.add = function () {
	if (this.spa.selectedLines != 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须选中一条主表记录！'
		});
	} else {
		this.spa.msaddModal = true;
	}
};
mspagepublictool.update = function () {
	if (this.spa.msselectedLines != 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须选中一条记录！'
		});
	} else {
		this.spa.msupdModal = true;
	}
};
mspagepublictool.delete = function (delurl) {
	var _this2 = this;

	if (this.spa.msselectedLines < 1) {
		this.spa.$Modal.warning({
			title: '提示信息',
			content: '必须选中一条记录！'
		});
	} else {
		this.spa.$Modal.confirm({
			title: '确认信息',
			content: '确认要删除吗！',
			onOk: function onOk() {
				_util2.default.ajax.delete(delurl, header).then(function (rres) {
					if (rres.data.code === '000002') {
						_this2.spa.$Message.success('删除成功!');
						_this2.spa.msselectedLines = 0;
						_this2.spa.msviewForm = {};
						_this2.spa.msupdForm = {};
						_this2.spa.msdeleteKey = [];
						mspagepublictool.page(_this2.spa.getMsSearch());
					} else {
						_this2.spa.$Modal.error({
							title: '错误信息',
							content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
						});
					}
				}).catch(function (err) {
					mspagepublictool.err(err);
				});
			}
		});
	}
};
mspagepublictool.save = function (refValue) {
	var _this3 = this;

	this.spa.$refs[refValue].validate(function (valid) {
		if (valid) {
			var data = void 0;
			var url = void 0;
			if (refValue === 'msaddFormRef') {
				data = _this3.spa.msaddForm;
				url = _this3.spa.mssaveurl;
			} else {
				data = _this3.spa.msupdForm;
				url = _this3.spa.msupdateurl;
			}
			_util2.default.ajax.put(url, data, header).then(function (rres) {
				if (rres.data.code === '000001' || rres.data.code === '000003') {
					_this3.spa.$Message.success('Success!');
					_this3.spa.msaddModal = false;
					_this3.spa.msupdModal = false;
					mspagepublictool.page(_this3.spa.getMsSearch());
				} else {
					_this3.spa.msloading = false;
					_this3.spa.$Modal.error({
						title: '错误信息',
						content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
					});
				}
			}).catch(function (err) {
				_this3.spa.msloading = false;
				mspagepublictool.err(err);
			});
		} else {
			_this3.spa.$Message.error('Fail!');
			_this3.spa.msaddloading = false;
			_this3.spa.msupdloading = false;
			_this3.spa.$nextTick(function () {
				_this3.spa.msaddloading = true;
				_this3.spa.msupdloading = true;
			});
		}
	});
};
mspagepublictool.reset = function (ref) {
	this.$refs[ref].resetFields();
};
mspagepublictool.choice = function (selection, row) {
	this.spa.msselectedLines = selection.length;
	this.spa.msviewForm = row;
	this.spa.msupdForm = row;
};
mspagepublictool.cancel = function (selection, row) {
	this.spa.msselectedLines = selection.length;
	if (this.spa.msselectedLines > 0) {
		this.spa.msviewForm = selection[0];
		this.spa.msupdForm = selection[0];
	} else {
		this.spa.msviewForm = {};
		this.spa.msupdForm = {};
		this.spa.msdeleteKey = [];
	}
};
mspagepublictool.getButtons = function () {
	var _this4 = this;

	var menucode = "1001";
	if (!menucode) {
		this.spa.$Message.error('没有配置菜单权限!');
		return;
	}
	var allButtonRights = _jsCookie2.default.get("allButtonRights");
	if (!allButtonRights) {
		_util2.default.ajax.post("/system/SY0005L2.do", {}, header).then(function (rres) {
			if (rres.data) {
				_jsCookie2.default.set("allButtonRights", allButtonRights = rres.data);
				pagepublictool.doButtonExt(allButtonRights[menucode]);
			} else {
				_this4.spa.$Message.error('从服务器端获取功能按钮权限出错!');
				return;
			}
		});
	} else {
		pagepublictool.doButtonExt(JSON.parse(allButtonRights)[menucode]);
	}
};

mspagepublictool.doButtonExt = function (thisMenuButtons) {
	if (!thisMenuButtons) {
		this.spa.$Message.error('没有取到相应的功能按钮权限!');
		return;
	}
	this.spa.buttonInfos = thisMenuButtons;
};
mspagepublictool.err = function (err) {
	this.spa.$Modal.error({
		title: '出错啦',
		content: err
	});
};

exports.default = mspagepublictool;

/***/ }),

/***/ 436:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _datetool = __webpack_require__(250);

var _datetool2 = _interopRequireDefault(_datetool);

var _pagepublictool = __webpack_require__(341);

var _pagepublictool2 = _interopRequireDefault(_pagepublictool);

var _jsCookie = __webpack_require__(5);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _commonFieldDefinitionColumn = __webpack_require__(802);

var _commonFieldDefinitionColumn2 = _interopRequireDefault(_commonFieldDefinitionColumn);

var _colDefinition_column = __webpack_require__(340);

var _colDefinition_column2 = _interopRequireDefault(_colDefinition_column);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	name: 'commonfield-info',
	data: function data() {
		var _this = this;

		var validateDataLen = function validateDataLen(rule, value, callback) {
			var self = _this;
			var dataType = void 0;
			var dataLen = void 0;
			if (self.addModal) {
				dataType = _this.addForm.dataType;
				dataLen = _this.addForm.dataLen != null ? _this.addForm.dataLen.replace(/^\s+|\s+$/g, '') : '';
			} else if (self.viewModal) {
				dataType = _this.updForm.dataType;
				dataLen = _this.updForm.dataLen != null ? _this.updForm.dataLen.replace(/^\s+|\s+$/g, '') : '';
			} else {
				callback();
			}

			if ((dataType === 'decimal' || dataType === 'char' || dataType === 'varchar') && !value) {
				return callback(new Error("字段长度不能为空！"));
			} else if ((dataType === 'int' || dataType === 'date' || dataType === 'datetime') && value) {
				return callback(new Error("int/date/datetime类型字段长度默认,不必输入！"));
			} else {
				callback();
			}
		};

		var validateDataType = function validateDataType(rule, value, callback) {
			var self = _this;
			if (self.addModal || self.viewModal) {
				if (!value) {
					return callback(new Error(rule.message));
				} else {
					callback();
				}
			} else {
				callback();
			}
		};
		return {
			listurl: '/business/TK0009L.do',
			saveurl: '/business/TK0009I.do',
			deleteurl: '/business/TK0009D.do',
			updateurl: '/business/TK0009U.do',
			taburl: '/business/TK0004L1.do',
			colurl: '/business/TK0004L2.do',
			inserturl: '/business/TK0009I1.do',
			colName: '',
			colCode: '',
			viewModal: false,
			viewForm: {},
			addModal: false,
			addForm: {},
			addloading: true,
			updModal: false,
			updForm: {},
			updloading: true,
			selectedLines: 0,
			data_list: [],
			pageSize: 10,
			currentPage: 1,
			totalPage: 0,
			totalCount: 0,
			buttonInfos: [{
				title: '查看',
				code: '100101',
				icon: 'info',
				href: 'view'
			}, {
				title: '新增',
				code: '100102',
				icon: 'primary',
				href: 'add'
			}, {
				title: '修改',
				code: '100103',
				icon: 'success',
				href: 'upd'
			}, {
				title: '删除',
				code: '100104',
				icon: 'warning',
				href: 'del'
			}],
			columns: [],
			formRules: {
				colCode: [{ required: true, message: '字段名不能为空！', trigger: 'blur' }],
				colName: [{ required: true, message: '中文名称不能为空！', trigger: 'blur' }],
				dataType: [{ validator: validateDataType, message: '字段类型不能为空！', trigger: 'blur' }],
				dataLen: [{ validator: validateDataLen, trigger: 'blur' }]
			},
			deleteKey: [],
			dtList: [{
				value: 'char',
				label: 'char'
			}, {
				value: 'date',
				label: 'date'
			}, {
				value: 'datetime',
				label: 'datetime'
			}, {
				value: 'decimal',
				label: 'decimal'
			}, {
				value: 'int',
				label: 'int'
			}, {
				value: 'varchar',
				label: 'varchar'
			}],
			pkList: [{
				value: '0',
				label: '0-手动录入'
			}, {
				value: '1',
				label: '1-自动生成'
			}],
			utList: [{
				value: 'A1',
				label: '单行文本'
			}, {
				value: 'A2',
				label: '多行文本'
			}, {
				value: 'B1',
				label: '单选按钮'
			}, {
				value: 'B2',
				label: '多选按钮'
			}, {
				value: 'B3',
				label: '下拉框带搜索单选'
			}, {
				value: 'B4',
				label: '下拉框带搜索多选'
			}, {
				value: 'B5',
				label: '弹出框单选'
			}, {
				value: 'C1',
				label: '日期框'
			}, {
				value: 'D1',
				label: '数字框'
			}],
			tabList: [],
			colList: []
		};
	},

	methods: {
		getSearch: function getSearch() {
			var menuCode = _jsCookie2.default.get('menucode');
			return { 'menuCode': menuCode, 'pageSize': this.pageSize, 'currentPage': this.currentPage,
				'valObj': { 'colName': this.colName, 'colCode': this.colCode } };
		},
		init: function init() {
			_pagepublictool2.default.setPage(this);
			_pagepublictool2.default.page(this.getSearch());
			_commonFieldDefinitionColumn2.default.setPage(this);
			this.columns = _commonFieldDefinitionColumn2.default.getColumns();

			_colDefinition_column2.default.setPage(this);
			_colDefinition_column2.default.getTabList(this.taburl);
		},
		searching: function searching() {
			_pagepublictool2.default.page(this.getSearch());
		},
		onClicking: function onClicking(type) {
			if (type === 'VIEW' || type === 'view') _pagepublictool2.default.view();else if (type === 'ADD' || type === 'add') this.add();else if (type === 'UPD' || type === 'upd') this.update();else if (type === 'DEL' || type === 'del') _pagepublictool2.default.delete(this.deleteurl + "?delKeys=" + this.deleteKey.join(','));
		},
		saving: function saving(refValue) {
			if (refValue === 'addFormRef') {
				if (this.addForm.joinColCodes && this.addForm.joinColCodes.length > 0) this.addForm.joinColCode = this.addForm.joinColCodes.join(',');
			} else {
				if (this.updForm.joinColCodes && this.updForm.joinColCodes.length > 0) this.updForm.joinColCode = this.updForm.joinColCodes.join(',');
			}
			_pagepublictool2.default.save(refValue);
		},
		reseting: function reseting(refValue) {
			this.addModal = false;
		},
		choicing: function choicing(selection, row) {
			_pagepublictool2.default.choice(selection, row);
			this.deleteKey.push(row.colCode);
		},
		cancing: function cancing(selection, row) {
			_pagepublictool2.default.cancel(selection, row);
			if (this.selectedLines > 0) {
				this.deleteKey.splice(this.deleteKey.indexOf(row.colCode), 1);
			}
		},
		choicingAll: function choicingAll(selection) {
			this.selectedLines = selection.length;
			this.deleteKey = [];
			for (var i = 0; i < this.selectedLines; i++) {
				this.deleteKey.push(selection[i].colCode);
			}
		},
		cancingAll: function cancingAll(selection) {
			this.selectedLines = selection.length;
			if (this.selectedLines == 0) {
				this.deleteKey = [];
			}
		},
		changePage: function changePage(page) {
			var cond = this.getSearch();
			cond.currentPage = page;
			_pagepublictool2.default.page(cond);
		},
		changePageSize: function changePageSize(_pageSize) {
			var cond = this.getSearch();
			cond.pageSize = _pageSize;
			_pagepublictool2.default.page(cond);
		},
		dataTypeChage: function dataTypeChage(flag) {
			var dataType = void 0;
			if (flag === 'A') {
				dataType = this.addForm.dataType;

				if (dataType === 'char' || dataType === 'varchar') this.addForm.uiType = 'A1';else if (dataType === 'date' || dataType === 'datetime') this.addForm.uiType = 'C1';else if (dataType === 'int' || dataType === 'decimal') this.addForm.uiType = 'D1';else this.addForm.uiType = '';
			} else {
				dataType = this.updForm.dataType;

				if (dataType === 'char' || dataType === 'varchar') this.updForm.uiType = 'A1';else if (dataType === 'date' || dataType === 'datetime') this.updForm.uiType = 'C1';else if (dataType === 'int' || dataType === 'decimal') this.updForm.uiType = 'D1';else this.updForm.uiType = '';
			}
		},
		tabCodeChage: function tabCodeChage(flag) {

			var params = new URLSearchParams();

			if (flag === 'A') {
				this.$refs.addFormColList.clearSingleSelect();
				params.append('tabCode', this.addForm.joinTabCode);
			} else {
				this.$refs.updFormColList.clearSingleSelect();
				params.append('tabCode', this.updForm.joinTabCode);
			}

			_colDefinition_column2.default.getColList(this.colurl, params);
		},
		add: function add() {
			this.addForm = {};
			_pagepublictool2.default.reset('addFormRef');
			this.$refs.dtselect.clearSingleSelect();

			_pagepublictool2.default.add();
		},
		update: function update() {
			var params = new URLSearchParams();
			params.append('tabCode', this.updForm.joinTabCode);

			_colDefinition_column2.default.getColList(this.colurl, params);

			if (this.updForm.joinColCode && this.updForm.joinColCode.length > 0) {
				this.updForm.joinColCodes = this.updForm.joinColCode.split(',');
			}
			_pagepublictool2.default.update();
		},
		handleInsert: function handleInsert() {
			if (this.selectedLines < 1) {
				this.$Modal.warning({
					title: '提示信息',
					content: '必须选中一条记录！'
				});

				return;
			}

			if (!this.$route.query.tabCode) {
				this.$Modal.warning({
					title: '提示信息',
					content: '请前往表定义页面点击选择按钮！'
				});

				return;
			}

			var params = new URLSearchParams();
			params.append('tabCode', this.$route.query.tabCode);
			params.append('colCode', this.deleteKey);

			_commonFieldDefinitionColumn2.default.insertCol(this.inserturl, params);
		}
	},
	created: function created() {
		this.init();
	},

	computed: {
		getSizeValue: function getSizeValue() {
			var sizeValue = _jsCookie2.default.get("sizeValue");
			var size = this.$store.state.app.sizeFont;

			if (!sizeValue) {
				return size;
			} else {
				return sizeValue;
			}
		}
	}
};

/***/ }),

/***/ 800:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(801);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(12)("65d34b68", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3569b1c9\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./commonFieldDefinition-manage.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3569b1c9\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./commonFieldDefinition-manage.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 801:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(false);
// imports


// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),

/***/ 802:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _iview = __webpack_require__(29);

var _iview2 = _interopRequireDefault(_iview);

var _util = __webpack_require__(10);

var _util2 = _interopRequireDefault(_util);

var _datetool = __webpack_require__(250);

var _datetool2 = _interopRequireDefault(_datetool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonfield = {};
var header = { 'Content-Type': 'application/json;charset=UTF-8' };
var spa = void 0;

commonfield.setPage = function (obj) {
	this.spa = obj;
};

commonfield.getColumns = function () {
	return [{
		type: 'selection',
		width: 60,
		align: 'center'
	}, {
		title: '字段英文名称',
		key: 'colCode',
		align: 'center'
	}, {
		title: '字段中文名称',
		key: 'colName',
		align: 'center'
	}, {
		title: '字段类型',
		key: 'dataType',
		align: 'center'
	}, {
		title: '字段长度',
		key: 'dataLen',
		align: 'center'
	}, {
		title: '展现形式',
		key: 'uiType',
		align: 'center'
	}, {
		title: '关联表',
		key: 'joinTabCode',
		align: 'center'
	}, {
		title: '关联字段',
		key: 'joinColCode',
		align: 'center'
	}, {
		title: '传递参数',
		key: 'joinWhere',
		align: 'center'
	}, {
		title: '值区间',
		key: 'valBetween',
		align: 'center'
	}];
};

commonfield.insertCol = function (url, params) {
	var _this = this;

	_util2.default.ajax.put(url, params, header).then(function (rres) {
		if (rres.data.code === '000001') {
			_this.spa.$Message.success('Success!');
			var query = { tabCode: params.get('tabCode') };
			_this.spa.$router.push({
				name: 'tabDefinition',
				query: query
			});
		} else {
			_this.spa.$Modal.error({
				title: '错误信息',
				content: rres.data.code + '\r\n' + rres.data.msg + '\r\n' + rres.data.excetion
			});
		}
	});
};

exports.default = commonfield;

/***/ }),

/***/ 803:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var render = function render() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", [_c("Row", [_c("Card", [_c("p", { attrs: { slot: "title" }, slot: "title" }, [_c("Icon", { attrs: { type: "compose" } }), _vm._v("报元定义")], 1), _vm._v(" "), _c("Row", [_c("p", [_c("Input", {
    staticStyle: { width: "200px" },
    attrs: {
      type: "text",
      placeholder: "请输入字段中文名称",
      icon: "search"
    },
    on: { "on-change": _vm.searching },
    model: {
      value: _vm.colName,
      callback: function callback($$v) {
        _vm.colName = $$v;
      },
      expression: "colName"
    }
  }), _vm._v(" "), _c("Input", {
    staticStyle: { width: "200px" },
    attrs: {
      type: "text",
      placeholder: "请输入字段英文名称",
      icon: "search"
    },
    on: { "on-change": _vm.searching },
    model: {
      value: _vm.colCode,
      callback: function callback($$v) {
        _vm.colCode = $$v;
      },
      expression: "colCode"
    }
  }), _vm._v(" "), _vm._l(_vm.buttonInfos, function (item, index) {
    return _c("Button", {
      key: item.code,
      staticStyle: { margin: "2px" },
      attrs: { type: item.icon, size: _vm.getSizeValue },
      on: {
        click: function click($event) {
          _vm.onClicking(item.href);
        }
      }
    }, [_vm._v(_vm._s(item.title) + "\n\t\t\t\t\t")]);
  }), _vm._v(" "), _c("Button", {
    attrs: { type: "info", size: _vm.getSizeValue },
    on: {
      click: function click($event) {
        _vm.handleInsert();
      }
    }
  }, [_vm._v("插入")])], 2)]), _vm._v(" "), _c("Row", [_c("Table", {
    attrs: {
      columns: _vm.columns,
      data: _vm.data_list,
      height: "410",
      "highlight-row": "",
      border: "",
      size: _vm.getSizeValue,
      stripe: true
    },
    on: {
      "on-select": _vm.choicing,
      "on-select-cancel": _vm.cancing,
      "on-select-all": _vm.choicingAll,
      "on-selection-change": _vm.cancingAll
    }
  }), _vm._v(" "), _c("div", { staticStyle: { float: "right" } }, [_c("Page", {
    attrs: {
      total: _vm.totalCount,
      current: 1,
      "page-size": _vm.pageSize,
      transfer: true,
      "show-total": "",
      "show-elevator": "",
      "show-sizer": ""
    },
    on: {
      "on-change": _vm.changePage,
      "on-page-size-change": _vm.changePageSize
    }
  })], 1)], 1)], 1)], 1), _vm._v(" "), _c("Modal", {
    attrs: { title: "字段查看", width: "700" },
    model: {
      value: _vm.viewModal,
      callback: function callback($$v) {
        _vm.viewModal = $$v;
      },
      expression: "viewModal"
    }
  }, [_c("Form", {
    ref: "viewFormRef",
    attrs: { model: _vm.viewForm, "label-width": 100, inline: "" }
  }, [_c("FormItem", { attrs: { label: "字段名", prop: "colCode" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.colCode,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "colCode", $$v);
      },
      expression: "viewForm.colCode"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "中文名称", prop: "colName" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.colName,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "colName", $$v);
      },
      expression: "viewForm.colName"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "字段类型", prop: "dataType" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.dataType,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "dataType", $$v);
      },
      expression: "viewForm.dataType"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "字段长度", prop: "dataLen" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.dataLen,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "dataLen", $$v);
      },
      expression: "viewForm.dataLen"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "显示类型", prop: "uiType" } }, [_c("Select", {
    staticStyle: { width: "170px" },
    attrs: { readonly: "" },
    model: {
      value: _vm.viewForm.uiType,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "uiType", $$v);
      },
      expression: "viewForm.uiType"
    }
  }, _vm._l(_vm.utList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("br"), _vm._v(" "), _c("FormItem", { attrs: { label: "关联表", prop: "joinTabCode" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.joinTabCode,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "joinTabCode", $$v);
      },
      expression: "viewForm.joinTabCode"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "关联字段", prop: "joinColCode" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.joinColCode,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "joinColCode", $$v);
      },
      expression: "viewForm.joinColCode"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "传递参数", prop: "joinWhere" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.joinWhere,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "joinWhere", $$v);
      },
      expression: "viewForm.joinWhere"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "值区间", prop: "valBetween" } }, [_c("Input", {
    attrs: { readonly: true },
    model: {
      value: _vm.viewForm.valBetween,
      callback: function callback($$v) {
        _vm.$set(_vm.viewForm, "valBetween", $$v);
      },
      expression: "viewForm.valBetween"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("Modal", {
    attrs: {
      title: "字段新增",
      width: "700",
      "ok-text": "保存",
      "cancel-text": "关闭",
      loading: _vm.addloading,
      "mask-closable": false
    },
    on: {
      "on-ok": function onOk($event) {
        _vm.saving("addFormRef");
      },
      "on-cancel": function onCancel($event) {
        _vm.reseting("addFormRef");
      }
    },
    model: {
      value: _vm.addModal,
      callback: function callback($$v) {
        _vm.addModal = $$v;
      },
      expression: "addModal"
    }
  }, [_c("Form", {
    ref: "addFormRef",
    attrs: {
      model: _vm.addForm,
      rules: _vm.formRules,
      "label-width": 100,
      inline: ""
    }
  }, [_c("FormItem", { attrs: { label: "字段名", prop: "colCode" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    attrs: { placeholder: "请输入字段英文名称" },
    model: {
      value: _vm.addForm.colCode,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "colCode", $$v);
      },
      expression: "addForm.colCode"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "中文名称", prop: "colName" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    attrs: { placeholder: "请输入字段中文名称" },
    model: {
      value: _vm.addForm.colName,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "colName", $$v);
      },
      expression: "addForm.colName"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "字段类型", prop: "dataType" } }, [_c("Select", {
    ref: "dtselect",
    staticStyle: { width: "170px" },
    attrs: { clearable: "" },
    on: {
      "on-change": function onChange($event) {
        _vm.dataTypeChage("A");
      }
    },
    model: {
      value: _vm.addForm.dataType,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "dataType", $$v);
      },
      expression: "addForm.dataType"
    }
  }, _vm._l(_vm.dtList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "字段长度", prop: "dataLen" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    model: {
      value: _vm.addForm.dataLen,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "dataLen", $$v);
      },
      expression: "addForm.dataLen"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "显示类型", prop: "uiType" } }, [_c("Select", {
    staticStyle: { width: "170px" },
    model: {
      value: _vm.addForm.uiType,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "uiType", $$v);
      },
      expression: "addForm.uiType"
    }
  }, _vm._l(_vm.utList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("br"), _vm._v(" "), _c("FormItem", { attrs: { label: "关联表", prop: "joinTabCode" } }, [_c("Select", {
    staticStyle: { width: "455px" },
    attrs: { clearable: "" },
    on: {
      "on-change": function onChange($event) {
        _vm.tabCodeChage("A");
      }
    },
    model: {
      value: _vm.addForm.joinTabCode,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "joinTabCode", $$v);
      },
      expression: "addForm.joinTabCode"
    }
  }, _vm._l(_vm.tabList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "关联字段", prop: "joinColCodes" } }, [_c("Select", {
    ref: "addFormColList",
    staticStyle: { width: "455px" },
    attrs: { multiple: true, clearable: "" },
    model: {
      value: _vm.addForm.joinColCodes,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "joinColCodes", $$v);
      },
      expression: "addForm.joinColCodes"
    }
  }, _vm._l(_vm.colList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "传递参数", prop: "joinWhere" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    model: {
      value: _vm.addForm.joinWhere,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "joinWhere", $$v);
      },
      expression: "addForm.joinWhere"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "值区间", prop: "valBetween" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    model: {
      value: _vm.addForm.valBetween,
      callback: function callback($$v) {
        _vm.$set(_vm.addForm, "valBetween", $$v);
      },
      expression: "addForm.valBetween"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("Modal", {
    attrs: {
      title: "字段修改",
      width: "700",
      "ok-text": "保存",
      "cancel-text": "关闭",
      loading: _vm.updloading,
      "mask-closable": false
    },
    on: {
      "on-ok": function onOk($event) {
        _vm.saving("updFormRef");
      }
    },
    model: {
      value: _vm.updModal,
      callback: function callback($$v) {
        _vm.updModal = $$v;
      },
      expression: "updModal"
    }
  }, [_c("Form", {
    ref: "updFormRef",
    attrs: {
      model: _vm.updForm,
      rules: _vm.formRules,
      "label-width": 100,
      inline: ""
    }
  }, [_c("FormItem", { attrs: { label: "字段名", prop: "colCode" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    attrs: { placeholder: "请输入字段英文名称", disabled: "" },
    model: {
      value: _vm.updForm.colCode,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "colCode", $$v);
      },
      expression: "updForm.colCode"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "中文名称", prop: "colName" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    attrs: { placeholder: "请输入字段中文名称" },
    model: {
      value: _vm.updForm.colName,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "colName", $$v);
      },
      expression: "updForm.colName"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "字段类型", prop: "dataType" } }, [_c("Select", {
    staticStyle: { width: "170px" },
    attrs: { clearable: "" },
    on: {
      "on-change": function onChange($event) {
        _vm.dataTypeChage("U");
      }
    },
    model: {
      value: _vm.updForm.dataType,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "dataType", $$v);
      },
      expression: "updForm.dataType"
    }
  }, _vm._l(_vm.dtList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "字段长度", prop: "dataLen" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    model: {
      value: _vm.updForm.dataLen,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "dataLen", $$v);
      },
      expression: "updForm.dataLen"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "显示类型", prop: "uiType" } }, [_c("Select", {
    staticStyle: { width: "170px" },
    model: {
      value: _vm.updForm.uiType,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "uiType", $$v);
      },
      expression: "updForm.uiType"
    }
  }, _vm._l(_vm.utList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("br"), _vm._v(" "), _c("FormItem", { attrs: { label: "关联表", prop: "joinTabCode" } }, [_c("Select", {
    staticStyle: { width: "455px" },
    attrs: { clearable: "" },
    on: {
      "on-change": function onChange($event) {
        _vm.tabCodeChage("U");
      }
    },
    model: {
      value: _vm.updForm.joinTabCode,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "joinTabCode", $$v);
      },
      expression: "updForm.joinTabCode"
    }
  }, _vm._l(_vm.tabList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "关联字段", prop: "joinColCodes" } }, [_c("Select", {
    ref: "updFormColList",
    staticStyle: { width: "455px" },
    attrs: { multiple: true, clearable: "" },
    model: {
      value: _vm.updForm.joinColCodes,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "joinColCodes", $$v);
      },
      expression: "updForm.joinColCodes"
    }
  }, _vm._l(_vm.colList, function (item) {
    return _c("Option", { key: item.value, attrs: { value: item.value } }, [_vm._v("\n\t\t\t\t\t\t" + _vm._s(item.label) + "\n\t\t\t\t\t")]);
  }))], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "传递参数", prop: "joinWhere" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    model: {
      value: _vm.updForm.joinWhere,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "joinWhere", $$v);
      },
      expression: "updForm.joinWhere"
    }
  })], 1), _vm._v(" "), _c("FormItem", { attrs: { label: "值区间", prop: "valBetween" } }, [_c("Input", {
    staticStyle: { width: "auto" },
    model: {
      value: _vm.updForm.valBetween,
      callback: function callback($$v) {
        _vm.$set(_vm.updForm, "valBetween", $$v);
      },
      expression: "updForm.valBetween"
    }
  })], 1)], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;
var esExports = { render: render, staticRenderFns: staticRenderFns };
exports.default = esExports;

if (false) {
  module.hot.accept();
  if (module.hot.data) {
    require("vue-hot-reload-api").rerender("data-v-3569b1c9", esExports);
  }
}

/***/ })

});
//# sourceMappingURL=5.chunk.js.map