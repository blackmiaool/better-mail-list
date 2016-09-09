// ==UserScript==
// @name         better-mail-list
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("Better MailList", function() {
        var domClass = "better-mail-quote";
        var pres = document.querySelectorAll("pre");
        for (var i = 0; i < pres.length; i++) {
            console.log(i);
            var pre = pres[i];
            var html = pre.innerHTML;
            var order = 0;
            html = pre.innerHTML.split("\n").reduce(function(p, v, i) {
                var header = v.match(/(?:&gt;\s*)+/);
                var vContent = v.replace(/(?:&gt;\s*)+/g, "");
                var quoteHeader = "";
                var quoteRear = "";

                function toOrder(newOrder) {
                    if (newOrder > order) {
                        for (var i = order + 1; i <= newOrder; i++) {
                            quoteHeader += "<blockquote data-order='" + i + "'>";
                        }
                    } else if (newOrder < order) {
                        for (var i = order; i > newOrder; i--) {
                            quoteRear += "</blockquote>";
                        }
                    }
                    order = newOrder;
                }
                if (header) {
                    var orderThis = header[0].match(/&gt;*/g).length;
                    if (orderThis > order) {
                        toOrder(orderThis);
                    } else if (orderThis < order && v.match(/^(?:&gt;\s*)+$/g)) {
                        toOrder(orderThis);
                    }
                }
                if (!vContent) {
                    vContent = "&nbsp;";
                }
                return p + quoteHeader + "<div class='" + domClass + "' data-order='" + order + "'>" + vContent + "</div>" + quoteRear;
            }, "");
            html.replace(/\n(&gt;\s*)+/g, function(text) {
                return text.replace(/&gt;/g, "<span class='" + domClass + "'></span>");
            });
            pre.innerHTML = html;
        }
        var initStyle = "";

        function putStyle(style) {
            initStyle += style;
        }

        function putOrderStyle(index) {
            putStyle("." + domClass + "[data-order='" + index + "']{");
            // putStyle("    margin-left: "+marginIndent*index+"px;");
            putStyle("}");
        }
        for (var i = 0; i < 10; i++) {
            putOrderStyle(i);
        }
        putStyle("blockquote[data-order]{");
        putStyle("margin-left:0px;");
        putStyle("padding-left:20px;");
        putStyle("margin-top:10px;");
        putStyle("margin-bottom:10px;");
        putStyle("}");

        if (GM_addStyle) {
            GM_addStyle(initStyle);
        }
    });

    // Your code here...
})();