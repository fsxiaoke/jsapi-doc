(function(root){

    /**
     * FSOpen jsapi doc
     */
    var doc = {
        nav: null,
        doc: null,
        navFile: './nav.md',
        docFile: './doc.md',

        /**
         * 初始化，加载相关md文件
         */
        init: function() {
            var renderer = new marked.Renderer(),
                headTmpl = '<h{level} id={id}>{text}</h{level}>';

            // 处理标题信息
            renderer.heading = function (text, level, raw) {
                console.log(text, level, raw);
                var map = {
                    raw: raw,
                    text: text,
                    level: level
                };
                // 默认以原始内容为ID信息
                map.id = this.options.headerPrefix 
                    + raw.toLowerCase().replace(/[\s]+/g, '-');

                return headTmpl.replace(/\{(.*?)\}/g, function(matched, key) {
                    return map[key] || '';
                });
            };

            marked.setOptions({
                renderer: renderer,
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: false
            });

            this.nav = $('#g-nav');
            this.doc = $('#g-doc');

            this._initNav();
            this._initDoc();
        },

        _initNav: function() {
            var self = this;
            $.get(self.navFile, function(data) {
                self.nav.html(marked(data));
            });
        },
        _initDoc: function() {
            var self = this;
            $.get(self.docFile, function(data) {
                self.doc.html(marked(data));
                if (location.hash) {
                    var hash = location.hash.substr(1);
                    var node = document.getElementById(hash);
                    if (node) {
                        window.scrollTo(0, node.getBoundingClientRect().top);
                    }
                }
            });
        }
    }

    root.FSOpen = root.FSOpen || {};
    root.FSOpen.doc = doc;
    
})(this);

