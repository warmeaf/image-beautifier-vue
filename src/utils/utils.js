import { UI_CONFIG } from '@constants/ui'
import { clsx } from 'clsx'
import { customAlphabet } from 'nanoid/non-secure'
import { twMerge } from 'tailwind-merge'

const NANOID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const NANOID_LENGTH = 7
const SVG_DATA_URL_HEADER = 'data:image/svg+xml,'
const DATA_URL_START = 'data'

/**
 * 检测是否为 Apple 设备
 * @returns {boolean} 是否为 Apple 设备
 */
export const isAppleDevice = () => {
  const platform = typeof navigator === 'object' ? navigator.platform : ''
  return /Mac|iPod|iPhone|iPad/.test(platform)
}

/**
 * 获取修饰键显示文本
 */
export const modKey = isAppleDevice() ? '⌘' : 'Ctrl'

/**
 * 合并 Tailwind CSS 类名
 * @param {...any} inputs - 类名输入
 * @returns {string} 合并后的类名
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * 支持的图片 MIME 类型
 */
export const supportImg = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif', 'image/webp']

/**
 * 加载图片
 * @param {string} src - 图片源地址
 * @returns {Promise<HTMLImageElement>} 图片元素
 */
export const getImage = (src) => {
  const img = new Image()
  if (!src.startsWith(DATA_URL_START)) {
    img.crossOrigin = 'Anonymous'
  }
  return new Promise((resolve, reject) => {
    const handleLoad = () => resolve(img)
    const handleError = () => reject(new Error('An error occurred attempting to load image'))
    img.onload = handleLoad
    img.onerror = handleError
    img.onabort = handleError
    img.src = src
  })
}

/**
 * 计算边距
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} ratio - 边距比例，默认 0.15
 * @returns {number} 边距值
 */
export const getMargin = (width, height, ratio = UI_CONFIG.MARGIN_RATIO) => {
  const min = Math.min(width, height)
  return Math.round(min * ratio)
}

/**
 * 将 SVG 字符串转换为 Data URL
 * @param {string} svgString - SVG 字符串
 * @returns {string} Data URL
 */
export const svgToDataURL = (svgString) => {
  const encoded = encodeURIComponent(svgString).replace(/'/g, '%27').replace(/"/g, '%22')
  return SVG_DATA_URL_HEADER + encoded
}

/**
 * 计算旋转后的矩形尺寸
 * @param {number} width - 原始宽度
 * @param {number} height - 原始高度
 * @param {number} angleDegrees - 旋转角度（度）
 * @returns {{width: number, height: number}} 旋转后的尺寸
 */
export const calculateRotatedRectDimensions = (width, height, angleDegrees) => {
  const angleRadians = angleDegrees * (Math.PI / 180)
  const newWidth =
    Math.abs(width * Math.cos(angleRadians)) + Math.abs(height * Math.sin(angleRadians))
  const newHeight =
    Math.abs(width * Math.sin(angleRadians)) + Math.abs(height * Math.cos(angleRadians))

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  }
}

/**
 * 测量文本尺寸
 * @param {string} text - 文本内容
 * @param {string} color - 文本颜色
 * @param {number} angleDegrees - 旋转角度
 * @returns {{width: number, height: number}} 文本尺寸
 */
const measureTextDimensions = (text, color, angleDegrees) => {
  const div = document.createElement('div')
  const lineHeight = UI_CONFIG.TEXT_SVG.LINE_HEIGHT
  div.style = `text-align:center;white-space:nowrap;line-height:${lineHeight}px;transform: rotate(${angleDegrees}deg);position: absolute;top:0;left:0;opacity: 0;`
  const span = document.createElement('span')
  span.style.color = color
  span.style.fontSize = `${UI_CONFIG.TEXT_SVG.FONT_SIZE}px`
  span.innerText = text
  div.append(span)
  document.body.append(div)
  const { width, height } = div.getBoundingClientRect()
  document.body.removeChild(div)
  return calculateRotatedRectDimensions(width, height, angleDegrees)
}

/**
 * 创建文本 SVG 的 HTML 内容
 * @param {string} text - 文本内容
 * @param {string} color - 文本颜色
 * @param {number} angleDegrees - 旋转角度
 * @param {number} height - 高度
 * @returns {string} HTML 内容
 */
const createTextSvgHtml = (text, color, angleDegrees, height) => {
  return `
      <div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;white-space:nowrap;line-height:${height}px;transform:rotate(${angleDegrees}deg);">
          <span style="color:${color};font-size:${UI_CONFIG.TEXT_SVG.FONT_SIZE}px;">${text}</span>
      </div>
  `
}

