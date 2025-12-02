interface LayoutTabItem {
    icon?: string;
    title: string;
    key: string;
    name: string;
}
interface LayoutTabState {
    tabs: Array<LayoutTabItem>;
}