/*!
Copyright 2014 OCAD University

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

    fluid.tests.createMetadataPanel = function (container, options) {
        var defaultOptions = {
            videoPanelTemplate: "../../src/html/video-template.html",
            audioPanelTemplate: "../../src/html/audio-template.html",
            audioAttributesTemplate: "../../src/html/audio-attributes-template.html",
            captionsPanelTemplate: "../../src/html/resourceInputPanel-template.html",
            captionsInputTemplate: "../../src/html/resourceInput-template.html"
        },
        opts = $.extend(true, {}, defaultOptions, options);

        return fluid.metadata.videoMetadataPanel(container, opts);
    };

    jqUnit.asyncTest("Test metadata panel - Init", function () {
        fluid.tests.createMetadataPanel(".gpiic-metadataPanel-init", {
            listeners: {
                afterSubpanelsRendered: function (that) {
                    jqUnit.expect(4);
                    fluid.tests.checkNotRenderedVideoMetadataPanel(that);
                    that.events.afterSubpanelsRendered.removeListener("checkInit");
                    jqUnit.start();
                }
            }
        });
    });

    jqUnit.asyncTest("Test metadata panel - provide an video URL", function () {
        var that = fluid.tests.createMetadataPanel(".gpiic-metadataPanel-with-url");

        that.events.afterSubpanelsRendered.addListener(function () {
            jqUnit.expect(4);
            fluid.tests.checkRenderedVideoMetadataPanel(that);
            that.events.afterSubpanelsRendered.removeListener("checkRendered");
            jqUnit.start();
        }, "checkRendered", null, "last");

        that.applier.change("url", "http://example.com/test.mp4");
    });

})(jQuery);
