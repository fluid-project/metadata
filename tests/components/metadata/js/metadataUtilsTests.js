/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

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

    jqUnit.test("gpii.metadata.writer", function () {
        var elm1 = $("<div></div>");
        var elm2 = $("<div></div>");
        var options = {
            itemtype: gpii.metadata.itemtype.VIDEO_OBJECT,
            itemprop: "video"
        };
        var metadata = {
            accessMode: ["audio", "visual"],
            accessibilityFeature: ["captions"],
            keywords: ["sound effects", "dialog"],
            accessibilityHazard: "noFlashing"
        };

        gpii.metadata.writer(elm1, metadata);

        jqUnit.assertValue("An itemscope should have been added to the container", elm1.attr("itemscope"));
        jqUnit.assertFalse("No itemtype attribute should have been added to the container", elm1.attr("itemtype"));
        jqUnit.assertFalse("No itemprop attribute should have been added to the container", elm1.attr("itemprop"));
        assertMetaTags(elm1, 6, metadata);

        gpii.metadata.writer(elm2, metadata, options);

        jqUnit.assertValue("An itemscope should have been added to the container", elm2.attr("itemscope"));
        jqUnit.assertEquals("The itemtype attribute should have been added to the container", options.itemtype, elm2.attr("itemtype"));
        jqUnit.assertEquals("The itemprop attribute should have been added to the container", options.itemprop, elm2.attr("itemprop"));
        assertMetaTags(elm1, 6, metadata);

    });

})(jQuery, fluid);
