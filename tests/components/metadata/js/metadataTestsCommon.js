/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    gpii.tests.findRendererSubcomponent = function (that, componentName) {
        return fluid.find(that, function (ignored, name) {
            if (name.indexOf(componentName) >= 0) {
                return true;
            }
        }) === true;
    };

    gpii.tests.checkRenderedVideoMetadataPanel = function (videoMetadataPanel) {
        jqUnit.assertDeepEq("The video default model has been set", fluid.defaults("gpii.metadata.defaultVideoModel").members.defaultModel, videoMetadataPanel.defaultModel);
        jqUnit.assertNotEquals("The video panel has been rendered", "", videoMetadataPanel.locate("videoPanel").html());
        jqUnit.assertNotEquals("The audio panel has been rendered", "", videoMetadataPanel.locate("audioPanel").html());
        jqUnit.assertNotEquals("The captions panel has been rendered", "", videoMetadataPanel.locate("captionsPanel").html());
    };

    gpii.tests.checkNotRenderedVideoMetadataPanel = function (videoMetadataPanel) {
        jqUnit.assertDeepEq("The video default model has been set", fluid.defaults("gpii.metadata.defaultVideoModel").members.defaultModel, videoMetadataPanel.defaultModel);
        jqUnit.assertFalse("The video panel has not been rendered", gpii.tests.findRendererSubcomponent(videoMetadataPanel, "renderer-videoPanel"));
        jqUnit.assertFalse("The video panel has not been rendered", gpii.tests.findRendererSubcomponent(videoMetadataPanel, "renderer-audioPanel"));
        jqUnit.assertFalse("The video panel has not been rendered", gpii.tests.findRendererSubcomponent(videoMetadataPanel, "renderer-captionsPanel"));
    };

})(jQuery, fluid);
