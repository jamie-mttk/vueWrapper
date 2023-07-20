import CompWrap from './vueWrapper/CompWrap.vue'
import { convertFlatConfig } from "./vueWrapper/compBaseUtil.ts";

//install
const install=app=>{
    app.component('CompWrap',CompWrap)
}
//
const WRAPPER={install}
//
export {CompWrap,convertFlatConfig}
export default WRAPPER
