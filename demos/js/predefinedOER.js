/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($, fluid) {

    fluid.registerNamespace("demo.metadata");

    demo.metadata.predefinedOER = {
        url: "https://archive.org/embed/2009FullYrColorizedGOESEastWeatherSatellite",
        content: '<p> Climate changes are underway in the United States and are projected to grow. </p> \
<p> Global temperature has increased over the past 50 years, primarily due to human behaviors that release \
heat-trapping gases, like carbon dioxide. </p>\
\
<p class="first"> Widespread climate-related impacts are occurring now and are expected to increase. </p>\
\
<p> Changes are happening in the United States, and elsewhere, but the impacts vary from region to region. \
These changes are affecting sectors of our society that cross regional boundaries. Already impacted are things \
that we depend upon; water, energy, transportation, agriculture, ecosystems, and human health. </p>\
\
<video width="480" controls>\
    <source src="https://archive.org/download/2009FullYrColorizedGOESEastWeatherSatellite/2009%20full%20yr%20colorized%20GOES%20East%20weather%20satellite.mp4" type="video/mp4">\
    <source src="https://archive.org/download/2009FullYrColorizedGOESEastWeatherSatellite/2009%20full%20yr%20colorized%20GOES%20East%20weather%20satellite.ogv" type="video/ogg">\
    Your browser does not support this video format or the video can not be found.\
</video>\
\
<p> Across the country, water is an issue. However, the specific impact is different from location to location. \
In some regions, particularly in the western United States, drought is an important issue. Less snow in the \
mountains is important in the West and Alaska where the snowpack stores water for later use. In the Midwest and \
northeastern states, the amount of heavy downpours has substantially increased over the past few decades. In \
most regions, floods and water quality problems are likely to be worse because of climate change. </p> \
<p> Agriculture is considered adaptable to changes in climate. However, changes, like increased temperatures, \
water stress, diseases, and weather extremes will create new challenges for food producers, upon which our society \
depends. </p>\
\
<p> Human health is likely to be affected by climate change. A changing environment will likely cause more heat \
stress, an increase in waterborne diseases, poor air quality, extreme weather events, and diseases transmitted by \
insects and rodents. Higher sea levels and storm surges will cause U.S. coastal areas to be at a greater risk of \
erosion and flooding. </p>\
\
<p class="first"> Future climate change and its impacts depend on choices made today. </p>\
\
<p> The amount of future climate change largely depends on the amount of heat-trapping gases released by humans. \
Lower releases of these gases will decrease the impact of climate change. However, unless substantially decrease d\
emissions the impacts are expected to become increasingly worse.</p>'
    };

})(jQuery, fluid_1_5);
