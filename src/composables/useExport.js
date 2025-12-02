import { EXPORT_CONFIG } from '@constants/export'
import { toDownloadFile } from '@utils/utils'
import { ref } from 'vue'

/**
 * 导出功能 composable
 * @param {Object} editorStore - 编辑器 store
 * @param {Object} messageHandlers - 消息处理方法
 * @returns {Object} 导出相关方法和状态
 */
export function useExport(editorStore, messageHandlers) {
  const loading = ref(false)
  const pixelRatio = ref(EXPORT_CONFIG.PIXEL_RATIOS.ONE_X)
  const format = ref(EXPORT_CONFIG.DEFAULT_FORMAT)

  /**
   * 检查是否可以导出
   * @returns {boolean} 是否可以导出
   */
  const canExport = () => {
    if (!editorStore.checkEditingState()) {
      return false
    }
    if (loading.value) {
      return false
    }
    return true
  }

  /**
   * 生成文件名
   * @param {number} ratio - 像素比例
   * @param {string} fileFormat - 文件格式
   * @returns {string} 文件名
   */
  const generateFilename = (ratio, fileFormat) => {
    let filename = EXPORT_CONFIG.DEFAULT_FILENAME
    if (ratio > EXPORT_CONFIG.PIXEL_RATIOS.ONE_X) {
      filename += `@${ratio}`
    }
    return `${filename}.${fileFormat}`
  }

  /**
   * 获取导出选项
   * @param {string} exportFormat - 导出格式
   * @returns {Object} 导出选项
   */
  const getExportOptions = (exportFormat) => {
    const options = {
      pixelRatio: pixelRatio.value,
    }

    if (EXPORT_CONFIG.COMPRESSED_FORMATS.includes(exportFormat)) {
      options.quality = EXPORT_CONFIG.QUALITY
      options.fill = EXPORT_CONFIG.FILL_COLOR
    }

    return options
  }

  /**
   * 下载文件
   * @returns {Promise<void>}
   */
  const download = async () => {
    if (!canExport()) return

    const exportFormat = format.value
    const options = getExportOptions(exportFormat)
    const messageKey = messageHandlers.downloadMessages.loading()

    loading.value = true

    try {
      const result = await editorStore.app.tree.export(exportFormat, options)
      const filename = generateFilename(pixelRatio.value, exportFormat)
      toDownloadFile(result.data, filename)
      messageHandlers.downloadMessages.success(messageKey)
    } catch (error) {
      messageHandlers.downloadMessages.failed(messageKey)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 复制到剪贴板
   * @returns {Promise<void>}
   */
  const copyToClipboard = async () => {
    if (!canExport()) return

    const messageKey = messageHandlers.copyMessages.loading()
    loading.value = true

    try {
      const result = await editorStore.app.tree.export(EXPORT_CONFIG.FORMATS.PNG, {
        blob: true,
        pixelRatio: pixelRatio.value,
      })
      const { data } = result
      await navigator.clipboard.write([
        new ClipboardItem({
          [data.type]: data,
        }),
      ])
      messageHandlers.copyMessages.success(messageKey)
    } catch (error) {
      messageHandlers.copyMessages.failed(messageKey)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置格式
   * @param {string} newFormat - 新格式
   */
  const setFormat = (newFormat) => {
    format.value = newFormat
  }

  /**
   * 设置像素比例
   * @param {number} ratio - 像素比例
   */
  const setPixelRatio = (ratio) => {
    pixelRatio.value = ratio
  }

  return {
    loading,
    pixelRatio,
    format,
    download,
    copyToClipboard,
    setFormat,
    setPixelRatio,
  }
}
