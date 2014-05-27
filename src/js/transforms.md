# Invertible Conditional Transform (fluid.metadata.transforms.condition) #

This is the accompanying documentation for transforms.js.

The current conditional transform (`fluid.transforms.condition`) provided in the infusion framework is not yet invertible. In order to accomplish the round-trip of the model relay system required by the development of the metadata editing tool with `fluid.transforms.condition`, `fluid.metadata.transforms.condition` is created to extend the framework built-in conditional transform (`fluid.transforms.condition`) to handle the inversion of certain conditional structures. Note that the implementation of `fluid.metadata.transforms.condition` is not generic enough to invert all the possible structures that may occur with fluid.transforms.condition. It is only able to handle limited structure scenarios where the true or false leafs contain a nested transformation using:

1. `fluid.transforms.literalValue`
2. `fluid.metadata.transforms.condition`

# Examples
## Invert A Simple One-level True or False leafs

The rule to be inverted:
```javascript
transform: {
    type: "fluid.metadata.transforms.condition",
    conditionPath: "hasHazard",
    "true": {
        transform: {
            type: "fluid.transforms.literalValue",
            value: "flashing",
            outputPath: "hazard"
        }
    },
    "false": {
        transform: {
            type: "fluid.transforms.literalValue",
            value: "noFlashing",
            outputPath: "hazard"
        }
    }
}
```

The inverted rule:
```javascript
transform: [{
    type: "fluid.transforms.valueMapper",
    inputPath: "hazard",
    options: {
        "flashing": {
            outputValue: {
                transform: [{
                    type: "fluid.transforms.literalValue",
                    value: true,
                    outputPath: "hasHazard"
                }]
            }
        },
        "noFlashing": {
            outputValue: {
                transform: [{
                    type: "fluid.transforms.literalValue",
                    value: false,
                    outputPath: "hasHazard"
                }]
            }
        }
    }
}]
```

## Invert Nested Conditional Transformations

The rule to be inverted:
```javascript
transform: {
    type: "fluid.metadata.transforms.condition",
    conditionPath: "audio",
    "true": {
        transform: {
            type: "fluid.metadata.transforms.condition",
            conditionPath: "sound",
            "true": {
                transform: {
                    type: "fluid.transforms.literalValue",
                    value: "available",
                    outputPath: "audio"
                }
            },
            "false": {
                transform: {
                    type: "fluid.transforms.literalValue",
                    value: "unknown",
                    outputPath: "audio"
                }
            }
        }
    },
    "false": {
        transform: {
            type: "fluid.metadata.transforms.condition",
            conditionPath: "nosoundHazard",
            "true": {
                transform: {
                    type: "fluid.transforms.literalValue",
                    value: "unavailable",
                    outputPath: "audio"
                }
            }
        }
    }
}
```

The inverted rule:
```javascript
transform: [{
    type: "fluid.transforms.valueMapper",
    inputPath: "audio",
    options: {
        "available": {
            "outputValue": {
                transform: [{
                    type: "fluid.transforms.literalValue",
                    value: true,
                    outputPath: "audio"
                }, {
                    type: "fluid.transforms.literalValue",
                    value: true,
                    outputPath: "sound"
                }]
            }
        },
        "unknown": {
            "outputValue": {
                transform: [{
                    type: "fluid.transforms.literalValue",
                    value: true,
                    outputPath: "audio"
                }, {
                    type: "fluid.transforms.literalValue",
                    value: false,
                    outputPath: "sound"
                }]
            }
        },
        "unavailable": {
            "outputValue": {
                transform: [{
                    type: "fluid.transforms.literalValue",
                    value: false,
                    outputPath: "audio"
                }, {
                    type: "fluid.transforms.literalValue",
                    value: true,
                    outputPath: "nosoundHazard"
                }]
            }
        }
    }
}]
```