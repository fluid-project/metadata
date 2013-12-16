/*

Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($, fluid) {

    fluid.defaults("fluid.markupViewer", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        invokers: {
            update: {
                funcName: "fluid.markupViewer.update",
                args: ["{that}.container", "{that}.model"]
            },
            updateModelMarkup: {
                func: "{that}.applier.requestChange",
                args: ["markup", "{arguments}.0"]
            },
            updateModelMetadata: {
                func: "{that}.applier.requestChange",
                args: ["metadata", "{arguments}.0"]
            }
        },
        modelListeners: {
            "*": "{that}.update"
        },
        components: {
            dataSource: {
                type: "fluid.pouchdb.dataSource",
                options: {
                    databaseName: "simpleEditor",
                    listeners: {
                        "afterChange.fetchMarkup": {
                            listener: "{that}.get",
                            args: [{id: "markup"}, "{markupViewer}.updateModelMarkup"]
                        },
                        "afterChange.fetchMetadata": {
                            listener: "{that}.get",
                            args: [{id: "videoMetadata"}, "{markupViewer}.updateModelMetadata"]
                        }
                    }
                }
            }
        }
    });

    fluid.markupViewer.transformToVideoMetadata = function (metadata) {
        //TODO: Update to use model transformations framework
        var videoMetatdata = {
            accessMode: ["visual"],
            accessibilityHazard: [],
            accessibilityFeature: [],
            keywords: metadata.audioKeywords
        };

        if (metadata.audio && metadata.audio !== "unavailable") {
            videoMetatdata.accessMode.push("audio");
        }
        if (metadata.highContrast) {
            videoMetatdata.accessibilityFeature.push("highContrast");
        }
        if (metadata.signLanguage) {
            videoMetatdata.accessibilityFeature.push("signLanguage");
        }
        if (metadata.flashing && metadata.flashing !== "unknown") {
            videoMetatdata.accessibilityHazard.push(metadata.flashing);
        }

        return videoMetatdata;
    };

    fluid.markupViewer.replaceVideoPlaceholder = function (content, placeholderID, metadata) {
        metadata = metadata || {};
        var placeholder = content.find(placeholderID);
        if (placeholder.length) {
            var realMarkup = $("<div></div>");
            var videoElm = $('<video></video>');
            fluid.metadata.writer(realMarkup, fluid.markupViewer.transformToVideoMetadata(metadata), {
                itemprop: "video",
                itemtype: fluid.metadata.itemtype.VIDEO_OBJECT
            });
            $('<source itemprop="contentUrl">').attr({
                src: metadata.url,
                type: "video/" + metadata.url.split(".").pop()
            }).appendTo(videoElm);
            fluid.each(metadata.captions, function (caption) {
                var captionContainer = $("<span></span>");
                fluid.metadata.writer(captionContainer, {inLanguage: caption.language});
                $("<track>").attr({
                    type: "captions",
                    src: caption.src,
                    srclang: caption.language
                }).appendTo(captionContainer);
                captionContainer.appendTo(videoElm);
            });
            realMarkup.append(videoElm);
            placeholder = placeholder.replaceWith(realMarkup);
        }
    };

    fluid.markupViewer.update = function (elm, model) {
        var content = $("<section>" + model.markup + "</section>");
        fluid.markupViewer.replaceVideoPlaceholder(content, "#videoPlaceHolder", model.metadata);
        var markup = "<body>" + content.html() + "</body>";
        var formatted = markup_beauty({
            source: markup,
            force_indent: true,
            mode: "beautify",
            html: true
        });

        elm.text(formatted);
        elm.each(function(i, e) {hljs.highlightBlock(e);});
    };

})(jQuery, fluid);
