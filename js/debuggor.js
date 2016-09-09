/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _qrcode = __webpack_require__(1);

	var _qrcode2 = _interopRequireDefault(_qrcode);

	var _connector = __webpack_require__(8);

	var _connector2 = _interopRequireDefault(_connector);

	var _util = __webpack_require__(10);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 这个应该是要作为基类的
	 */
	var Debuggor = function () {

	    // 所有的调试器都具备这些东西
	    function Debuggor(options) {
	        _classCallCheck(this, Debuggor);

	        options = options || {};

	        var me = this;
	        options.logger = me.log.bind(me);
	        me.appId = options.appId;
	        me.debugUrl = options.durl;

	        me.qrcoder = new _qrcode2.default();
	        me.connector = new _connector2.default(options);
	        me.needQRCode = true;
	    }

	    _createClass(Debuggor, [{
	        key: 'init',
	        value: function init() {
	            var me = this;

	            // initialize once
	            if (me.inited) return;
	            me.inited = true;
	            me.connector.init();

	            ['fs:msg', 'fs:join', 'fs:leave'].forEach(function (item) {
	                document.addEventListener(item, me.onFSMessage.bind(me, item));
	            });
	        }
	    }, {
	        key: 'onFSMessage',
	        value: function onFSMessage(eventName, event) {
	            var me = this;

	            switch (eventName) {
	                case 'fs:msg':
	                    var data = event.detail || {};
	                    try {
	                        var func = new Function(data.msg);
	                        func();
	                    } catch (e) {
	                        me.log(e.name, e.message);
	                    }
	                    break;
	                case 'fs:join':
	                    var data = event.detail || {};
	                    me.log('客户端：' + data.clientId + '加入了房间：' + data.roomId + '，总连接数：' + data.clientCount);
	                    // 生成二维码链接
	                    me.qrcodeUrl = [me.debugUrl, '?fs_rid=' + data.roomId, '&fs_aid=' + (me.appId || '')].join('');
	                    // 如果当前有大于两个的客户端，说明二维码已经被扫描过，不用再出现了
	                    me.needQRCode = data.clientCount <= 1;
	                    break;
	                case 'fs:leave':
	                    var data = event.detail || {};
	                    me.log('客户端：' + data.clientId + '离开了房间：' + data.roomId + '，总连接数：' + data.clientCount);
	                    // 如果当前有大于两个的客户端，说明二维码已经被扫描过，不用再出现了
	                    me.needQRCode = data.clientCount <= 1;
	                    break;
	            }
	        }
	    }, {
	        key: 'log',
	        value: function log(msg, detail) {
	            debuggor.log(msg, detail);
	        }
	    }, {
	        key: 'send',
	        value: function send(msg) {
	            var me = this;
	            if (me.needQRCode) {
	                me.qrcoder.setContent(me.qrcodeUrl);
	                me.qrcoder.show();
	                return;
	            }
	            me.connector.send(msg);
	        }
	    }]);

	    return Debuggor;
	}();

	var debuggor = {};

	/**
	 * 对外暴露日志输出接口
	 * 
	 * @param {String} log message
	 * @param {Object} log data
	 */
	debuggor.log = function (msg, detail) {
	    console.log(msg, JSON.stringify(detail));
	};
	/**
	 * 初始化debuggor对外接口
	 * 
	 * @param {Object} optional config
	 */
	debuggor.init = function (options) {
	    if (debuggor.i) return;
	    options = options || {};
	    if (!options.roomId) {
	        // 如果配置参数没有指定房间号，则尝试从queryString里获取
	        options.roomId = util.getQueryParam('fs_rid');
	    }
	    if (!options.appId) {
	        // 如果配置参数没有指定应用ID，则尝试从queryString里获取
	        options.appId = util.getQueryParam('fs_aid');
	    }
	    if (!options.durl) {
	        // 如果配置参数没有指定应用ID，则默认使用debugger.html
	        options.durl = location.origin + '/debugger.html';
	    }

	    debuggor.config = options;
	    debuggor.i = new Debuggor(debuggor.config);
	    debuggor.i.init();
	};
	/**
	 * 发送消息
	 * 
	 * @param {String} msg
	 */
	debuggor.send = function (msg) {
	    if (debuggor.i) {
	        debuggor.i.send(msg);
	    }
	};

	window.debuggor = debuggor;

	var script = util.actualScript();
	if (script) {
	    var dataset = script.dataset;
	    debuggor.init({
	        ns: dataset.ns,
	        host: dataset.host,
	        durl: dataset.durl,
	        appId: dataset.appid,
	        roomId: dataset.rid
	    });
	}

	exports.default = debuggor;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _qrcode = __webpack_require__(2);

	var _qrcode2 = _interopRequireDefault(_qrcode);

	var _qrcode3 = __webpack_require__(6);

	var _qrcode4 = _interopRequireDefault(_qrcode3);

	var _jqueryQrcode = __webpack_require__(7);

	var _jqueryQrcode2 = _interopRequireDefault(_jqueryQrcode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var QRCode = function () {
	    function QRCode() {
	        _classCallCheck(this, QRCode);

	        var me = this;
	        me._body = document.createElement('div');
	        me._body.className = _qrcode2.default.className;
	        me._body.innerHTML = _qrcode4.default;

	        me._body.addEventListener('click', me.onClick.bind(me), false);
	    }

	    _createClass(QRCode, [{
	        key: 'onClick',
	        value: function onClick(e) {
	            var me = this;
	            var node = e.target;
	            if (node.dataset && node.dataset.action == 'close') {
	                me.hide();
	            }
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            var me = this;
	            document.body.appendChild(me._body);
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            var me = this;
	            document.body.removeChild(me._body);
	        }
	    }, {
	        key: 'setContent',
	        value: function setContent(content) {
	            var me = this;
	            var node = me._body.querySelector('.qr');
	            node.innerHTML = '';
	            $(node).qrcode({ text: content, background: "#fff" });
	        }
	    }]);

	    return QRCode;
	}();

	exports.default = QRCode;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?minimize!./qrcode.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?minimize!./qrcode.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".PDhaldmWxePpU24w-BSKm .m-mask{display:block;z-index:998;position:fixed;top:0;left:0;width:100%;height:100%;background:#000;opacity:.55}.PDhaldmWxePpU24w-BSKm .m-code{display:block;z-index:999;position:fixed;top:50%;left:50%;border-radius:2px;background-color:#fff;width:500px;margin-top:-190px;margin-left:-250px;font-family:Microsoft Yahei}.PDhaldmWxePpU24w-BSKm .m-code .hd{height:46px;line-height:46px;padding:0 20px;border-radius:2px 2px 0 0;background-color:#f4f7fd;color:#6c7a95;font-size:16px}.PDhaldmWxePpU24w-BSKm .m-code .hd .close{position:absolute;top:13px;right:10px;width:20px;height:20px;line-height:20px;cursor:pointer;text-align:center}.PDhaldmWxePpU24w-BSKm .m-code .bd .qr{width:200px;height:200px;margin:20px auto}.PDhaldmWxePpU24w-BSKm .m-code .qr img{display:block;width:100%;height:100%}.PDhaldmWxePpU24w-BSKm .m-code .bd .tip{margin-bottom:30px;text-align:center}.PDhaldmWxePpU24w-BSKm .m-code .tip .s{font-size:12px;color:#999}", ""]);

	// exports
	exports.locals = {
		"className": "PDhaldmWxePpU24w-BSKm"
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<div class=\"m-mask\">&nbsp;</div>\r\n<div class=\"m-code\">\r\n    <div class=\"hd\">\r\n        <span class=\"title\">扫描二维码</span>\r\n        <span class=\"close\" data-action=\"close\">×</span>\r\n    </div>\r\n    <div class=\"bd\">\r\n        <div class=\"qr\"><!--<img src=\"https://www.fxiaoke.com/static/img/index/wx-code.png?v=5.1.5\"/>--></div>\r\n        <div class=\"tip\">请用纷享客户端扫描二维码<br><span class=\"s\">手机连接成功后请关闭本窗口重新点击“运行”按钮</span></div>\r\n    </div>\r\n</div>";

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/* jQuery.qrcode 0.12.0 - http://larsjung.de/jquery-qrcode/ - uses //github.com/kazuhikoarase/qrcode-generator (MIT) */
	!function (r) {
	  "use strict";
	  function t(t, e, n, o) {
	    function i(r, t) {
	      return r -= o, t -= o, 0 > r || r >= u || 0 > t || t >= u ? !1 : a.isDark(r, t);
	    }var a = r(n, e);a.addData(t), a.make(), o = o || 0;var u = a.getModuleCount(),
	        f = a.getModuleCount() + 2 * o,
	        c = function c(r, t, e, n) {
	      var o = this.isDark,
	          i = 1 / f;this.isDark = function (a, u) {
	        var f = u * i,
	            c = a * i,
	            l = f + i,
	            g = c + i;return o(a, u) && (r > l || f > e || t > g || c > n);
	      };
	    };this.text = t, this.level = e, this.version = n, this.moduleCount = f, this.isDark = i, this.addBlank = c;
	  }function e(r, e, n, o, i) {
	    n = Math.max(1, n || 1), o = Math.min(40, o || 40);for (var a = n; o >= a; a += 1) {
	      try {
	        return new t(r, e, a, i);
	      } catch (u) {}
	    }
	  }function n(r, t, e) {
	    var n = e.size,
	        o = "bold " + e.mSize * n + "px " + e.fontname,
	        i = w("<canvas/>")[0].getContext("2d");i.font = o;var a = i.measureText(e.label).width,
	        u = e.mSize,
	        f = a / n,
	        c = (1 - f) * e.mPosX,
	        l = (1 - u) * e.mPosY,
	        g = c + f,
	        s = l + u,
	        h = .01;1 === e.mode ? r.addBlank(0, l - h, n, s + h) : r.addBlank(c - h, l - h, g + h, s + h), t.fillStyle = e.fontcolor, t.font = o, t.fillText(e.label, c * n, l * n + .75 * e.mSize * n);
	  }function o(r, t, e) {
	    var n = e.size,
	        o = e.image.naturalWidth || 1,
	        i = e.image.naturalHeight || 1,
	        a = e.mSize,
	        u = a * o / i,
	        f = (1 - u) * e.mPosX,
	        c = (1 - a) * e.mPosY,
	        l = f + u,
	        g = c + a,
	        s = .01;3 === e.mode ? r.addBlank(0, c - s, n, g + s) : r.addBlank(f - s, c - s, l + s, g + s), t.drawImage(e.image, f * n, c * n, u * n, a * n);
	  }function i(r, t, e) {
	    w(e.background).is("img") ? t.drawImage(e.background, 0, 0, e.size, e.size) : e.background && (t.fillStyle = e.background, t.fillRect(e.left, e.top, e.size, e.size));var i = e.mode;1 === i || 2 === i ? n(r, t, e) : (3 === i || 4 === i) && o(r, t, e);
	  }function a(r, t, e, n, o, i, a, u) {
	    r.isDark(a, u) && t.rect(n, o, i, i);
	  }function u(r, t, e, n, o, i, a, u, f, c) {
	    a ? r.moveTo(t + i, e) : r.moveTo(t, e), u ? (r.lineTo(n - i, e), r.arcTo(n, e, n, o, i)) : r.lineTo(n, e), f ? (r.lineTo(n, o - i), r.arcTo(n, o, t, o, i)) : r.lineTo(n, o), c ? (r.lineTo(t + i, o), r.arcTo(t, o, t, e, i)) : r.lineTo(t, o), a ? (r.lineTo(t, e + i), r.arcTo(t, e, n, e, i)) : r.lineTo(t, e);
	  }function f(r, t, e, n, o, i, a, u, f, c) {
	    a && (r.moveTo(t + i, e), r.lineTo(t, e), r.lineTo(t, e + i), r.arcTo(t, e, t + i, e, i)), u && (r.moveTo(n - i, e), r.lineTo(n, e), r.lineTo(n, e + i), r.arcTo(n, e, n - i, e, i)), f && (r.moveTo(n - i, o), r.lineTo(n, o), r.lineTo(n, o - i), r.arcTo(n, o, n - i, o, i)), c && (r.moveTo(t + i, o), r.lineTo(t, o), r.lineTo(t, o - i), r.arcTo(t, o, t + i, o, i));
	  }function c(r, t, e, n, o, i, a, c) {
	    var l = r.isDark,
	        g = n + i,
	        s = o + i,
	        h = e.radius * i,
	        v = a - 1,
	        d = a + 1,
	        w = c - 1,
	        m = c + 1,
	        p = l(a, c),
	        y = l(v, w),
	        T = l(v, c),
	        B = l(v, m),
	        A = l(a, m),
	        E = l(d, m),
	        k = l(d, c),
	        M = l(d, w),
	        C = l(a, w);p ? u(t, n, o, g, s, h, !T && !C, !T && !A, !k && !A, !k && !C) : f(t, n, o, g, s, h, T && C && y, T && A && B, k && A && E, k && C && M);
	  }function l(r, t, e) {
	    var n,
	        o,
	        i = r.moduleCount,
	        u = e.size / i,
	        f = a;for (p && e.radius > 0 && e.radius <= .5 && (f = c), t.beginPath(), n = 0; i > n; n += 1) {
	      for (o = 0; i > o; o += 1) {
	        var l = e.left + o * u,
	            g = e.top + n * u,
	            s = u;f(r, t, e, l, g, s, n, o);
	      }
	    }if (w(e.fill).is("img")) {
	      t.strokeStyle = "rgba(0,0,0,0.5)", t.lineWidth = 2, t.stroke();var h = t.globalCompositeOperation;t.globalCompositeOperation = "destination-out", t.fill(), t.globalCompositeOperation = h, t.clip(), t.drawImage(e.fill, 0, 0, e.size, e.size), t.restore();
	    } else t.fillStyle = e.fill, t.fill();
	  }function g(r, t) {
	    var n = e(t.text, t.ecLevel, t.minVersion, t.maxVersion, t.quiet);if (!n) return null;var o = w(r).data("qrcode", n),
	        a = o[0].getContext("2d");return i(n, a, t), l(n, a, t), o;
	  }function s(r) {
	    var t = w("<canvas/>").attr("width", r.size).attr("height", r.size);return g(t, r);
	  }function h(r) {
	    return w("<img/>").attr("src", s(r)[0].toDataURL("image/png"));
	  }function v(r) {
	    var t = e(r.text, r.ecLevel, r.minVersion, r.maxVersion, r.quiet);if (!t) return null;var n,
	        o,
	        i = r.size,
	        a = r.background,
	        u = Math.floor,
	        f = t.moduleCount,
	        c = u(i / f),
	        l = u(.5 * (i - c * f)),
	        g = { position: "relative", left: 0, top: 0, padding: 0, margin: 0, width: i, height: i },
	        s = { position: "absolute", padding: 0, margin: 0, width: c, height: c, "background-color": r.fill },
	        h = w("<div/>").data("qrcode", t).css(g);for (a && h.css("background-color", a), n = 0; f > n; n += 1) {
	      for (o = 0; f > o; o += 1) {
	        t.isDark(n, o) && w("<div/>").css(s).css({ left: l + o * c, top: l + n * c }).appendTo(h);
	      }
	    }return h;
	  }function d(r) {
	    return m && "canvas" === r.render ? s(r) : m && "image" === r.render ? h(r) : v(r);
	  }var w = jQuery,
	      m = function () {
	    var r = document.createElement("canvas");return Boolean(r.getContext && r.getContext("2d"));
	  }(),
	      p = "[object Opera]" !== Object.prototype.toString.call(window.opera),
	      y = { render: "canvas", minVersion: 1, maxVersion: 40, ecLevel: "L", left: 0, top: 0, size: 200, fill: "#000", background: null, text: "no text", radius: 0, quiet: 0, mode: 0, mSize: .1, mPosX: .5, mPosY: .5, label: "no label", fontname: "sans", fontcolor: "#000", image: null };w.fn.qrcode = function (r) {
	    var t = w.extend({}, y, r);return this.each(function () {
	      "canvas" === this.nodeName.toLowerCase() ? g(this, t) : w(this).append(d(t));
	    });
	  };
	}(function () {
	  var r = function () {
	    function r(t, e) {
	      if ("undefined" == typeof t.length) throw new Error(t.length + "/" + e);var n = function () {
	        for (var r = 0; r < t.length && 0 == t[r];) {
	          r += 1;
	        }for (var n = new Array(t.length - r + e), o = 0; o < t.length - r; o += 1) {
	          n[o] = t[o + r];
	        }return n;
	      }(),
	          o = {};return o.getAt = function (r) {
	        return n[r];
	      }, o.getLength = function () {
	        return n.length;
	      }, o.multiply = function (t) {
	        for (var e = new Array(o.getLength() + t.getLength() - 1), n = 0; n < o.getLength(); n += 1) {
	          for (var i = 0; i < t.getLength(); i += 1) {
	            e[n + i] ^= a.gexp(a.glog(o.getAt(n)) + a.glog(t.getAt(i)));
	          }
	        }return r(e, 0);
	      }, o.mod = function (t) {
	        if (o.getLength() - t.getLength() < 0) return o;for (var e = a.glog(o.getAt(0)) - a.glog(t.getAt(0)), n = new Array(o.getLength()), i = 0; i < o.getLength(); i += 1) {
	          n[i] = o.getAt(i);
	        }for (var i = 0; i < t.getLength(); i += 1) {
	          n[i] ^= a.gexp(a.glog(t.getAt(i)) + e);
	        }return r(n, 0).mod(t);
	      }, o;
	    }var t = function t(_t, e) {
	      var o = 236,
	          a = 17,
	          l = _t,
	          g = n[e],
	          s = null,
	          h = 0,
	          d = null,
	          w = new Array(),
	          m = {},
	          p = function p(r, t) {
	        h = 4 * l + 17, s = function (r) {
	          for (var t = new Array(r), e = 0; r > e; e += 1) {
	            t[e] = new Array(r);for (var n = 0; r > n; n += 1) {
	              t[e][n] = null;
	            }
	          }return t;
	        }(h), y(0, 0), y(h - 7, 0), y(0, h - 7), A(), B(), k(r, t), l >= 7 && E(r), null == d && (d = D(l, g, w)), M(d, t);
	      },
	          y = function y(r, t) {
	        for (var e = -1; 7 >= e; e += 1) {
	          if (!(-1 >= r + e || r + e >= h)) for (var n = -1; 7 >= n; n += 1) {
	            -1 >= t + n || t + n >= h || (e >= 0 && 6 >= e && (0 == n || 6 == n) || n >= 0 && 6 >= n && (0 == e || 6 == e) || e >= 2 && 4 >= e && n >= 2 && 4 >= n ? s[r + e][t + n] = !0 : s[r + e][t + n] = !1);
	          }
	        }
	      },
	          T = function T() {
	        for (var r = 0, t = 0, e = 0; 8 > e; e += 1) {
	          p(!0, e);var n = i.getLostPoint(m);(0 == e || r > n) && (r = n, t = e);
	        }return t;
	      },
	          B = function B() {
	        for (var r = 8; h - 8 > r; r += 1) {
	          null == s[r][6] && (s[r][6] = r % 2 == 0);
	        }for (var t = 8; h - 8 > t; t += 1) {
	          null == s[6][t] && (s[6][t] = t % 2 == 0);
	        }
	      },
	          A = function A() {
	        for (var r = i.getPatternPosition(l), t = 0; t < r.length; t += 1) {
	          for (var e = 0; e < r.length; e += 1) {
	            var n = r[t],
	                o = r[e];if (null == s[n][o]) for (var a = -2; 2 >= a; a += 1) {
	              for (var u = -2; 2 >= u; u += 1) {
	                -2 == a || 2 == a || -2 == u || 2 == u || 0 == a && 0 == u ? s[n + a][o + u] = !0 : s[n + a][o + u] = !1;
	              }
	            }
	          }
	        }
	      },
	          E = function E(r) {
	        for (var t = i.getBCHTypeNumber(l), e = 0; 18 > e; e += 1) {
	          var n = !r && 1 == (t >> e & 1);s[Math.floor(e / 3)][e % 3 + h - 8 - 3] = n;
	        }for (var e = 0; 18 > e; e += 1) {
	          var n = !r && 1 == (t >> e & 1);s[e % 3 + h - 8 - 3][Math.floor(e / 3)] = n;
	        }
	      },
	          k = function k(r, t) {
	        for (var e = g << 3 | t, n = i.getBCHTypeInfo(e), o = 0; 15 > o; o += 1) {
	          var a = !r && 1 == (n >> o & 1);6 > o ? s[o][8] = a : 8 > o ? s[o + 1][8] = a : s[h - 15 + o][8] = a;
	        }for (var o = 0; 15 > o; o += 1) {
	          var a = !r && 1 == (n >> o & 1);8 > o ? s[8][h - o - 1] = a : 9 > o ? s[8][15 - o - 1 + 1] = a : s[8][15 - o - 1] = a;
	        }s[h - 8][8] = !r;
	      },
	          M = function M(r, t) {
	        for (var e = -1, n = h - 1, o = 7, a = 0, u = i.getMaskFunction(t), f = h - 1; f > 0; f -= 2) {
	          for (6 == f && (f -= 1);;) {
	            for (var c = 0; 2 > c; c += 1) {
	              if (null == s[n][f - c]) {
	                var l = !1;a < r.length && (l = 1 == (r[a] >>> o & 1));var g = u(n, f - c);g && (l = !l), s[n][f - c] = l, o -= 1, -1 == o && (a += 1, o = 7);
	              }
	            }if (n += e, 0 > n || n >= h) {
	              n -= e, e = -e;break;
	            }
	          }
	        }
	      },
	          C = function C(t, e) {
	        for (var n = 0, o = 0, a = 0, u = new Array(e.length), f = new Array(e.length), c = 0; c < e.length; c += 1) {
	          var l = e[c].dataCount,
	              g = e[c].totalCount - l;o = Math.max(o, l), a = Math.max(a, g), u[c] = new Array(l);for (var s = 0; s < u[c].length; s += 1) {
	            u[c][s] = 255 & t.getBuffer()[s + n];
	          }n += l;var h = i.getErrorCorrectPolynomial(g),
	              v = r(u[c], h.getLength() - 1),
	              d = v.mod(h);f[c] = new Array(h.getLength() - 1);for (var s = 0; s < f[c].length; s += 1) {
	            var w = s + d.getLength() - f[c].length;f[c][s] = w >= 0 ? d.getAt(w) : 0;
	          }
	        }for (var m = 0, s = 0; s < e.length; s += 1) {
	          m += e[s].totalCount;
	        }for (var p = new Array(m), y = 0, s = 0; o > s; s += 1) {
	          for (var c = 0; c < e.length; c += 1) {
	            s < u[c].length && (p[y] = u[c][s], y += 1);
	          }
	        }for (var s = 0; a > s; s += 1) {
	          for (var c = 0; c < e.length; c += 1) {
	            s < f[c].length && (p[y] = f[c][s], y += 1);
	          }
	        }return p;
	      },
	          D = function D(r, t, e) {
	        for (var n = u.getRSBlocks(r, t), c = f(), l = 0; l < e.length; l += 1) {
	          var g = e[l];c.put(g.getMode(), 4), c.put(g.getLength(), i.getLengthInBits(g.getMode(), r)), g.write(c);
	        }for (var s = 0, l = 0; l < n.length; l += 1) {
	          s += n[l].dataCount;
	        }if (c.getLengthInBits() > 8 * s) throw new Error("code length overflow. (" + c.getLengthInBits() + ">" + 8 * s + ")");for (c.getLengthInBits() + 4 <= 8 * s && c.put(0, 4); c.getLengthInBits() % 8 != 0;) {
	          c.putBit(!1);
	        }for (;;) {
	          if (c.getLengthInBits() >= 8 * s) break;if (c.put(o, 8), c.getLengthInBits() >= 8 * s) break;c.put(a, 8);
	        }return C(c, n);
	      };return m.addData = function (r) {
	        var t = c(r);w.push(t), d = null;
	      }, m.isDark = function (r, t) {
	        if (0 > r || r >= h || 0 > t || t >= h) throw new Error(r + "," + t);return s[r][t];
	      }, m.getModuleCount = function () {
	        return h;
	      }, m.make = function () {
	        p(!1, T());
	      }, m.createTableTag = function (r, t) {
	        r = r || 2, t = "undefined" == typeof t ? 4 * r : t;var e = "";e += '<table style="', e += " border-width: 0px; border-style: none;", e += " border-collapse: collapse;", e += " padding: 0px; margin: " + t + "px;", e += '">', e += "<tbody>";for (var n = 0; n < m.getModuleCount(); n += 1) {
	          e += "<tr>";for (var o = 0; o < m.getModuleCount(); o += 1) {
	            e += '<td style="', e += " border-width: 0px; border-style: none;", e += " border-collapse: collapse;", e += " padding: 0px; margin: 0px;", e += " width: " + r + "px;", e += " height: " + r + "px;", e += " background-color: ", e += m.isDark(n, o) ? "#000000" : "#ffffff", e += ";", e += '"/>';
	          }e += "</tr>";
	        }return e += "</tbody>", e += "</table>";
	      }, m.createImgTag = function (r, t) {
	        r = r || 2, t = "undefined" == typeof t ? 4 * r : t;var e = m.getModuleCount() * r + 2 * t,
	            n = t,
	            o = e - t;return v(e, e, function (t, e) {
	          if (t >= n && o > t && e >= n && o > e) {
	            var i = Math.floor((t - n) / r),
	                a = Math.floor((e - n) / r);return m.isDark(a, i) ? 0 : 1;
	          }return 1;
	        });
	      }, m;
	    };t.stringToBytes = function (r) {
	      for (var t = new Array(), e = 0; e < r.length; e += 1) {
	        var n = r.charCodeAt(e);t.push(255 & n);
	      }return t;
	    }, t.createStringToBytes = function (r, t) {
	      var e = function () {
	        for (var e = s(r), n = function n() {
	          var r = e.read();if (-1 == r) throw new Error();return r;
	        }, o = 0, i = {};;) {
	          var a = e.read();if (-1 == a) break;var u = n(),
	              f = n(),
	              c = n(),
	              l = String.fromCharCode(a << 8 | u),
	              g = f << 8 | c;i[l] = g, o += 1;
	        }if (o != t) throw new Error(o + " != " + t);return i;
	      }(),
	          n = "?".charCodeAt(0);return function (r) {
	        for (var t = new Array(), o = 0; o < r.length; o += 1) {
	          var i = r.charCodeAt(o);if (128 > i) t.push(i);else {
	            var a = e[r.charAt(o)];"number" == typeof a ? (255 & a) == a ? t.push(a) : (t.push(a >>> 8), t.push(255 & a)) : t.push(n);
	          }
	        }return t;
	      };
	    };var e = { MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8 },
	        n = { L: 1, M: 0, Q: 3, H: 2 },
	        o = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 },
	        i = function () {
	      var t = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
	          n = 1335,
	          i = 7973,
	          u = 21522,
	          f = {},
	          c = function c(r) {
	        for (var t = 0; 0 != r;) {
	          t += 1, r >>>= 1;
	        }return t;
	      };return f.getBCHTypeInfo = function (r) {
	        for (var t = r << 10; c(t) - c(n) >= 0;) {
	          t ^= n << c(t) - c(n);
	        }return (r << 10 | t) ^ u;
	      }, f.getBCHTypeNumber = function (r) {
	        for (var t = r << 12; c(t) - c(i) >= 0;) {
	          t ^= i << c(t) - c(i);
	        }return r << 12 | t;
	      }, f.getPatternPosition = function (r) {
	        return t[r - 1];
	      }, f.getMaskFunction = function (r) {
	        switch (r) {case o.PATTERN000:
	            return function (r, t) {
	              return (r + t) % 2 == 0;
	            };case o.PATTERN001:
	            return function (r, t) {
	              return r % 2 == 0;
	            };case o.PATTERN010:
	            return function (r, t) {
	              return t % 3 == 0;
	            };case o.PATTERN011:
	            return function (r, t) {
	              return (r + t) % 3 == 0;
	            };case o.PATTERN100:
	            return function (r, t) {
	              return (Math.floor(r / 2) + Math.floor(t / 3)) % 2 == 0;
	            };case o.PATTERN101:
	            return function (r, t) {
	              return r * t % 2 + r * t % 3 == 0;
	            };case o.PATTERN110:
	            return function (r, t) {
	              return (r * t % 2 + r * t % 3) % 2 == 0;
	            };case o.PATTERN111:
	            return function (r, t) {
	              return (r * t % 3 + (r + t) % 2) % 2 == 0;
	            };default:
	            throw new Error("bad maskPattern:" + r);}
	      }, f.getErrorCorrectPolynomial = function (t) {
	        for (var e = r([1], 0), n = 0; t > n; n += 1) {
	          e = e.multiply(r([1, a.gexp(n)], 0));
	        }return e;
	      }, f.getLengthInBits = function (r, t) {
	        if (t >= 1 && 10 > t) switch (r) {case e.MODE_NUMBER:
	            return 10;case e.MODE_ALPHA_NUM:
	            return 9;case e.MODE_8BIT_BYTE:
	            return 8;case e.MODE_KANJI:
	            return 8;default:
	            throw new Error("mode:" + r);} else if (27 > t) switch (r) {case e.MODE_NUMBER:
	            return 12;case e.MODE_ALPHA_NUM:
	            return 11;case e.MODE_8BIT_BYTE:
	            return 16;case e.MODE_KANJI:
	            return 10;default:
	            throw new Error("mode:" + r);} else {
	          if (!(41 > t)) throw new Error("type:" + t);switch (r) {case e.MODE_NUMBER:
	              return 14;case e.MODE_ALPHA_NUM:
	              return 13;case e.MODE_8BIT_BYTE:
	              return 16;case e.MODE_KANJI:
	              return 12;default:
	              throw new Error("mode:" + r);}
	        }
	      }, f.getLostPoint = function (r) {
	        for (var t = r.getModuleCount(), e = 0, n = 0; t > n; n += 1) {
	          for (var o = 0; t > o; o += 1) {
	            for (var i = 0, a = r.isDark(n, o), u = -1; 1 >= u; u += 1) {
	              if (!(0 > n + u || n + u >= t)) for (var f = -1; 1 >= f; f += 1) {
	                0 > o + f || o + f >= t || (0 != u || 0 != f) && a == r.isDark(n + u, o + f) && (i += 1);
	              }
	            }i > 5 && (e += 3 + i - 5);
	          }
	        }for (var n = 0; t - 1 > n; n += 1) {
	          for (var o = 0; t - 1 > o; o += 1) {
	            var c = 0;r.isDark(n, o) && (c += 1), r.isDark(n + 1, o) && (c += 1), r.isDark(n, o + 1) && (c += 1), r.isDark(n + 1, o + 1) && (c += 1), (0 == c || 4 == c) && (e += 3);
	          }
	        }for (var n = 0; t > n; n += 1) {
	          for (var o = 0; t - 6 > o; o += 1) {
	            r.isDark(n, o) && !r.isDark(n, o + 1) && r.isDark(n, o + 2) && r.isDark(n, o + 3) && r.isDark(n, o + 4) && !r.isDark(n, o + 5) && r.isDark(n, o + 6) && (e += 40);
	          }
	        }for (var o = 0; t > o; o += 1) {
	          for (var n = 0; t - 6 > n; n += 1) {
	            r.isDark(n, o) && !r.isDark(n + 1, o) && r.isDark(n + 2, o) && r.isDark(n + 3, o) && r.isDark(n + 4, o) && !r.isDark(n + 5, o) && r.isDark(n + 6, o) && (e += 40);
	          }
	        }for (var l = 0, o = 0; t > o; o += 1) {
	          for (var n = 0; t > n; n += 1) {
	            r.isDark(n, o) && (l += 1);
	          }
	        }var g = Math.abs(100 * l / t / t - 50) / 5;return e += 10 * g;
	      }, f;
	    }(),
	        a = function () {
	      for (var r = new Array(256), t = new Array(256), e = 0; 8 > e; e += 1) {
	        r[e] = 1 << e;
	      }for (var e = 8; 256 > e; e += 1) {
	        r[e] = r[e - 4] ^ r[e - 5] ^ r[e - 6] ^ r[e - 8];
	      }for (var e = 0; 255 > e; e += 1) {
	        t[r[e]] = e;
	      }var n = {};return n.glog = function (r) {
	        if (1 > r) throw new Error("glog(" + r + ")");return t[r];
	      }, n.gexp = function (t) {
	        for (; 0 > t;) {
	          t += 255;
	        }for (; t >= 256;) {
	          t -= 255;
	        }return r[t];
	      }, n;
	    }(),
	        u = function () {
	      var r = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
	          t = function t(r, _t2) {
	        var e = {};return e.totalCount = r, e.dataCount = _t2, e;
	      },
	          e = {},
	          o = function o(t, e) {
	        switch (e) {case n.L:
	            return r[4 * (t - 1) + 0];case n.M:
	            return r[4 * (t - 1) + 1];case n.Q:
	            return r[4 * (t - 1) + 2];case n.H:
	            return r[4 * (t - 1) + 3];default:
	            return void 0;}
	      };return e.getRSBlocks = function (r, e) {
	        var n = o(r, e);if ("undefined" == typeof n) throw new Error("bad rs block @ typeNumber:" + r + "/errorCorrectLevel:" + e);for (var i = n.length / 3, a = new Array(), u = 0; i > u; u += 1) {
	          for (var f = n[3 * u + 0], c = n[3 * u + 1], l = n[3 * u + 2], g = 0; f > g; g += 1) {
	            a.push(t(c, l));
	          }
	        }return a;
	      }, e;
	    }(),
	        f = function f() {
	      var r = new Array(),
	          t = 0,
	          e = {};return e.getBuffer = function () {
	        return r;
	      }, e.getAt = function (t) {
	        var e = Math.floor(t / 8);return 1 == (r[e] >>> 7 - t % 8 & 1);
	      }, e.put = function (r, t) {
	        for (var n = 0; t > n; n += 1) {
	          e.putBit(1 == (r >>> t - n - 1 & 1));
	        }
	      }, e.getLengthInBits = function () {
	        return t;
	      }, e.putBit = function (e) {
	        var n = Math.floor(t / 8);r.length <= n && r.push(0), e && (r[n] |= 128 >>> t % 8), t += 1;
	      }, e;
	    },
	        c = function c(r) {
	      var n = e.MODE_8BIT_BYTE,
	          o = t.stringToBytes(r),
	          i = {};return i.getMode = function () {
	        return n;
	      }, i.getLength = function (r) {
	        return o.length;
	      }, i.write = function (r) {
	        for (var t = 0; t < o.length; t += 1) {
	          r.put(o[t], 8);
	        }
	      }, i;
	    },
	        l = function l() {
	      var r = new Array(),
	          t = {};return t.writeByte = function (t) {
	        r.push(255 & t);
	      }, t.writeShort = function (r) {
	        t.writeByte(r), t.writeByte(r >>> 8);
	      }, t.writeBytes = function (r, e, n) {
	        e = e || 0, n = n || r.length;for (var o = 0; n > o; o += 1) {
	          t.writeByte(r[o + e]);
	        }
	      }, t.writeString = function (r) {
	        for (var e = 0; e < r.length; e += 1) {
	          t.writeByte(r.charCodeAt(e));
	        }
	      }, t.toByteArray = function () {
	        return r;
	      }, t.toString = function () {
	        var t = "";t += "[";for (var e = 0; e < r.length; e += 1) {
	          e > 0 && (t += ","), t += r[e];
	        }return t += "]";
	      }, t;
	    },
	        g = function g() {
	      var r = 0,
	          t = 0,
	          e = 0,
	          n = "",
	          o = {},
	          i = function i(r) {
	        n += String.fromCharCode(a(63 & r));
	      },
	          a = function a(r) {
	        if (0 > r) ;else {
	          if (26 > r) return 65 + r;if (52 > r) return 97 + (r - 26);if (62 > r) return 48 + (r - 52);if (62 == r) return 43;if (63 == r) return 47;
	        }throw new Error("n:" + r);
	      };return o.writeByte = function (n) {
	        for (r = r << 8 | 255 & n, t += 8, e += 1; t >= 6;) {
	          i(r >>> t - 6), t -= 6;
	        }
	      }, o.flush = function () {
	        if (t > 0 && (i(r << 6 - t), r = 0, t = 0), e % 3 != 0) for (var o = 3 - e % 3, a = 0; o > a; a += 1) {
	          n += "=";
	        }
	      }, o.toString = function () {
	        return n;
	      }, o;
	    },
	        s = function s(r) {
	      var t = r,
	          e = 0,
	          n = 0,
	          o = 0,
	          i = {};i.read = function () {
	        for (; 8 > o;) {
	          if (e >= t.length) {
	            if (0 == o) return -1;throw new Error("unexpected end of file./" + o);
	          }var r = t.charAt(e);if (e += 1, "=" == r) return o = 0, -1;r.match(/^\s$/) || (n = n << 6 | a(r.charCodeAt(0)), o += 6);
	        }var i = n >>> o - 8 & 255;return o -= 8, i;
	      };var a = function a(r) {
	        if (r >= 65 && 90 >= r) return r - 65;if (r >= 97 && 122 >= r) return r - 97 + 26;if (r >= 48 && 57 >= r) return r - 48 + 52;if (43 == r) return 62;if (47 == r) return 63;throw new Error("c:" + r);
	      };return i;
	    },
	        h = function h(r, t) {
	      var e = r,
	          n = t,
	          o = new Array(r * t),
	          i = {};i.setPixel = function (r, t, n) {
	        o[t * e + r] = n;
	      }, i.write = function (r) {
	        r.writeString("GIF87a"), r.writeShort(e), r.writeShort(n), r.writeByte(128), r.writeByte(0), r.writeByte(0), r.writeByte(0), r.writeByte(0), r.writeByte(0), r.writeByte(255), r.writeByte(255), r.writeByte(255), r.writeString(","), r.writeShort(0), r.writeShort(0), r.writeShort(e), r.writeShort(n), r.writeByte(0);var t = 2,
	            o = u(t);r.writeByte(t);for (var i = 0; o.length - i > 255;) {
	          r.writeByte(255), r.writeBytes(o, i, 255), i += 255;
	        }r.writeByte(o.length - i), r.writeBytes(o, i, o.length - i), r.writeByte(0), r.writeString(";");
	      };var a = function a(r) {
	        var t = r,
	            e = 0,
	            n = 0,
	            o = {};return o.write = function (r, o) {
	          if (r >>> o != 0) throw new Error("length over");for (; e + o >= 8;) {
	            t.writeByte(255 & (r << e | n)), o -= 8 - e, r >>>= 8 - e, n = 0, e = 0;
	          }n = r << e | n, e += o;
	        }, o.flush = function () {
	          e > 0 && t.writeByte(n);
	        }, o;
	      },
	          u = function u(r) {
	        for (var t = 1 << r, e = (1 << r) + 1, n = r + 1, i = f(), u = 0; t > u; u += 1) {
	          i.add(String.fromCharCode(u));
	        }i.add(String.fromCharCode(t)), i.add(String.fromCharCode(e));var c = l(),
	            g = a(c);g.write(t, n);var s = 0,
	            h = String.fromCharCode(o[s]);for (s += 1; s < o.length;) {
	          var v = String.fromCharCode(o[s]);s += 1, i.contains(h + v) ? h += v : (g.write(i.indexOf(h), n), i.size() < 4095 && (i.size() == 1 << n && (n += 1), i.add(h + v)), h = v);
	        }return g.write(i.indexOf(h), n), g.write(e, n), g.flush(), c.toByteArray();
	      },
	          f = function f() {
	        var r = {},
	            t = 0,
	            e = {};return e.add = function (n) {
	          if (e.contains(n)) throw new Error("dup key:" + n);r[n] = t, t += 1;
	        }, e.size = function () {
	          return t;
	        }, e.indexOf = function (t) {
	          return r[t];
	        }, e.contains = function (t) {
	          return "undefined" != typeof r[t];
	        }, e;
	      };return i;
	    },
	        v = function v(r, t, e, n) {
	      for (var o = h(r, t), i = 0; t > i; i += 1) {
	        for (var a = 0; r > a; a += 1) {
	          o.setPixel(a, i, e(a, i));
	        }
	      }var u = l();o.write(u);for (var f = g(), c = u.toByteArray(), s = 0; s < c.length; s += 1) {
	        f.writeByte(c[s]);
	      }f.flush();var v = "";return v += "<img", v += ' src="', v += "data:image/gif;base64,", v += f, v += '"', v += ' width="', v += r, v += '"', v += ' height="', v += t, v += '"', n && (v += ' alt="', v += n, v += '"'), v += "/>";
	    };return t;
	  }();return function (r) {
	     true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (r), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && (module.exports = r());
	  }(function () {
	    return r;
	  }), !function (r) {
	    r.stringToBytes = function (r) {
	      function t(r) {
	        for (var t = [], e = 0; e < r.length; e++) {
	          var n = r.charCodeAt(e);128 > n ? t.push(n) : 2048 > n ? t.push(192 | n >> 6, 128 | 63 & n) : 55296 > n || n >= 57344 ? t.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | 63 & n) : (e++, n = 65536 + ((1023 & n) << 10 | 1023 & r.charCodeAt(e)), t.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | 63 & n));
	        }return t;
	      }return t(r);
	    };
	  }(r), r;
	}());

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _socket = __webpack_require__(9);

	var _socket2 = _interopRequireDefault(_socket);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var noop = function noop() {};
	var EVENT_JOIN = 'fs:join';
	var EVENT_LEAVE = 'fs:leave';
	var EVENT_MSG = 'fs:msg';

	var Connector = function () {
	    function Connector(options) {
	        _classCallCheck(this, Connector);

	        options = options || {};

	        var me = this;
	        me.ns = options.ns || '/fs-jsapi';
	        me.host = options.host || [location.protocol, location.host].join('//');
	        me.roomId = options.roomId;
	        me.logger = options.logger || noop;

	        me.socket = null;
	    }

	    _createClass(Connector, [{
	        key: 'init',
	        value: function init() {
	            var me = this,
	                events = void 0;
	            me.log('Connect to: ' + me.host + ', ' + me.ns);
	            me.socket = (0, _socket2.default)(me.host + me.ns);

	            events = 'connect|connecting|connect_failed|reconnect|reconnecting|reconnect_failed|disconnect|error';
	            events.split('|').forEach(function (item) {
	                me.socket.on(item, me.onSocketEvent.bind(me, item));
	            });
	            events = [EVENT_JOIN, EVENT_LEAVE, EVENT_MSG];
	            events.forEach(function (item) {
	                me.socket.on(item, me.onCustomEvent.bind(me, item));
	            });
	        }
	    }, {
	        key: 'onSocketEvent',
	        value: function onSocketEvent(eventName, event) {
	            var me = this;

	            switch (eventName) {
	                case 'connect':
	                    me.log('Connect success');

	                    // Join the specified room, or join self room
	                    if (!me.roomId) {
	                        me.roomId = me.socket.id;
	                    }
	                    me.log('Join room: ' + me.roomId + ', self id: ' + me.socket.id);
	                    me.socket.emit(EVENT_JOIN, {
	                        roomId: me.roomId || me.socket.id
	                    });
	                    break;
	                case 'connecting':
	                    me.log('Connecting...');
	                    break;
	                case 'connect_failed':
	                    me.log('Connect fail');
	                    break;
	                case 'reconnect':
	                    me.log('Reconnect success');
	                    break;
	                case 'reconnecting':
	                    me.log('Reconnect...');
	                    break;
	                case 'reconnect_failed':
	                    me.log('Reconnect fail');
	                    break;
	                case 'disconnect':
	                    me.log('Disconnect');
	                    break;
	                case 'error':
	                    me.log('Connect error');
	                    break;
	            }
	        }
	    }, {
	        key: 'onCustomEvent',
	        value: function onCustomEvent(eventName, event) {
	            // Dispatch server msg to all
	            var me = this;
	            me.log('Receive event: ' + eventName, event);

	            var e = new CustomEvent(eventName, {
	                detail: event
	            });
	            document.dispatchEvent(e);
	        }
	    }, {
	        key: 'log',
	        value: function log(msg, detail) {
	            var me = this;
	            me.logger(msg, detail);
	        }
	    }, {
	        key: 'send',
	        value: function send(msg) {
	            var me = this;
	            me.socket.emit(EVENT_MSG, {
	                roomId: me.roomId,
	                msg: msg
	            });
	        }
	    }]);

	    return Connector;
	}();

	exports.default = Connector;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = io;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getScriptFromURL = getScriptFromURL;
	exports.actualScript = actualScript;
	exports.getQueryParam = getQueryParam;
	var root = window;
	var doc = document;

	/**
	 * Reference: https://github.com/samyk/jiagra/blob/master/jiagra.js
	 * Get script object based on src
	 * 
	 * @param {String} url
	 * @return {HTMLElement} script object
	 */
	function getScriptFromURL(url) {
	    for (var i = 0, scripts = doc.getElementsByTagName('script'); i < scripts.length; ++i) {
	        if (scripts[i].src == url) return scripts[i];
	    }

	    return undefined;
	}

	/**
	 * Reference: https://github.com/samyk/jiagra/blob/master/jiagra.js
	 * Get current script object which is running
	 * 
	 * @return {HTMLElement} script object
	 */
	function actualScript() {
	    if (doc.currentScript) return doc.currentScript;

	    var stack = void 0;
	    try {
	        omgwtf;
	    } catch (e) {
	        stack = e.stack;
	    }

	    // chrome uses at, ff uses @
	    var e = stack.indexOf(' at ') !== -1 ? ' at ' : '@';
	    while (stack.indexOf(e) !== -1) {
	        stack = stack.substring(stack.indexOf(e) + e.length);
	    }stack = stack.substring(0, stack.indexOf(':', stack.indexOf(':') + 1));

	    return getScriptFromURL(stack);
	}

	/**
	 * 从queryString里获取参数值
	 * 
	 * @param {String} name
	 * @return {String}
	 */
	function getQueryParam(name) {
	    var search = root.location.search.substr(1);
	    if (!search) return null;

	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	    var matches = search.match(reg);
	    return matches != null ? decodeURIComponent(matches[2]) : null;
	}

/***/ }
/******/ ]);