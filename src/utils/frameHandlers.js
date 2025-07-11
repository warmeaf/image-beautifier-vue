import { Rect } from 'leafer-ui'
import { DEVICE_INFO } from './deviceConfig'
import { DIMENSIONS, COLORS, ICON_OFFSETS, getBorderConfig } from './screenshotConstants'
import { computedSize } from './utils'
import macosIcon from '@utils/macosIcon'
import { windowDark, windowLight } from '@utils/windowsIcon'

/**
 * 处理简单边框框架
 * @param {Object} container - 容器对象
 * @param {string} frameType - 框架类型
 */
export const handleBorderFrame = (container, frameType) => {
  const config = getBorderConfig(frameType)
  container.strokeWidth = config.strokeWidth
  container.stroke = config.stroke
}

/**
 * 创建窗口栏元素
 * @param {string} frameType - 框架类型
 * @param {number} width - 宽度
 * @returns {Object} 窗口栏元素和布局信息
 */
export const createBarFrame = (frameType, width) => {
  const barUrlConfigs = {
    macosBarLight: {
      type: 'image',
      url: macosIcon,
      format: 'svg',
      mode: 'clip',
      offset: ICON_OFFSETS.MACOS
    },
    macosBarDark: {
      type: 'image',
      url: macosIcon,
      format: 'svg',
      mode: 'clip',
      offset: ICON_OFFSETS.MACOS
    },
    windowsBarLight: {
      type: 'image',
      url: windowDark,
      format: 'svg',
      mode: 'clip',
      offset: { x: width - DIMENSIONS.WINDOWS_ICON_OFFSET, y: 0 }
    },
    windowsBarDark: {
      type: 'image',
      url: windowLight,
      format: 'svg',
      mode: 'clip',
      offset: { x: width - DIMENSIONS.WINDOWS_ICON_OFFSET, y: 0 }
    }
  }

  const barConfig = barUrlConfigs[frameType] || barUrlConfigs.macosBarLight
  const isDark = frameType.includes('Dark')

  const bar = new Rect({
    x: 0,
    y: 0,
    height: DIMENSIONS.BAR_HEIGHT,
    width: width,
    fill: [
      {
        type: 'solid',
        color: isDark ? COLORS.BAR_DARK : COLORS.BAR_LIGHT
      },
      barConfig
    ]
  })

  return {
    bar,
    totalHeight: DIMENSIONS.BAR_HEIGHT,
    boxY: DIMENSIONS.BAR_HEIGHT,
    clearCornerRadius: true
  }
}

/**
 * 创建设备框架
 * @param {string} frameType - 框架类型
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @returns {Object} 设备框架元素和布局信息
 */
export const createDeviceFrame = (frameType, width, height) => {
  const device = DEVICE_INFO[frameType]
  if (!device) {
    throw new Error(`Unknown device frame type: ${frameType}`)
  }

  const bgSize = computedSize(
    device.dimensions.width,
    device.dimensions.height,
    width,
    height
  )

  const bar = new Rect({
    x: 0,
    y: 0,
    height,
    width,
    fill: [{
      type: 'image',
      url: device.image,
      align: 'center',
      mode: 'clip',
      size: {
        width: bgSize.width,
        height: bgSize.height
      }
    }]
  })

  const boxWidth = bgSize.width * device.ratios.horizontal
  const boxHeight = bgSize.height * device.ratios.vertical
  const boxX = (width - boxWidth) / 2
  const boxY = bgSize.height * device.ratios.top + (height - bgSize.height) / 2

  return {
    bar,
    boxWidth,
    boxHeight,
    boxX,
    boxY,
    clearShadow: true,
    cornerRadius: frameType === 'iphonepro' ? (bgSize.width * DIMENSIONS.IPHONE_CORNER_RATIO) : null
  }
}

/**
 * 框架处理器映射
 */
export const frameHandlers = {
  light: handleBorderFrame,
  dark: handleBorderFrame,
  macosBarLight: createBarFrame,
  macosBarDark: createBarFrame,
  windowsBarLight: createBarFrame,
  windowsBarDark: createBarFrame,
  macbookpro16: createDeviceFrame,
  macbookair: createDeviceFrame,
  imacpro: createDeviceFrame,
  ipadpro: createDeviceFrame,
  iphonepro: createDeviceFrame
}

/**
 * 处理框架样式
 * @param {string} frameType - 框架类型
 * @param {Object} params - 参数对象
 * @returns {Object|null} 处理结果
 */
export const handleFrameStyle = (frameType, params) => {
  const handler = frameHandlers[frameType]
  if (!handler) {
    return null
  }

  if (frameType === 'light' || frameType === 'dark') {
    handler(params.container, frameType)
    return null
  }

  return handler(frameType, params.width, params.height)
}