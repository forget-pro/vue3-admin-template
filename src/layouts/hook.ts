import { useState } from "@/hook/useState"

// 定义下拉菜单选项的类型
type DropdownOption = { label: string; key: MenuKey } | { type: 'divider' }

// 定义有效的菜单 key 类型
export type MenuKey = 'profile' | 'settings' | 'logout'

export type TabMenuKey = 'close' | 'close-other' | 'close-left' | 'close-right' | 'close-all'

export interface ILayoutState {
    collapsed: boolean,
    showContextMenu: boolean,
    userDropdownOptions: DropdownOption[]
}

export interface ILayoutContext {
    state: ILayoutState,
    handleDropdownSelect: (key: MenuKey) => void
}


export const useHookData = () => {

    const userDropdownOptions: DropdownOption[] = [
        { label: '个人资料', key: 'profile' },
        { label: '设置', key: 'settings' },
        { type: 'divider' },
        { label: '退出登录', key: 'logout' },
    ]

    const { state, setState } = useState<ILayoutState>({
        collapsed: false,
        showContextMenu: false,
        userDropdownOptions: userDropdownOptions,
    })

    const handleDropdownSelect = (key: MenuKey) => {
        // 处理下拉菜单选择逻辑
        const handleEvent: Record<MenuKey, () => void> = {
            'profile': () => {
                console.log('个人资料')
            },
            'settings': () => {
                console.log('设置')
            },
            'logout': () => {
                console.log('退出登录')
            }
        }
        handleEvent[key]()
    }

    return { state, setState, handleDropdownSelect }
}