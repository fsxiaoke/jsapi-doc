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

	var _connector = __webpack_require__(8);

	var _connector2 = _interopRequireDefault(_connector);

	var _util = __webpack_require__(10);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var VConsole = function () {
	    function VConsole(options) {
	        _classCallCheck(this, VConsole);

	        options = options || {};

	        var me = this;
	        options.logger = me.log.bind(me);
	        me.connector = new _connector2.default(options);
	    }

	    _createClass(VConsole, [{
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
	                        // console.log(e.name, '====', e.message);
	                        // var name = e.name;
	                        // switch (name) {
	                        // case 'TypeError':
	                        //     break;
	                        // case 'SyntaxError':
	                        //     break;
	                        // }
	                    }
	                    break;
	                case 'fs:join':
	                    var data = event.detail || {};
	                    me.log('客户端：' + data.clientId + '加入了房间：' + data.roomId + '，总连接数：' + data.clientCount);
	                    break;
	                case 'fs:leave':
	                    var data = event.detail || {};
	                    me.log('客户端：' + data.clientId + '离开了房间：' + data.roomId + '，总连接数：' + data.clientCount);
	                    break;
	            }
	        }
	    }, {
	        key: 'log',
	        value: function log(msg, detail) {
	            vconsole.log(msg, detail);
	        }
	    }]);

	    return VConsole;
	}();

	var vconsole = {};

	/**
	 * 对外暴露日志输出接口
	 * 
	 * @param {String} log message
	 * @param {Object} log data
	 */
	vconsole.log = function (msg, detail) {
	    console.log(msg, JSON.stringify(detail));
	};
	/**
	 * 初始化VConsole对外接口
	 * 
	 * @param {Object} optional config
	 */
	vconsole.init = function (options) {
	    if (vconsole.i) return;
	    options = options || {};
	    if (!options.roomId) {
	        // 如果配置参数没有指定房间号，则尝试从queryString里获取
	        options.roomId = util.getQueryParam('fs_rid');
	    }

	    vconsole.config = options;
	    vconsole.i = new VConsole(vconsole.config);
	    vconsole.i.init();
	};

	window.vconsole = vconsole;

	var script = util.actualScript();
	if (script) {
	    var dataset = script.dataset;
	    /**
	     * 支持脚本参数配置：
	     * `data-ns`   - 指定远程服务连接的namespace
	     * `data-host` - 指定远程服务连接的host
	     * `data-rid`  - 指定远程服务连接的房间ID
	     */
	    vconsole.init({
	        ns: dataset.ns,
	        host: dataset.host,
	        roomId: dataset.rid
	    });
	}

	exports.default = vconsole;

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
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