import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

//读取local中保存的user，如果有，就放到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;
//import 'antd/dist/antd.css'

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
    <App/>
    </ConfigProvider>,
    document.getElementById('root')
);
