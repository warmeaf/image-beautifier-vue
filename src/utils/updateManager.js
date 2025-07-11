import { watch } from 'vue'

/**
 * 创建安全的更新函数
 * @param {Function} updateFn - 更新函数
 * @param {Array} dependencies - 依赖项数组
 * @param {Function} createSnap - 创建快照函数
 * @returns {Function} 安全的更新函数
 */
export const createSafeUpdater = (updateFn, dependencies = [], createSnap) => {
  return () => {
    try {
      // 检查所有依赖项是否存在
      if (dependencies.length > 0 && dependencies.some(dep => !dep)) {
        return
      }
      
      updateFn()
      
      if (createSnap) {
        createSnap()
      }
    } catch (error) {
      console.error('Screenshot update error:', error)
    }
  }
}

/**
 * 批量注册监听器
 * @param {Array} watcherConfigs - 监听器配置数组
 */
export const setupWatchers = (watcherConfigs) => {
  watcherConfigs.forEach(({ source, handler, options = {} }) => {
    if (Array.isArray(source)) {
      watch(source, handler, options)
    } else {
      watch(source, handler, options)
    }
  })
}

/**
 * 创建监听器配置
 * @param {Function|Array} source - 监听源
 * @param {Function} handler - 处理函数
 * @param {Object} options - 选项
 * @returns {Object} 监听器配置
 */
export const createWatcherConfig = (source, handler, options = {}) => ({
  source,
  handler,
  options
})

/**
 * 批量执行初始化更新
 * @param {Array} updateFunctions - 更新函数数组
 */
export const executeInitialUpdates = (updateFunctions) => {
  updateFunctions.forEach(updateFn => {
    try {
      updateFn()
    } catch (error) {
      console.error('Initial update error:', error)
    }
  })
}

/**
 * 延迟执行函数
 * @param {Array} functions - 要执行的函数数组
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {number} 定时器ID
 */
export const delayedExecution = (functions, delay = 0) => {
  return setTimeout(() => {
    functions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('Delayed execution error:', error)
      }
    })
  }, delay)
}