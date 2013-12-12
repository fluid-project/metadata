/*

Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($, fluid) {

    fluid.registerNamespace("fluid.metadata");

    fluid.metadata.itemtype = {
        "MOVIE": "http://schema.org/Movie"
    };

    fluid.metadata.writer = function (container, type, metadata) {
        var containerAttrs = {
            itemscope: ""
        };

        if (type) {
            containerAttrs["itemtype"] = type;
        }

        container.attr(containerAttrs);

        fluid.each(metadata, function (contents, itemprop) {
            fluid.each(fluid.makeArray(contents), function (content) {
                $("<meta />").attr({
                    itemprop: itemprop,
                    content: content
                }).appendTo(container);
            });
        });
    };

})(jQuery, fluid);
