/*!
Copyright 2013-2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.captionsPanelTests", {
        gradeNames: ["gpii.tests.resourceInputPanelTests", "autoInit"],
        components: {
            resourceInputPanel: {
                type: "gpii.metadata.captionsPanel",
                container: ".gpiic-captionsPanel"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.captionsPanelTests"
        ]);
    });

})(jQuery, fluid);
