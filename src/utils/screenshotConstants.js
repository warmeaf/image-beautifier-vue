/**
 * Screenshot组件相关常量配置
 */

// 尺寸常量
export const DIMENSIONS = {
  BAR_HEIGHT: 32,
  STROKE_WIDTH: 8,
  IMAGE_OFFSET: 2, // 解决缝隙问题的偏移量
  WINDOWS_ICON_OFFSET: 105,
  IPHONE_CORNER_RATIO: 0.1
}

// 阴影配置
export const SHADOW_CONFIG = {
  MULTIPLIER: { x: 4, y: 4, blur: 3 },
  COLOR: '#00000045'
}

// 颜色配置
export const COLORS = {
  TRANSPARENT: '#ffffff00',
  LIGHT_STROKE: '#ffffff80',
  DARK_STROKE: '#00000050',
  BAR_LIGHT: '#ffffff',
  BAR_DARK: '#3a3a3b'
}

// 时间配置
export const TIMING = {
  DEBOUNCE_DELAY: 100,
  SCALE_UPDATE_DELAY: 0
}

// 图标偏移配置
export const ICON_OFFSETS = {
  MACOS: { x: 10, y: 0 }
}

/**
 * 生成阴影配置对象
 * @param {number} shadow - 阴影大小
 * @returns {Object|null} 阴影配置对象或null
 */
export const createShadowConfig = (shadow) => {
  if (shadow === 0) return null
  
  return {
    x: shadow * SHADOW_CONFIG.MULTIPLIER.x,
    y: shadow * SHADOW_CONFIG.MULTIPLIER.y,
    blur: shadow * SHADOW_CONFIG.MULTIPLIER.blur,
    color: SHADOW_CONFIG.COLOR,
    box: true
  }
}

/**
 * 获取边框配置
 * @param {string} frameType - 框架类型
 * @returns {Object} 边框配置
 */
export const getBorderConfig = (frameType) => {
  const configs = {
    light: {
      strokeWidth: DIMENSIONS.STROKE_WIDTH,
      stroke: COLORS.LIGHT_STROKE
    },
    dark: {
      strokeWidth: DIMENSIONS.STROKE_WIDTH,
      stroke: COLORS.DARK_STROKE
    }
  }
  
  return configs[frameType] || { strokeWidth: null, stroke: null }
}