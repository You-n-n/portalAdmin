const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: 'home'
    },
    {
        title: '商品',
        key: '/products',
        icon: 'appstore',
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: 'bars'
            },
            {
                title: '商品管理',
                key: '/product',
                icon: 'tool'
            },
        ]
    },
    {
        title: '订单管理',
        key: '/order',
        icon: 'snippets',
        children: [
            {
                title: '订货单',
                key: '/order/orderForm',
                icon: 'plus-square'
            },
            {
                title: '退货单',
                key: '/order/returnForm',
                icon: 'minus-square'
            }
        ]
    },
    {
        title: '客户管理',
        key: '/customer',
        icon: 'team'
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'user'
    },
    {
        title: '角色管理',
        key: '/role',
        icon: 'safety',
    },
    {
        title: '操作日志',
        key: '/log',
        icon: 'solution',
    },

    {
        title: '图形图表',
        key: '/charts',
        icon: 'area-chart',
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: 'bar-chart'
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: 'line-chart'
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: 'pie-chart'
            }
        ]
    },
];
export default menuList;
