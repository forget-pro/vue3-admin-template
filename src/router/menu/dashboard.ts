

// 菜单路由配置项
export const MenuConfigOption: MenuConfigOption = {
    order: 0,
    menu: [
        {
            key: "/home",
            icon: "icon-[mdi--boom-gate-arrow-up]",
            label: "首页",
            meta: {
                auth: true,
                keepAlive: true,
            }
        },
        {
            key: "/tsx-demo",
            icon: "",
            label: "tsx示例",
            meta: {
                auth: true,
                keepAlive: true,
            }
        },
        {
            "key": "/dashboard",
            "icon": "icon-[mdi--overboard]",
            "label": "仪表盘",
            "children": [
                {
                    "label": "主控台",
                    "icon": "icon-[mdi--chart-sankey-variant]",
                    "key": "/dashboard/console",
                    meta: {
                        keepAlive: true,
                        custeom: true,
                    }

                },
                {
                    "label": "监控页",
                    "icon": "",
                    "key": "/dashboard/monitoring",
                    meta: {
                        keepAlive: true,
                    }
                },
                {
                    "label": "中台数据可视化",
                    "icon": "",
                    "key": "/monitoring",
                    "children": [
                        {
                            "label": "订单数据",
                            "icon": "",
                            "key": "/dashboard/order-data"
                        }
                    ]
                }
            ]
        }
    ]
}

export default MenuConfigOption