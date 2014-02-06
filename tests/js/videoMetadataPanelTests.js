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

    jqUnit.asyncTest("Test video metadata panel - with URL", function () {
        fluid.metadata.videoMetadataPanel(".flc-videoMetadataPanel", {
            renderOnInit: true,
            // model: {
            //     url: "http://example.com/test.mp4"
            // },
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

})(jQuery);
