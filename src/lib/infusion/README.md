
The version of Infusion included in this folder was created using a custom build from commit

    1fcf03aae2b1b7cf2ec8d8905b49749916c1270d

of this branch

    https://github.com/amb26/infusion/tree/FLUID-3674

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
