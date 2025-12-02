import { useState } from '@/hook/useState'

interface InitState {
    collapsed: boolean;
    submitLoading: boolean;
}

export const useHookData = () => {
    const { state } = useState<InitState>({
        collapsed: true,
        submitLoading: false,
    })

    return { state }
}