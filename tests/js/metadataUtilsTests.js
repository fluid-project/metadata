/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    fluid.registerNamespace("fluid.tests");

    jqUnit.test("fluid.metadata.writer: no type", function () {
        var elm = $("<div></div>");
        var metadata = {
            accessMode: ["audio", "visual"],
            accessibilityFeature: ["captions"],
            keywords: ["sound effects", "dialog"],
            accessibilityHazard: "noFlashing"
        };

        fluid.metadata.writer(elm, null, metadata);

        var metaElms = elm.find("meta");
        jqUnit.assertValue("An itemscope should have been added to the container", elm.attr("itemscope"));
        jqUnit.assertFalse("No type attribute should have been added to the container", elm.attr("itemtype"));
        jqUnit.assertEquals("The meta tags should have been appended", 6, metaElms.length);
        fluid.each(metadata, function (contents, itemprop) {
            var propElms = metaElms.filter("[itemprop='" + itemprop + "']");
            fluid.each(fluid.makeArray(contents), function (content, idx) {
                jqUnit.assertEquals("The contents should be set correctly", content, propElms.eq(idx).attr("content"));
            });
        });
    });

    jqUnit.test("fluid.metadata.writer: with type", function () {
        var elm = $("<div></div>");
        var type = "http://schema.org/Movie";
        var metadata = {
            accessMode: "visual",
            accessibilityFeature: ["captions"],
            keywords: ["sound effects", "dialog"],
            accessibilityHazard: "noFlashing"
        };

        fluid.metadata.writer(elm, type, metadata);

        var metaElms = elm.find("meta");
        jqUnit.assertValue("An itemscope should have been added to the container", elm.attr("itemscope"));
        jqUnit.assertEquals("The type attribute should have been added to the container", type, elm.attr("itemtype"));
        jqUnit.assertEquals("The meta tags should have been appended", 5, metaElms.length);
        fluid.each(metadata, function (contents, itemprop) {
            var propElms = metaElms.filter("[itemprop='" + itemprop + "']");
            fluid.each(fluid.makeArray(contents), function (content, idx) {
                jqUnit.assertEquals("The contents should be set correctly", content, propElms.eq(idx).attr("content"));
            });
        });
    });

})(jQuery);
