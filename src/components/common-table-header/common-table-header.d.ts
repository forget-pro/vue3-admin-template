declare interface TabCheckColumns {
    title: string | ((...args: any) => VNodeChild)
    key: string
    checked: boolean
    visible: boolean
}