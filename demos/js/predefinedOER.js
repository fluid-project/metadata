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
        url: "http://www.youtube.com/watch?v=0jw74pfWfxA",
        content: '<section>\
            <h1>What is a Mammal? Answers from Ross MacPhee</h1>\
            <p>To bring you some basic facts about mammals, we interviewed Ross MacPhee, curator in the Department of Mammalogy of the American Museum of Natural History (AMNH). A paleomammalogist, he travels around the world studying mammals of the ancient past as well as those of today. In particular, MacPhee studies woolly mammoths, the not-so-distant relatives of our present-day elephants.</p>\
            <div class="pic">\
                <img src="http://beyondpenguins.ehe.osu.edu/files/2011/06/web_macphee.jpg" alt="Dr. Macphee"/>\
                <p>Dr. Ross MacPhee. Photo courtesy of Clare Fleming, AMNH.</p>\
            </div>\
            <p>For more on his research, be sure to read our article What Killed the Mammoths? Ross MacPhee Looks for Answers, also in this issue.</p>\
            <p>You can read excerpts of this interview here or listen to our accompanying podcasts that we’ve created in partnership with AMNH for you and your students. Or listen to excerpts in our podcasts.</p>\
        </section>\
\
        <section>\
            <h2>What is a mammal?</h2>\
            <p><strong>MacPhee</strong>: Mammals are a group of animals known as vertebrates: animals with backbones and four legs [tetrapods], whose young develop through a series of complex birth membranes. They are the only animals that have distinct characteristics of hair, feed from mother&#8217;s milk, and have three tiny bones that interpret sound into the brain.</p>\
            <p>You can also watch this podcast in <a href="http://www.youtube.com/watch?v=0jw74pfWfxA">YouTube</a>.</p>\
            <div class="mammals-video fl-videoPlayer"></div>\
        </section>\
\
        <section>\
            <h2>What kind of mammals do you find in the Arctic?</h2>\
            <p><strong>MacPhee</strong>: There aren’t that many completely distinctive Arctic animals when it comes to land mammals. They live in larger ranges beyond the Arctic. Some of the mammals that live in Arctic regions include large herbivores like musk ox and caribou; carnivores such as polar bears and arctic foxes; and smaller animals like arctic hares and other animals within rodent groups.</p>\
            <p>Sea mammals are very diverse. They consist of the whale family, which includes animals like porpoises and orcas; the seal group, consisting of walruses, sea lions, and ribbon seals.</p>\
            <section contentEditable="false"><div class="gpii-metadata-resourceEditor-insertVideo-placeHolder"><div class="gpii-metadata-resourceEditor-insertVideo-placeHolder-playCircle"><div class="gpii-metadata-resourceEditor-insertVideo-placeHolder-playTriangle"></div></div></div></section>\
        </section>\
\
        <section>\
            <h2>What about Antarctic mammals?</h2>\
            <p><strong>MacPhee</strong>: There are no land mammals in Antarctica and there haven&#8217;t been for at least 30 million years because the conditions are permanently cold, unlike the Arctic. Just like in the Arctic, the seas are home to seals, whales, and porpoises, but, of course, comprised of different species. Baleen whales rely on krill and plankton that they eat in great quantities in the ocean. Krill also serve as a rich food source for seals.</p>\
        </section>\
\
        <section>\
            <h2>What adaptations enable mammals to live in a polar environment?</h2>\
            <p><strong>MacPhee</strong>: One of the main ways that mammals adapt to the polar regions is through mechanisms providing insulation, such as fur, blubber, and an efficient circulatory system. For marine mammals, insulation is less of a problem than you may think. As long as they&#8217;re in water that&#8217;s not frozen at 32 degrees Fahrenheit [0 degrees Celsius], a few inches of blubber and fur patterning that is high in R-value [thermal resistance] are sufficient insulation to keep them warm.</p>\
            <p>On land, the extreme temperatures require that animals have other adaptations, one of the most significant ones being hibernation. Some mammals go into a true deep sleep while others go into what is known as estivation, reducing their activity in order to save their energy.</p>\
            <p>For example, female polar bears give birth while they hibernate. They dig a cave in the snow and stay there until their pups are born, providing a warm enclosure for them and reducing any need to depart from their pups into the early stages of their development after they&#8217;ve been born.</p>\
            <p>Smaller mammals like rodents usually stay active the entire winter. As the snow melts, you can see runways underneath where they feed on grass shoots or roots-anything preserved under the snow for them to eat.</p>\
            <div class="polar-adapt-video fl-videoPlayer"></div>\
            <p>You can also watch this podcast in <a href="http://www.youtube.com/watch?v=3_3p2ylZDAE">YouTube</a>.</p>\
            <p>Another way in which polar mammals survive is migration. This behavioral adaptation allows mammals to locate suitable feeding and breeding grounds. Both terrestrial mammals, such as caribou, and marine mammals, such as whales, migrate.</p>\
        </section>'
    };

})(jQuery, fluid_1_5);
