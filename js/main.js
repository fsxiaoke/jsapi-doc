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
                // console.log(text, level, raw);
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

            // 处理原始HTML消息
            renderer.html = function(html) {
                var node = $(html);
                return node.length > 0 && node.get(0).tagName.toLowerCase() == 'for_fs_internal_only' ? '' : html;
            };

            marked.setOptions({
                renderer: renderer,
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: false
            });

            this.nav = $('#g-nav');
            this.doc = $('#g-doc');

            this._initNav();
            this._initDoc();

            // 这个可通过currentScript来进行配置
            // FSOpen.debuggor.init({host:'http://10.22.0.60:9999'});

            $(root).on('hashchange', this.onHashChange.bind(this));
            this.article = root.location.hash.substr(1);
            if (this.article) {
                this.loadArticle(this.article);
            } else {
                var $nodes = this.nav.find('.js-art');
                if ($nodes.length)
                    location.hash = $nodes.first().attr('href');
            }
        },
        _initNav: function() {
            // var self = this;
            // $.get(self.navFile, function(data) {
            //     self.nav.html(marked(data));
            // });
            this.nav.on('click', function(e) {
				var $node = $(e.target);
				if ($node.hasClass('js-cate')) {
					var $i = $node.find('i');
					$i.toggleClass('exp-no');

					var $ul = $node.next();
					$ul.animate({height: 'toggle', opacity: 'toggle'});
				}
			});
        },
        _initDoc: function() {
            // var self = this;
            // $.get(self.docFile, function(data) {
            //     var s = marked(data);
            //     self.doc.html(s);
            //     if (location.hash) {
            //         var hash = location.hash.substr(1);
            //         var node = document.getElementById(hash);
            //         if (node) {
            //             window.scrollTo(0, node.getBoundingClientRect().top);
            //         }
            //     }
            // });
            this.doc.on('click', function(e) {
                var $node = $(e.target);
                switch ($node.data('action')) {
                    case 'edit':
                        var $code = $node.parent().prev().children();
                        if ($code.attr('contentEditable') == 'true') {
                            $code.attr('contentEditable', false);
                            $node.text('编辑');
                        } else {
                            $code.attr('contentEditable', true);
                            $node.text('完成');
                        }
                        break;
                    case 'run':
                        var $code = $node.parent().prev().children();
                        $code.attr('contentEditable', false);
                        $node.prev().text('编辑');

                        var code = $code.text();
                        debuggor.send(code);
                        break;
                    case 'complete':
                        break;
                }
            });
        },
        onHashChange: function() {
            var value = root.location.hash.substr(1);
            this.loadArticle(value);
        },
        loadArticle: function(url) {
            var self = this;
            self.setHighLight(url);
            $.ajax({
                url: './doc/' + url + '.md',
                type: 'GET',
                success: function(data) {
                    var s = marked(data);
                    self.doc.html(s);
                    self.makeCodeRun();
                },
                error: function(error) {
                    self.doc.html('404 Not found');
                }
            });
        },
        setHighLight: function(url) {
            var $articles = this.nav.find('.js-art');
			$articles.each(function(index, article) {
				if ($(article).attr('href') == '#' + url) {
					$(article).closest('ul').show();
					$(article).addClass('selected');
				} else {
					$(article).removeClass('selected');
				}
			});
        },
        /**
         * 使有效的代码段可直接执行
         */
        makeCodeRun: function() {
            var $codes = this.doc.find('.lang-javascript');
            $codes.each(function(index, code) {
                var $div = $('<div class="code">'),
                    $code = $(code).parent(),
                    $clone = $code.clone();
                $div.append($clone);

                var $opr = $('<div><button class="btn btn-default" data-action="edit">编辑</button>  <button class="btn btn-primary" data-action="run">运行</button></div>');
                $div.append($opr);
                
                $code.replaceWith($div);
            });
        }
    }

    root.FSOpen = root.FSOpen || {};
    root.FSOpen.doc = doc;
    
})(window);

