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
            videoPanelTemplate: "../../../../src/components/metadata/html/video-template.html",
            audioPanelTemplate: "../../../../src/components/metadata/html/audio-template.html",
            audioAttributesTemplate: "../../../../src/components/metadata/html/audio-attributes-template.html",
            captionsPanelTemplate: "../../../../src/components/metadata/html/resourceInputPanel-template.html",
            captionsInputTemplate: "../../../../src/components/metadata/html/resourceInput-template.html"
        },
        opts = $.extend(true, {}, defaultOptions, options);

        return gpii.metadata.videoMetadataPanel(container, opts);
    };

    jqUnit.asyncTest("Test metadata panel - Init", function () {
        fluid.tests.createMetadataPanel(".gpiic-metadataPanel-init", {
            listeners: {
                afterSubpanelsRendered: function (that) {
                    jqUnit.expect(4);
                    fluid.tests.checkNotRenderedVideoMetadataPanel(that);
                    jqUnit.start();
                }
            }
        });
    });

    jqUnit.asyncTest("Test metadata panel - provide an video URL", function () {
        fluid.tests.createMetadataPanel(".gpiic-metadataPanel-with-url", {
            listeners: {
                onCreate: {
                    listener: function (that) {
                        that.applier.change("url", "http://example.com/test.mp4");
                    },
                    priority: "last"
                },
                afterSubpanelsRendered: function (that) {
                    jqUnit.expect(4);
                    fluid.tests.checkRenderedVideoMetadataPanel(that);
                    jqUnit.start();
                }
            }
        });
    });

})(jQuery, fluid);
