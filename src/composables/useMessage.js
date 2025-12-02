import { nanoid } from '@utils/utils'
import { MESSAGES } from '@constants/messages'

/**
 * 消息处理 composable
 * @param {Object} messageApi - Ant Design Vue 消息 API
 * @returns {Object} 消息处理方法
 */
export function useMessage(messageApi) {
  /**
   * 显示加载消息
   * @param {string} content - 消息内容
   * @returns {string} 消息 key
   */
  const showLoading = (content) => {
    const key = nanoid()
    messageApi.open({
      key,
      type: 'loading',
      content,
    })
    return key
  }

  /**
   * 显示成功消息
   * @param {string} key - 消息 key
   * @param {string} content - 消息内容
   */
  const showSuccess = (key, content) => {
    messageApi.open({
      key,
      type: 'success',
      content,
    })
  }

  /**
   * 显示错误消息
   * @param {string} key - 消息 key
   * @param {string} content - 消息内容
   */
  const showError = (key, content) => {
    messageApi.open({
      key,
      type: 'error',
      content,
    })
  }

  /**
   * 显示下载相关消息
   */
  const downloadMessages = {
    loading: () => showLoading(MESSAGES.DOWNLOAD.LOADING),
    success: (key) => showSuccess(key, MESSAGES.DOWNLOAD.SUCCESS),
    failed: (key) => showError(key, MESSAGES.DOWNLOAD.FAILED),
  }

  /**
   * 显示复制相关消息
   */
  const copyMessages = {
    loading: () => showLoading(MESSAGES.COPY.LOADING),
    success: (key) => showSuccess(key, MESSAGES.COPY.SUCCESS),
    failed: (key) => showError(key, MESSAGES.COPY.FAILED),
  }

  return {
    showLoading,
    showSuccess,
    showError,
    downloadMessages,
    copyMessages,
  }
}

