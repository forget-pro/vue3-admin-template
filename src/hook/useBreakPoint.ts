import { useElementBounding } from '@vueuse/core'
import { breakpoints } from "@/config/setting"
export function useBreakPoint(target?: HTMLElement) {
    const { width: bodyWidth } = useElementBounding(target || window.document.body)
    const entries = Object.entries(breakpoints).sort((a, b) => a[1] - b[1])
    const currentPoint = computed(() => {
        let current = 'xs'
        const width = bodyWidth.value || document.body.clientWidth
        for (const [name, min] of entries) {
            if (width >= min) {
                current = name
            } else {
                break
            }
        }
        return current
    })


    return { currentPoint }
}