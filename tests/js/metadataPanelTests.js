/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.tests");

    fluid.tests.createMetadataPanel = function (container, options) {
        var defaultOptions = {
            gradeNames: "fluid.metadata.videoMetadataPanel",
            videoPanelTemplate: "../../src/html/video-template.html",
            audioPanelTemplate: "../../src/html/audio-template.html",
            audioAttributesTemplate: "../../src/html/audio-attributes-template.html",
            captionsPanelTemplate: "../../src/html/captions-template.html",
            captionsInputTemplate: "../../src/html/captions-input-template.html"
        },
        opts = $.extend(true, {}, defaultOptions, options);

        return fluid.metadata.metadataPanel(container, opts);
    };

    jqUnit.asyncTest("Test metadata panel - Init", function () {
        fluid.tests.createMetadataPanel(".flc-metadataPanel", {
            listeners: {
                afterRender: function (that) {
                    jqUnit.expect(4);
                    fluid.tests.checkNotRenderedVideoMetadataPanel(that);
                    that.events.afterRender.removeListener("checkInit");
                    jqUnit.start();
                }
            }
        });
    });

    jqUnit.asyncTest("Test metadata panel - provide an video URL", function () {
        var that = fluid.tests.createMetadataPanel(".flc-metadataPanel");

        that.events.afterRender.addListener(function () {
            jqUnit.expect(4);
            fluid.tests.checkRenderedVideoMetadataPanel(that);
            that.events.afterRender.removeListener("checkRendered");
            jqUnit.start();
        }, "checkRendered", null, "last");

        that.setModel({
            url: "http://example.com/test.mp4"
        });
    });

})(jQuery, fluid);
