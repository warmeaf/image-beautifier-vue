import macbookpro16 from '@assets/macbook-pro-16.png'
import macbookair from '@assets/macbook-air.png'
import imacpro from '@assets/imac-pro.png'
import ipadpro from '@assets/ipadpro.png'
import iphonepro from '@assets/iphonepro.png'

/**
 * 设备配置信息
 * 包含各种设备的尺寸和比例信息
 */
export const DEVICE_INFO = {
  macbookpro16: {
    image: macbookpro16,
    dimensions: { width: 1920, height: 1266 },
    ratios: { horizontal: 4 / 5, vertical: 26 / 33, top: 7 / 66 }
  },
  macbookair: {
    image: macbookair,
    dimensions: { width: 1920, height: 1147 },
    ratios: { horizontal: 396 / 500, vertical: 258 / 299, top: 9 / 299 }
  },
  imacpro: {
    image: imacpro,
    dimensions: { width: 1920, height: 1599 },
    ratios: { horizontal: 112 / 125, vertical: 252 / 417, top: 29 / 417 }
  },
  ipadpro: {
    image: ipadpro,
    dimensions: { width: 1920, height: 1425 },
    ratios: { horizontal: 430 / 500, vertical: 302 / 372, top: 35 / 372 }
  },
  iphonepro: {
    image: iphonepro,
    dimensions: { width: 968, height: 1920 },
    ratios: { horizontal: 214 / 253, vertical: 462 / 500, top: 19 / 500 }
  }
}

/**
 * 检查是否为设备框架类型
 * @param {string} frameType - 框架类型
 * @returns {boolean}
 */
export const isDeviceFrame = (frameType) => {
  return Object.keys(DEVICE_INFO).includes(frameType)
}

/**
 * 检查是否为窗口栏框架类型
 * @param {string} frameType - 框架类型
 * @returns {boolean}
 */
export const isBarFrame = (frameType) => {
  return ['macosBarLight', 'macosBarDark', 'windowsBarLight', 'windowsBarDark'].includes(frameType)
}

/**
 * 检查是否为简单边框框架类型
 * @param {string} frameType - 框架类型
 * @returns {boolean}
 */
export const isBorderFrame = (frameType) => {
  return ['light', 'dark'].includes(frameType)
}