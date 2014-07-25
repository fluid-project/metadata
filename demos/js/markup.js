/*

Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* global markup_beauty */

(function ($, fluid) {
    "use strict";

    fluid.defaults("fluid.markup", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        invokers: {
            generateMarkup: {
                funcName: "fluid.markup.generate",
                args: ["{that}.model", "{that}.options.markup"],
                dynamic: true
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
        markup: {
            videoContainer: "<div></div>",
            captionsContainer: "<span></span>",
            contentContainer: "<article>%content</article>"
        }
    });

    fluid.markup.transformToVideoMetadata = function (metadata) {
        //TODO: Update to use model transformations framework
        var videoMetatdata = {
            accessMode: ["visual"],
            accessibilityHazard: [],
            accessibilityFeature: [],
            contentUrl: [metadata.url],
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
        if (metadata.captions && metadata.captions.length) {
            videoMetatdata.accessibilityFeature.push("captions");
        }
        if (metadata.flashing && metadata.flashing !== "unknown") {
            videoMetatdata.accessibilityHazard.push(metadata.flashing);
        }

        return videoMetatdata;
    };

    fluid.markup.generateVideoElm = function (metadata, videoContainerMarkup, captionsContainerMarkup, videoElm) {
        if (!videoElm) {
            videoElm = $("<video controls></video>");
            $("<source>").attr({
                src: metadata.url,
                type: "video/" + metadata.url.split(".").pop()
            }).appendTo(videoElm);
        }

        var videoContainer = $(videoContainerMarkup);
        fluid.metadata.writer(videoContainer, fluid.markup.transformToVideoMetadata(metadata), {
            itemprop: "video",
            itemtype: fluid.metadata.itemtype.VIDEO_OBJECT
        });
        fluid.each(metadata.captions, function (caption) {
            var captionContainer = $(captionsContainerMarkup);
            fluid.metadata.writer(captionContainer, {inLanguage: caption.language});
            $("<track>").attr({
                type: "captions",
                src: caption.src,
                srclang: caption.language
            }).appendTo(captionContainer);
            captionContainer.appendTo(videoElm);
        });
        videoContainer.append(videoElm);
        return videoContainer;
    };

    fluid.markup.addVideoMetadata = function (content, placeholderID, metadata, replacementMarkup) {
        metadata = metadata || {url: ""};
        var placeholder = content.find(placeholderID);
        var existingVideo = content.find("video");
        if (placeholder.length) {
            placeholder = placeholder.replaceWith(fluid.markup.generateVideoElm(metadata, replacementMarkup.videoContainer, replacementMarkup.captionsContainer));
        } else if (existingVideo.length) {
            existingVideo.replaceWith(fluid.markup.generateVideoElm(metadata, replacementMarkup.videoContainer, replacementMarkup.captionsContainer, existingVideo.clone()));
        }
    };

    fluid.markup.generate = function (model, replacementMarkup) {
        // Creating a jQuery element with the markup. The wrapping is to allow retrieving all of the relavent markup
        // later with a call to html()
        var content = $("<section>" + model.markup + "</section>");
        fluid.markup.addVideoMetadata(content, "#videoPlaceHolder", model.metadata, replacementMarkup);
        // the call to markup_beauty requires that textnodes be wrapped in a tag, or they will be stripped out.
        var markup = replacementMarkup.contentContainer ? fluid.stringTemplate(replacementMarkup.contentContainer, {content: content.html()}) : content.html();
        var formatted = markup_beauty({
            source: markup,
            force_indent: true,
            mode: "beautify",
            html: true
        });

        return formatted;
    };

})(jQuery, fluid);
