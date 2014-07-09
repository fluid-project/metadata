The version of Infusion included in this folder was created using a custom build from [Infusion 1.5](https://github.com/fluid-project/infusion/tree/infusion-1.5).

```
    grunt custom --source=true --include="tooltip, uiOptions, tabs, overviewPanel"
```

The following directories were stripped out of the build since they contain code that is included in the infusion-custom.js file or is not required:

* src/lib/infusion/components/overviewPanel/js/
* src/lib/infusion/components/overviewPanel/overviewPanelDependencies.json
* src/lib/infusion/components/slidingPanel/
* src/lib/infusion/components/tableOfContents/js/
* src/lib/infusion/components/tableOfContents/tableOfContentsDependencies.json
* src/lib/infusion/components/tabs/
* src/lib/infusion/components/textfieldSlider/
* src/lib/infusion/components/tooltip/
* src/lib/infusion/components/uiOptions/
* src/lib/infusion/framework/core/
* src/lib/infusion/framework/enhancement/
* src/lib/infusion/framework/fss/
* src/lib/infusion/framework/preferences/js/
* src/lib/infusion/framework/preferences/preferencesDependencies.json
* src/lib/infusion/framework/renderer/
* src/lib/infusion/lib/fastXmlPull/
* src/lib/infusion/lib/jquery/core/
* src/lib/infusion/lib/jquery/plugins/
* src/lib/infusion/lib/jquery/ui/jQueryUICoreDependencies.json
* src/lib/infusion/lib/jquery/ui/jQueryUIWidgetsDependencies.json
* src/lib/infusion/lib/jquery/ui/js/
* src/lib/infusion/lib/json/
* README.md