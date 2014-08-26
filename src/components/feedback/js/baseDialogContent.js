/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("gpii.metadata.feedback");

    /*
     * The base grade component for all components that render dialog content.
     */
    fluid.defaults("gpii.metadata.feedback.baseDialogContent", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        renderOnInit: true
    });

})(jQuery, fluid);
