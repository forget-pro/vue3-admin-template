interface MenuConfigItem {
    label: string;
    key: string;
    icon: string;
    children?: MenuConfigItem[];
    meta?: Record<string, any>;
}
interface MenuConfigOption {
    order?: number;
    menu: MenuConfigItem[]
}