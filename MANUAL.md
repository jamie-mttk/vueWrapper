# Developer Manual

## Installation

Run the below command to add vuewrapper into project

```sh
npm install vuewrapper -save
```

## Usage

You can import the component in main.js globally

```sh
import WRAPPER from 'vuewrapper'
//Create vue app
const app=createApp(App)
//Install CompWrap globally
app.use(WRAPPER)
```

Then CompWrap can be used anywhere

Or import when needed

```sh
import {CompWrap} from 'vuewrapper'
```

## Configuration

### General

We highly recommand to go through all the demos first and then read this manual.
The below introduction is based on [element plus](https://github.com/element-plus/element-plus). But this project can work with other component library as well.
The structure of the config is as below. Since version 0.3.0, flat format config is supported,please refer to proper chapter belo

```sh

{sys:{},
props:{},
slots:{},
events:{},
styles:{},
classes:[]
}

The configuration can be a JSON or funciton. If it is a funciton the parameter is the context described below and the return value should be the JSON described in this chapter.

```

### Context

"context" is used to for the config to interact with engine.
The context has the follow contents
|key     | description  |
|  ----  | ----         |
| props  |The value returned by calling [defineProps in vue3](https://vuejs.org/guide/components/props.html).  |
| emit   |The value returned by calling [defineEmits in vue3](https://vuejs.org/guide/components/events.html#event-arguments). |
| getRef | Refer to the getRef chapter below|

The context is used as the paramter in configuration and slot funciton.

### sys

The sys element is the system level configuration with the following properties:
|property       | description  |
|  ----         | ----  |
| component     | The base component. It can be a string(if it is already registerd) or imported component. The value is bind to component with [is attribute](https://vuejs.org/api/built-in-special-attributes.html#is).|
| modelValue    | Refer to v-model  |
| modelValuePath| Refer to v-model  |
| instanceKey   | Refer to getRef  |

#### v-model

If the base component has no v-model( for example e-row/el-col), then modelValue is not necessary to set.
There are three methods to set v-model

1. v-model is defined by a variable,just set the modelValue to that variable.  Refer to demo 'Concept' -  configInput2.

```sh
    const valueInput = ref("InitValue");

    modelValue: valueInput,
```

2. A wriable computed -  Refer to [vue3 manual](https://vuejs.org/guide/essentials/computed.html#writable-computed)

```sh
const valueInput = ref("InitValue");
//The below code equal to modelValue: valueInput,  just to demo how to use computed to set modelValue
modelValue: computed({
    get() {
    return valueInput.value
    },
    set(value) {
    valueInput.value=value
    }
}),
```

3. modelValue + modelValuePath, the typical use case is form. The form item value is a subset of form value.
Refer to demo 'Form' - formConfig1

```sh
sys: {
    component: "ElInput",
    //Use modelValuePath config modelValue
    modelValue: formValue,
    modelValuePath:'address',
},
```

Please note in the above example, config like ***modelValue: formValue.address*** does NOT work.

### props

The idea to use [v-bind](https://vuejs.org/api/built-in-directives.html#v-bind) to bind all the props to component.
So it is a JSON, the value can be any type. Below is a sample.

```sh
  props: {
    placeholder: "Please input value complex sample",
    clearable: true,
    prefixIcon: "Calendar",
    disabled: false,
    size: inputSize,
  },
  ```



### slots

#### Structure

The structure of slots is as below. slot1/slot2 is the slot name, and slot define 1/slot define 2 is described below


```sh
{slot1:slot define 1,
slot2:slot define 2,
...
}
```

#### Slot define

A slot define can be a JSON / shortcut / JSON array. JSON is the standard format of slot define which will be described later.The JSON array can be JSON or shortcut. Shortcut is kind of simplified configuration.
Shotcut can be the following types, they will be convert to standard JSON format automatically.

|Type                              | Converted to  |
|  ----                            | ----  |
| String                           | {type:'text',value:'xyz'} xyz is String of slot define|
| funciton                         | {type:'function',value:'xyz'} xyz is function of slot define|
| An object with no 'type' property| {type:'wrap',value:'xyz'} xyz is slot define|

#### Slot define JSON

It has two properties, one is key the other is value. The value is explained by key.
The value can be a array, the element of the array will be explained as the below table as well.

|key       | value  |
|  ----    | ----  |
| text     |{{value}} as vue Mustache syntax|
| html     |Insert as HTML with v-html directive  |
| component|Consider the value is a component,the slot parameter is set to the component with name slotPara  |
| function |Consider the value is function|
| wrap|Refer to slot define as a wrap|
| inherit|Expose the slot to parenet component. The slot name is the value if it is provided, otherwise use the original slot name|

#### Slot define as a wrap

The value can be a standard configuration as described in this manual, or it can be funciton which  return a standard configuration. The input argument of funtion is slot parameter, so the configuration can be generated by the input parameter.

#### Slot parameter

The slot parameter is a JSON with following properties.

|key       | value  |
|----      | ----  |
|slotDefine|Slot define as desribed above. It can be used to pass customized information from definition.|
|slotValue |The slot parameter  passed to the slot from parent component.|
|modelValue|The modelValue of the component|

#### Slot define as a function 

The function paramters are as below, the return value will be inserted as HTML
|parameter       | description  |
|  ----    | ----  |
| context  | Refer to context chapter|
| slotPara | Slot parameter described above|


### events

The structure of events is a JSON/JS object as below

```sh
{'event1':event handle1,
'event2':event handle2
...
}
```

Event handle can be configed as below. 

1. function  
It is a funciton, and function will be called. The function argements are same as the event parameters.
2. JSON with property 'type' is 'function' and property 'value' is a function  
Execute the function provided in property 'value'
3. JSON, the property 'type' is 'inherit'  
Emit the event to parent component. If the proerty 'value' is available, use it as the event name; otherwise use the orginal event name.

#### Restriction of event

Event modifiers are not supported.

### styles

```sh
const myColor = ref("#ffff00");


  styles: {
    backgroundColor: myColor,
    border: "5px solid red",
  },
```

### class

```sh
 classes: ["testClass2"],
```

#### Restriction of class

The classes should be imported globally.

### method [Removed]

The root base component can be called by 'callMethod', refer to demo 'Table'.  
The first argument is the method name, the other arguments are the argument of the method to be called.

```sh
mainRef1.value.callMethod('clearSelection')
```

#### Restriction of method

Only the root base component can be called.
A mechenism to call all the children componets is under design.


### getRef

A new configuration item named instanceKey is added under "sys". This key can be empty,the engine will automatically add a unique key.
Below is a example, some of the configurations are ignored.

```sh
    sys: {
      component: XXX,
      instanceKey:'key1'
    },
    slots:{
      "default":[{
        sys: {
          component: YYY,
          instanceKey:'key2'
      }},
      {    sys: {
        component: ZZZ,
        instanceKey:'key3'
      }}]
    }
```

So you could use the below code to get the element reference of component XXX,YYY,ZZZ. Please note the return value is NOT a ref, so no need to add ".value" after it to call method

```sh
  context.getRef('key1')  //Return the reference to XXX
  context.getRef('key2')  //Return the reference to YYY
  context.getRef('key3')  //Return the reference to ZZZ
```

And parameter of getRef is optional, it is not provided, the instanceKey of the current component your code write is used

### Flat format config

The config format described above may have multiple levels. The target of flat format is to reduce the hierachy levels.
The idea is to set a prefix to each segment per the below table.

|Segment       | Prefix  |
|----   | ----  |
|sys    |~,the exceptions are styles/classes|
|props  |none|
|slots  |#|
|events |@|
|styles |~styles|
|classes|~classes|

Refer to sample "Concept" and "Form" for more detail


## Release note

### v0.4.2 2023/4/12

1. Reactive property
The property can be reatived.
For example, the disabled property can be changed according to some other value.
It can be configured as this：

```sh
disabled: computed(()=>formValue.value.switch)
```
Please note it should be a computed.
#### v-show support

A new property "show" is added under sys. The value is a computed, it will be set to v-show.

```sh
show: computed(()=>formValue.value.switch)
```

#### modelValue name

A new property "modelValueName" is added under sys. It is used to set the v-model name if it is not modelValue.
