interface IRouteState {
    isInitAuthRoute: boolean;
    removeRoutes: Array<() => void>;
    menus: MenuResponse[]; // 后端返回的原始菜单数据
    refreshRoute: boolean;
    menuTreeOption: MenuConfigItem[] // 本地完整的菜单树配置
    menuOptions: MenuOption[] // 用于菜单显示的数据（不含 meta）
    flattenMenus: Record<string, Omit<MenuConfigItem, 'children'>> // 扁平化后的菜单数据
    breadcrumbList: MenuOption[]
    firstMenuOption: MenuOption | null;
    // 开启后端鉴权路由
    enableBackendAuthRoute?: boolean;
    keepAlive: string[]; //需要缓存的路由
    maxCancheNum: number
}