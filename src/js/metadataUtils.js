/*

Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.metadata");

    gpii.metadata.itemtype = {
        "VIDEO_OBJECT": "http://schema.org/VideoObject"
    };

    /**
     * Writes metadata information to an element. The itemscope property is added to this element.
     * @param {Object} container, a jQuery object for the element to add metadata to.
     * @param {Object} metadata, key/value pairs where the key represents the itemprop to set, and the value is the content value to assign to it.
     * These are written out as meta tags within the container.
     * @param {Object} options, extra attributes to add to the container element, likely only itemprop and itemtype.
     */
    gpii.metadata.writer = function (container, metadata, options) {
        var containerAttrs = {
            itemscope: ""
        };

        $.extend(true, containerAttrs, options);

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
