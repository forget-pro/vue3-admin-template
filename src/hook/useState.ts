export function useState<T extends object>(initialState: T) {
    const initial = structuredClone ? structuredClone(initialState) : { ...initialState }
    const state = reactive<T>({ ...initialState })

    const setState = (payload: Partial<T>) => {
        // 直接赋值，Vue 会自动处理相同值不触发更新的优化
        Object.keys(payload).forEach((key) => {
            const k = key as keyof T
            (state as T)[k] = payload[k] as T[keyof T]
        })
    }

    const resetState = () => {
        // 直接赋值，交给 Vue 处理
        Object.keys(initial).forEach((key) => {
            const k = key as keyof T
            (state as T)[k] = initial[k]
        })
    }

    // 重置具体属性的值
    const resetProperty = (key: keyof T) => {
        if (key in initial) {
            (state as T)[key] = initial[key]
        }
    }
    // 获取某个属性的初始值
    const getInitialValue = (key: keyof T): T[keyof T] | undefined => {
        return initial[key] || undefined
    }

    return {
        state,
        setState,
        resetState,
        resetProperty,
        initValue: initial,
        getInitialValue
    }
}
