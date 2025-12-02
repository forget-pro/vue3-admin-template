import { ref, computed, watch } from 'vue'
import { generate } from '@ant-design/colors'
import { colord, } from 'colord'
import type { AnyColor, RgbColor } from 'colord';

export default function useTheme() {
    const primaryColor = ref("#0958d9")

    const transformColorWithOpacity = (color: AnyColor, alpha: number, bgColor = '#ffffff') => {
        const originColor = colord(color).alpha(alpha).toHex();
        const { r: oR, g: oG, b: oB } = colord(originColor).toRgb();

        const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb();

        function calRgb(or: number, bg: number, al: number) {
            return bg + (or - bg) * al;
        }

        const resultRgb: RgbColor = {
            r: calRgb(oR, bgR, alpha),
            g: calRgb(oG, bgG, alpha),
            b: calRgb(oB, bgB, alpha)
        };

        return colord(resultRgb).toHex();
    }

    // 生成主题色调色板
    const themeColors = computed(() => {
        const colors = generate(primaryColor.value)
        const primaryColors = colors.findIndex(color => color.toLowerCase() === primaryColor.value.toLowerCase())
        const selectColors = colors.slice(primaryColors + 1)
        return {
            ColorHover: selectColors[0],
            ColorPressed: selectColors[1],
            palette: colors, // 完整的色板
        }
    })

    // 监听主题色变化，更新 CSS 变量（适配 Tailwind v4）
    watch(themeColors, (colors) => {
        const root = document.documentElement
        const palette = colors.palette
        console.log(palette, 44)
        const mixPrimaryColor = transformColorWithOpacity(primaryColor.value, 0.1)
        palette.forEach((color, index) => {
            root.style.setProperty(`--color-primary-${(index + 1) * 100}`, color)
        })
        root.style.setProperty(`--color-mix-primary`, mixPrimaryColor)
    }, { immediate: true })

    return {
        primaryColor,
        themeOverrides: {
            common: {
                primaryColor: primaryColor.value,
                primaryColorHover: themeColors.value.ColorHover,
                primaryColorPressed: themeColors.value.ColorPressed,
                primaryColorSuppl: primaryColor.value,
                borderRadius: "4px",
            }
        },
        themeColors,
    }
}