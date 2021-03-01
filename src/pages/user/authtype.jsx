import React, {Component} from 'react'
import { message, Transfer } from 'antd';
import {reqGetAcctRoles, reqUpdAcctRoles} from '../../api'
import memoryUtils from '../../utils/memoryUtils'

/*
角色分配
 */
export default class AuthType extends Component {

    state = {
        mockData: [],
        targetKeys: []
      };

    componentDidMount() {
      this.getMock();
    }

    getMock = async() => {
        const targetKeys = [];
        const mockData = [];
        const username = this.props.authTypeusername;
        const result = await reqGetAcctRoles(username);
        const allRoleList = result.data.allRoleList
        const existRoleList = result.data.existRoleList
        for (let i = 0; i < allRoleList.length; i++) {
          const data = {
            key: allRoleList[i].roleId,
            title: allRoleList[i].roleName,
            description: allRoleList[i].description,
          };
          for(let j = 0; j < existRoleList.length; j++){
            if(allRoleList[i].roleId === existRoleList[j].roleId){
              targetKeys.push(data.key);
            }
          }
          mockData.push(data);
        }
        this.setState({ mockData, targetKeys });
      };
    
    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    handleChange = async (targetKeys) => {
      const username = this.props.authTypeusername;
      const operator = memoryUtils.user.username;
      const result = await reqUpdAcctRoles(username,targetKeys,operator)
      message.success(result.msg)
      this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
      console.log('search:', dir, value);
    };
    
    render(){
        return(
            <div>
                <Transfer
                    dataSource={this.state.mockData}
                    showSearch
                    filterOption={this.filterOption}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange}
                    onSearch={this.handleSearch}
                    titles={['可赋角色','已赋角色']}
                    render={item => item.title}
                    listStyle={{
                        width: 250,
                        height: 300,
                      }}
                    style={{marginLeft:'50px'}}
                />
            </div>
        )
    }
}