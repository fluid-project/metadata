
The version of Infusion included in this folder was created using a custom build from commit

    1e55d55b4258c83fef7430226743c22aac5771a1

of the Infusion master branch

    https://github.com/amb26/infusion/tree/FLUID-5293

using the command line

grunt custom --source=true --include="tooltip, renderer, enhancement"

The following directories were stripped out of the build since they contain code that is included in the infusion-custom.js file:

    src/lib/infusion/components/
    src/lib/infusion/framework/
    src/lib/infusion/lib/fastXmlPull/
    src/lib/infusion/lib/jquery/core/
    src/lib/infusion/lib/jquery/ui/js/
