
The version of Infusion included in this folder was created using a custom build from commit

    8890b03ab86de9328780dba20d19065b444cf0df

of the Infusion master branch

    https://github.com/fluid-project/infusion

using the command line

    ant -lib lib/rhino/ customBuild -Dinclude="tooltip, renderer" -DnoMinify="true"

The following directories were stripped out of the build since they contain code that is included in the MyInfusion.js file:

    src/lib/infusion/framework/
    src/lib/infusion/components/
    src/lib/infusion/lib/fastXmlPull/
    src/lib/infusion/lib/jquery/core/
    src/lib/infusion/lib/jquery/plugins/tooltip/js/
    src/lib/infusion/lib/jquery/ui/js/
