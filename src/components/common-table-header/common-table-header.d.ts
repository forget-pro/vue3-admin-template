declare global {
    interface TabCheckColumns {
        title: string | ((...args: unknown) => VNodeChild)
        key: string
        checked: boolean
        visible: boolean
    }
}

export { }