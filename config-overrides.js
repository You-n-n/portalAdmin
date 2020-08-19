/**
 * 用来按需打包
 */

 const {override, fixBabelImports, addLessLoader} = require('customize-cra')

 module.exports = override(
     // 针对antd实现按需打包: 根据import来打包(使用 babel-plugin-import)
     fixBabelImports('import', {
         libraryName: 'antd',
         libraryDirectory: 'es',
         style: true, //自动打包相关组件的样式
     }),

     //使用less-loader对源码中的less进行覆盖
     addLessLoader({
        javascriptEnable: true,
        modifyVars: {'@primary-color': '#1DA57A'},
     })
 );