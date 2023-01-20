import CompWrap from './vueWrapper/CompWrap.vue'

//install
const install=app=>{
    app.component('CompWrap',CompWrap)
}
//
const WRAPPER={install}
//
export {CompWrap}
export default WRAPPER
