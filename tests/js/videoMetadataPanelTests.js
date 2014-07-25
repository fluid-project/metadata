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

    jqUnit.asyncTest("Test video metadata panel - with URL", function () {
        fluid.metadata.videoMetadataPanel(".gpiic-videoMetadataPanel-withURL", {
            renderOnInit: true,
            model: {
                url: "http://example.com/test.mp4"
            },
            videoPanelTemplate: "../../src/html/video-template.html",
            audioPanelTemplate: "../../src/html/audio-template.html",
            audioAttributesTemplate: "../../src/html/audio-attributes-template.html",
            captionsPanelTemplate: "../../src/html/resourceInputPanel-template.html",
            captionsInputTemplate: "../../src/html/resourceInput-template.html",
            listeners: {
                afterSubpanelsRendered: function (that) {
                    jqUnit.expect(4);

                    fluid.tests.checkRenderedVideoMetadataPanel(that);

                    jqUnit.start();
                }
            }
        });
    });

    fluid.tests.findRendererSubcomponent = function (that, componentName) {
        return fluid.find(that, function (ignored, name) {
            if (name.indexOf(componentName) >= 0) {
                return true;
            }
        }) === true;
    };

    jqUnit.asyncTest("Test video metadata panel - without URL", function () {
        fluid.metadata.videoMetadataPanel(".gpiic-videoMetadataPanel-noURL", {
            renderOnInit: true,
            videoPanelTemplate: "../../src/html/video-template.html",
            audioPanelTemplate: "../../src/html/audio-template.html",
            audioAttributesTemplate: "../../src/html/audio-attributes-template.html",
            captionsPanelTemplate: "../../src/html/resourceInputPanel-template.html",
            captionsInputTemplate: "../../src/html/resourceInput-template.html",
            listeners: {
                afterRender: function (that) {
                    jqUnit.expect(4);

                    fluid.tests.checkNotRenderedVideoMetadataPanel(that);

                    jqUnit.start();
                }
            }
        });
    });

})(jQuery, fluid);
