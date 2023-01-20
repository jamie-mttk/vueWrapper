# vueWrapper

## What is it?

This project implement Vue3 component with pure Javascript instead of Single-File Component(SFC).
The target of this project to find an alternative way of warpping vue3 component. and  coudl work with SFC together.

Generally a vue component includes tempalte/v-model/props/event/slot/method, this project will try to convert them to script with the same functionalities.

## Quick start

The demo project is avalibale [demo](https://github.com/jamie-mttk/vueWrapper).Please try the samples one by one.

## Project preview

A live preview of the demo project is available [here](https://melodic-genie-43244a.netlify.app/)

## Demo project Setup

Fork the demo project and then install with the below commands.

```sh
npm install
npm run dev
```

## Configuration

This project render vue compent from a JSON-like object. 
Below is sample config to render a element plus input.

```sh
export const valueInput = ref("InitValue");

//A simple input configuration
export const configInput1 = reactive({
  sys: {
    //
    component: "ElInput",
    modelValue: valueInput,
  },
  props: {
    placeholder: "Please input value",
    clearable: true,
  },
  slots: {},
  events: {},
});
```

Then use CompWrap to render

```sh
<CompWrap :config="configInput1"></CompWrap>
```

The configuration manual is available [here](MANUAL.md).

## Benifit

SFC includes template/script and style, but these three parts are different during coding stage.
My idea is to use pure script(javascript/typescript) to warpping a component. Script is eary to combine/transform/resue so more flexiblity could be gain. For example to add a table component into page, reuse SFC means to add a el-table and config el-column one by  one, the code is long and mixed with template/script; by using project, a simple pice of JS is enough.

And in the real project we may not care about all the features of the component, so configuration could be simplified and then use a piece of translator code to generate the config of the standard format. Refer to sample table/form/app1 for more detail. In a real project,normally 80% pages are similiar or they could be summarized into several templates. So we could define the  variable into a config file, and then render the page according to the configuration.

And this project can also be a fundamental technology of low code platform.

## Restriction

Type script is not well supported.
Some Vue 3 features can not not supported,refer to configuration manual for more detail.
