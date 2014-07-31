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

    var url = "http://a.test.url",
        defaultModel = {"default": "defaultValue"},
        inputModel = {"input": "inputValue"};

    fluid.tests.checkMetadataPanel = function (that, expectedModel, message) {
        jqUnit.assertDeepEq("The model is expected - " + message, expectedModel, that.model);
    };

    jqUnit.test("Test metadata panel - Standalone", function () {
        jqUnit.expect(2);

        var that = fluid.metadata.metadataPanel(".gpiic-metadataPanel-standalone");

        fluid.tests.checkMetadataPanel(that, {}, "Initializing a standalone");
        that.applier.change("url", url);
        fluid.tests.checkMetadataPanel(that, {url: url}, "Change URL in a standalone");
    });

    fluid.defaults("fluid.tests.metadataPanelAsGrade", {
        gradeNames: ["fluid.metadata.metadataPanel", "autoInit"],
        members: {
            defaultModel: defaultModel
        },
        inputModel: inputModel
    });

    jqUnit.test("Test metadata panel - Use as a grade", function () {
        jqUnit.expect(2);

        var that = fluid.tests.metadataPanelAsGrade(".gpiic-metadataPanel-grade");
        var expectedInitialModel = $.extend(true, null, defaultModel, inputModel);

        fluid.tests.checkMetadataPanel(that, expectedInitialModel, "Initializing a component that has the metadataPanel as a grade");
        that.applier.change("url", url);
        fluid.tests.checkMetadataPanel(that, $.extend(true, null, expectedInitialModel, {url: url}), "Change URL in a component that has the metadataPanel as a grade");
    });

})(jQuery, fluid);
