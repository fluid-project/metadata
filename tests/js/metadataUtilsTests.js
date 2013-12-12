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

    var assertMetaTags = function (elm, numTags, metadata) {
        var metaElms = elm.find("meta");
        jqUnit.assertEquals("The meta tags should have been appended", numTags, metaElms.length);
        fluid.each(metadata, function (contents, itemprop) {
            var propElms = metaElms.filter("[itemprop='" + itemprop + "']");
            fluid.each(fluid.makeArray(contents), function (content, idx) {
                jqUnit.assertEquals("The contents for itemprop '" + itemprop + "' should be set correctly", content, propElms.eq(idx).attr("content"));
            });
        });
    };

    jqUnit.test("fluid.metadata.writer", function () {
        var elm1 = $("<div></div>");
        var elm2 = $("<div></div>");
        var type = "http://schema.org/Movie";
        var metadata = {
            accessMode: ["audio", "visual"],
            accessibilityFeature: ["captions"],
            keywords: ["sound effects", "dialog"],
            accessibilityHazard: "noFlashing"
        };

        fluid.metadata.writer(elm1, null, metadata);

        jqUnit.assertValue("An itemscope should have been added to the container", elm1.attr("itemscope"));
        jqUnit.assertFalse("No type attribute should have been added to the container", elm1.attr("itemtype"));
        assertMetaTags(elm1, 6, metadata);

        fluid.metadata.writer(elm2, type, metadata);

        jqUnit.assertValue("An itemscope should have been added to the container", elm2.attr("itemscope"));
        jqUnit.assertEquals("The type attribute should have been added to the container", type, elm2.attr("itemtype"));
        assertMetaTags(elm1, 6, metadata);

    });

})(jQuery);