/**
 * 创建 SVG 元素
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {string} htmlContent - HTML 内容
 * @returns {string} SVG 字符串
 */
const createSvgElement = (width, height, htmlContent) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
              <foreignObject width="100%" height="100%">
                  ${htmlContent}
              </foreignObject>
          </svg>`
}

/**
 * 将文本转换为 SVG Data URL
 * @param {Object} options - 选项
 * @param {string} options.text - 文本内容
 * @param {string} options.color - 文本颜色
 * @param {number} options.angleDegrees - 旋转角度（度）
 * @returns {string} SVG Data URL
 */
export const text2Svg = ({ text, color, angleDegrees }) => {
  const dimensions = measureTextDimensions(text, color, angleDegrees)
  const htmlContent = createTextSvgHtml(text, color, angleDegrees, dimensions.height)
  const svgString = createSvgElement(dimensions.width, dimensions.height, htmlContent)
  return svgToDataURL(svgString)
}

/**
 * 触发文件下载
 * @param {string} url - 文件 URL
 * @param {string} filename - 文件名
 */
export const toDownloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style = `position: absolute; z-index: ${UI_CONFIG.DOWNLOAD_LINK_Z_INDEX}; visibility: none;`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 生成唯一 ID（7 位随机字符串）
 */
export const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH)

/**
 * 计算适配后的尺寸
 * @param {number} width - 原始宽度
 * @param {number} height - 原始高度
 * @param {number} maxWidth - 最大宽度，默认 950
 * @param {number} maxHeight - 最大高度，默认 450
 * @returns {{width: number, height: number}} 适配后的尺寸
 */
export const computedSize = (
  width,
  height,
  maxWidth = UI_CONFIG.MAX_DIMENSIONS.WIDTH,
  maxHeight = UI_CONFIG.MAX_DIMENSIONS.HEIGHT
) => {
  let adjustedWidth = width
  let adjustedHeight = height

  if (adjustedWidth > maxWidth) {
    adjustedHeight *= maxWidth / adjustedWidth
    adjustedWidth = maxWidth
  }

  if (adjustedHeight > maxHeight) {
    adjustedWidth *= maxHeight / adjustedHeight
    adjustedHeight = maxHeight
  }
  return {
    width: Math.round(adjustedWidth),
    height: Math.round(adjustedHeight),
  }
}

/**
 * 位置类型映射
 */
const POSITION_MAP = {
  'top-left': (_containerWidth, _containerHeight) => ({ x: 0, y: 0 }),
  top: (containerWidth, _containerHeight) => ({
    x: containerWidth / 2,
    y: 0,
  }),
  'top-right': (containerWidth, _containerHeight) => ({
    x: containerWidth,
    y: 0,
  }),
  left: (_containerWidth, containerHeight) => ({
    x: 0,
    y: containerHeight / 2,
  }),
  right: (containerWidth, containerHeight) => ({
    x: containerWidth,
    y: containerHeight / 2,
  }),
  'bottom-left': (_containerWidth, containerHeight) => ({
    x: 0,
    y: containerHeight,
  }),
  bottom: (containerWidth, containerHeight) => ({
    x: containerWidth / 2,
    y: containerHeight,
  }),
  'bottom-right': (containerWidth, containerHeight) => ({
    x: containerWidth,
    y: containerHeight,
  }),
}

/**
 * 根据位置类型获取坐标
 * @param {string} positionType - 位置类型：'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'
 * @param {number} containerWidth - 容器宽度
 * @param {number} containerHeight - 容器高度
 * @returns {{x: number, y: number}} 坐标位置
 */
export const getPosition = (positionType, containerWidth, containerHeight) => {
  const positionFn = POSITION_MAP[positionType]
  if (positionFn) {
    return positionFn(containerWidth, containerHeight)
  }
  // 默认居中
  return {
    x: containerWidth / 2,
    y: containerHeight / 2,
  }
}

/**
 * 创建数字 SVG
 * @param {number|string} number - 数字
 * @returns {string} SVG Data URL
 */
export const numSvg = (number) => {
  const viewBoxSize = UI_CONFIG.NUM_SVG.VIEWBOX_SIZE
  const lineHeight = UI_CONFIG.NUM_SVG.LINE_HEIGHT
  const fontSize = UI_CONFIG.NUM_SVG.FONT_SIZE
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;white-space:nowrap;line-height:${lineHeight}px;">
                        <span style="color:#ffffff;font-size:${fontSize}px;">${number}</span>
                    </div>
                </foreignObject>
            </svg>`
  return svgToDataURL(svgString)
}
