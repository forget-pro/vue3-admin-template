import type { DataTableColumns } from 'naive-ui'
import { useState } from './useState'

type UseTabOptions<ApiData> = {
    columns: () => DataTableColumns<ApiData>
}
// 单个列类型：就是数组元素类型
type AnyColumn<T> = DataTableColumns<T>[number]
interface IState {
    checkColumns: TabCheckColumns[]
}

const getColumnChecks = <T>(columns: DataTableColumns<T>): TabCheckColumns[] => {

    const checkeds: TabCheckColumns[] = []
    columns.forEach(item => {
        // 勾选选择列和展开列 不处理
        if ('key' in item) {
            checkeds.push({
                title: item.title!,
                key: item.key as string,
                checked: true,
                visible: true
            })
        } else {
            console.log(item, 23)
            checkeds.push({
                title: item.type || 'unknown',
                key: item.type || 'unknown',
                checked: true,
                visible: false
            })
        }

    })
    return checkeds
}

export const useTable = <ApiData>(options: UseTabOptions<ApiData>) => {

    const tableColumns = options.columns()

    const { state } = useState<IState>({
        checkColumns: getColumnChecks(tableColumns)
    })

    const columns = computed(() => {
        const columnMap = new Map<string, AnyColumn<ApiData>>();
        tableColumns.forEach(col => {
            if ('key' in col) {
                columnMap.set(col.key as string, col);
            } else {
                columnMap.set(col.type || 'unknown', col);
            }
        })
        return state.checkColumns.filter((item) => item.checked).map(check => columnMap.get(check.key)!)
    })



    return { columns, ...toRefs(state) }
}