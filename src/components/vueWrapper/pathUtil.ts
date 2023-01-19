//从data中获取指定path的值,如果没有值
export function getByPath(data:any,path:string){
    if (!path){
      return data
    }
    //
    let temp=data;
    //解析用.分开的路径
    let pathItems=path.split(".") ;
    for(let i=0;i<pathItems.length;i++){
      //
     // console.log(i+'==>'+pathItems[i]+'~~~'+JSON.stringify(temp))
      temp=temp[pathItems[i]]
      //console.log(JSON.stringify(temp))
      if(!temp){
        return undefined
      }
    }
    //
    return temp;
  }


  //根据路径path设置值value到data里
//force的意思是如果路径不符合条件(路径节点不是object)强行修改路径节点为object
export function setByPath(data: any, path: string, value: any,force=false) {
    if (!path) {
      //这个应该没用
      data = value
      //
      return data;
    }
    //
    //解析用.分开的路径
    let pathItems = path.split(".");
    let temp = data;
    for (let i = 0; i < pathItems.length; i++) {
      if (i == pathItems.length - 1) {
        //是最后节点,直接赋值
        temp[pathItems[i]] = value
        break;
      }
      if (!temp[pathItems[i]]) {
        //不存在创建路径节点
        temp[pathItems[i]] = {}
      }else{
        if (force && (typeof temp[pathItems[i]])!='object'){
          //这里检查路径上的所有节点是否是对象,如果不是强制修改为对象
          temp[pathItems[i]] = {}
        }
      }
  
      //
      temp = temp[pathItems[i]];
    }
  
    //
    return data;
  
  }

  //解析路径(路径多个部分之间通过.号)，返回第一部分以及剩余部分(没有返回undefined)
//以后可能需要考虑通过[]表示的
export function parsePathFirstItem(path:string){
  if (!path){
    return {}
  }
  let index=path.indexOf('.')
  if (index<0){
    //没有.
    return  {first:path}
  }
  //
  return {first:path.substring(0,index),remainder:path.substring(index+1)}
}