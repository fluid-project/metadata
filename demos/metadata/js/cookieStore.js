/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var demo = demo || {};

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("demo.metadata");

    fluid.defaults("demo.metadata.cookieStore", {
        gradeNames: ["fluid.cookieStore", "autoInit"],
        cookie: {
            name: "metadata-demo"
        },
        invokers: {
            resetCookie: {
                funcName: "demo.metadata.cookieStore.resetCookie",
                args: "{that}"
            }
        }
    });

    demo.metadata.cookieStore.resetCookie = function (that) {
        that.set({"showPanel": true});
    };

})(jQuery, fluid);
