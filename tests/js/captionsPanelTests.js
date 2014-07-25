/*!
Copyright 2013-2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.tests");

    fluid.defaults("fluid.tests.captionsPanelTests", {
        gradeNames: ["fluid.tests.resourceInputPanelTests", "autoInit"],
        components: {
            resourceInputPanel: {
                type: "fluid.metadata.captionsPanel",
                container: ".flc-captionsPanel"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.captionsPanelTests"
        ]);
    });

})(jQuery, fluid);
