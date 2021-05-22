import React, { Component } from 'react'
import { message, Transfer } from 'antd';
import { reqUpdRoleAuths, reqGetRoleAuths } from '../../api'
import memoryUtils from '../../utils/memoryUtils'

/*
角色分配
 */
export default class roleForm extends Component {

    state = {
        mockData: [],
        targetKeys: []
    };

    componentDidMount() {
        this.getMock();
    }

    getMock = async () => {
        const targetKeys = [];
        const mockData = [];
        const roleId = this.props.roleId;
        const result = await reqGetRoleAuths(roleId);
        const allRoleList = result.data.allRoleList
        const existRoleList = result.data.existRoleList
        for (let i = 0; i < allRoleList.length; i++) {
            const data = {
                key: allRoleList[i].authId,
                title: allRoleList[i].authName,
                description: allRoleList[i].description,
            };
            for (let j = 0; j < existRoleList.length; j++) {
                if (allRoleList[i].authId === existRoleList[j].authId) {
                    targetKeys.push(data.key);
                }
            }
            mockData.push(data);
        }
        this.setState({ mockData, targetKeys });
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    handleChange = async (targetKeys) => {
        const roleId = this.props.roleId;
        const operator = memoryUtils.user.username;
        const result = await reqUpdRoleAuths(roleId, targetKeys, operator)
        message.success(result.msg)
        this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    render() {
        return (
            <div>
                <Transfer
                    dataSource={this.state.mockData}
                    showSearch
                    filterOption={this.filterOption}
                    targetKeys={this.state.targetKeys}
                    onChange={this.handleChange}
                    onSearch={this.handleSearch}
                    titles={['可赋权限', '已赋权限']}
                    render={item => item.title}
                    listStyle={{
                        width: 250,
                        height: 300,
                    }}
                    style={{ marginLeft: '50px' }}
                />
            </div>
        )
    }
}