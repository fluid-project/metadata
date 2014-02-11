
The version of Infusion included in this folder was created using a custom build from commit

    9b56b7588bd77d9fc117d3e7dc7e02311c2f3b2b

of the Infusion master branch

    https://github.com/fluid-project/infusion

using the command line

ant -lib lib/rhino/ customBuild -Dinclude="tooltip, renderer, preferences" -DnoMinify="true"

The following directories were stripped out of the build since they contain code that is included in the MyInfusion.js file:

    src/lib/infusion/components/
    src/lib/infusion/framework/
    src/lib/infusion/lib/fastXmlPull/
    src/lib/infusion/lib/fonts/
    src/lib/infusion/lib/jquery/core/
    src/lib/infusion/lib/jquery/plugins/
    src/lib/infusion/lib/jquery/ui/js/
    src/lib/infusion/lib/json/
