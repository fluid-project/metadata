
The version of Infusion included in this folder was created using a custom build from commit

    02650da7192f550edf6397fb02f10a25255c17d7

of the Infusion branch

    https://github.com/cindyli/infusion/tree/FLUID-5371-antranig
    (A merged branch of https://github.com/amb26/infusion/tree/FLUID-5371 and the infusion master branch)

using the command line

grunt custom --source=true --include="tooltip, renderer, preferences, tabs, overviewPanel"

The following directories were stripped out of the build since they contain code that is included in the infusion-custom.js file:

    src/lib/infusion/components/overviewPanel/js/
    src/lib/infusion/components/overviewPanel/overviewPanelDependencies.json
    src/lib/infusion/components/slidingPanel/
    src/lib/infusion/components/tableOfContents/
    src/lib/infusion/components/tabs/
    src/lib/infusion/components/textfieldSlider/
    src/lib/infusion/components/tooltip/
    src/lib/infusion/framework/
    src/lib/infusion/Infusion-LICENSE.txt
    src/lib/infusion/lib/fastXmlPull/
    src/lib/infusion/lib/jquery/core/
    src/lib/infusion/lib/jquery/jQuery-LICENSE.txt
    src/lib/infusion/lib/jquery/plugins/
    src/lib/infusion/lib/jquery/ui/jQueryUICoreDependencies.json
    src/lib/infusion/lib/jquery/ui/jQueryUIWidgetsDependencies.json
    src/lib/infusion/lib/jquery/ui/js/
    src/lib/infusion/lib/json/
    src/lib/infusion/README.md
    src/lib/infusion/ReleaseNotes.txt
