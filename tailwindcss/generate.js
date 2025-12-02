// 最小10px，最大48px，间隔2px
export const generateFontSize = () => {
  const fontObj = {}
  for (let i = 10; i <= 48; i += 2) {
    fontObj[i] = i + 'px'
  }
  return fontObj
}

// 生成间距
export const generateSpacing = () => {
  const spacingObj = {}
  for (let i = 0; i <= 64; i += 2) {
    spacingObj[i] = i + 'px'
  }
  return spacingObj
}

// 生成透明度
export const generateOpacity = () => {
  const opacityObj = {}
  for (let i = 0; i <= 100; i += 5) {
    opacityObj[i] = i / 100
  }
  return opacityObj
}

// 生成圆角
export const generateBorderRadius = () => {
  const borderRadiusObj = {}
  for (let i = 0; i <= 50; i += 2) {
    borderRadiusObj[i] = i + 'px'
  }
  return borderRadiusObj
}

// 设置自定义层级
export const generateZIndex = () => {
  const zindexObj = {}
  for (let index = 0; index <= 100; index += 10) {
    zindexObj[index] = index
  }
  return zindexObj
}

export const tailwindMergeVars = {
  fontSize: generateFontSize(),
  spacing: generateSpacing(),
  opacity: generateOpacity(),
  borderRadius: generateBorderRadius(),
  zIndex: generateZIndex(),
}
