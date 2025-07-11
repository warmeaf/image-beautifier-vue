import { defineComponent, onUnmounted, reactive, computed, h } from 'vue'
import { Box, Rect } from 'leafer-ui'
import { debounce } from 'lodash-es'

import stores from '@stores/index'
import { computedSize, getPosition, getMargin } from '@utils/utils'
import { isDeviceFrame, isBarFrame } from '@utils/deviceConfig'
import { DIMENSIONS, COLORS, TIMING, createShadowConfig } from '@utils/screenshotConstants'
import { handleFrameStyle } from '@utils/frameHandlers'
import {
  createSafeUpdater,
  setupWatchers,
  createWatcherConfig,
  executeInitialUpdates,
  delayedExecution
} from '@utils/updateManager'

export default defineComponent({
  setup() {
    const editorStore = stores.useEditorStore()
    const optionStore = stores.useOptionStore()
    
    // 使用响应式对象管理组件状态
    const state = reactive({
      timer: null,
      bar: null,
      image: null,
      box: null,
      container: null
    })
    
    const createSnap = debounce(() => {
      editorStore.createSnap('update')
    }, TIMING.DEBOUNCE_DELAY)
    
    // 计算属性：尺寸配置
    const computedDimensions = computed(() => {
      const { img, frameConf } = optionStore
      const margin = getMargin(frameConf.width, frameConf.height)
      return computedSize(
        img.width,
        img.height,
        frameConf.width - margin,
        frameConf.height - margin
      )
    })
    
    // 计算属性：阴影配置
    const shadowConfig = computed(() => {
      const { shadow } = optionStore
      return optionStore.frame === 'macbookpro16' ? null : createShadowConfig(shadow)
    })

    // 初始化元素
    const initializeElements = () => {
      state.image = new Rect({
        origin: 'center'
      })
      
      state.box = new Box({
        overflow: 'hide',
        children: [state.image]
      })
      
      state.container = new Box({
        id: 'screenshot-box',
        overflow: 'hide',
        strokeAlign: 'outside',
        scale: 1,
        fill: COLORS.TRANSPARENT,
        children: [state.box]
      })
      
      editorStore.getFrame?.add(state.container)
    }
    
    initializeElements()

    // 更新函数：图像填充
    const updateImageFill = createSafeUpdater(() => {
      state.image.fill = {
        type: 'image',
        url: optionStore.img.src,
        align: optionStore.mode === 'fit' ? 'center' : 'top',
        mode: optionStore.mode
      }
    }, [state.image], createSnap)
    
    // 更新函数：内边距
    const updatePadding = createSafeUpdater(() => {
      if (optionStore.padding === 0 && !isDeviceFrame(optionStore.frame)) {
        state.box.fill = COLORS.TRANSPARENT
      } else {
        state.box.fill = optionStore.paddingBg
      }
    }, [state.box], createSnap)
    
    // 更新函数：圆角
    const updateRound = createSafeUpdater(() => {
      const { round } = optionStore
      state.container.cornerRadius = round
      if (!state.bar || isDeviceFrame(optionStore.frame)) {
        state.image.cornerRadius = round
      }
    }, [state.container, state.image], createSnap)
    
    // 更新函数：阴影
    const updateShadow = createSafeUpdater(() => {
      state.container.shadow = shadowConfig.value
    }, [state.container], createSnap)
    
    // 更新函数：缩放
    const updateScale = createSafeUpdater(() => {
      state.container.scale = optionStore.scale
    }, [state.container], createSnap)
    
    // 更新函数：图像源
    const updateImageSource = () => {
      if (!state.image) return
      state.image.url = optionStore.img.src
      updateImageFill()
    }
    
    // 更新函数：X轴翻转
    const applyHorizontalFlip = createSafeUpdater(() => {
      state.image.scaleX = optionStore.scaleX ? -1 : 1
    }, [state.image], createSnap)
    
    // 更新函数：Y轴翻转
    const applyVerticalFlip = createSafeUpdater(() => {
      state.image.scaleY = optionStore.scaleY ? -1 : 1
    }, [state.image], createSnap)

    // 清理框架样式
    const clearFrameStyles = (round, shadow) => {
      state.container.strokeWidth = null
      state.container.stroke = null
      state.bar?.remove()
      state.bar = null
      state.box.cornerRadius = null
      state.image.cornerRadius = round
      state.container.cornerRadius = round
      state.container.shadow = createShadowConfig(shadow)
    }
    // 更新框架设置
    const updateFrameSettings = createSafeUpdater(() => {
      const { align, frame, frameConf, shadow, round, padding } = optionStore
      const { width, height } = computedDimensions.value
      
      let totalHeight = height
      let boxX = 0
      let boxY = 0
      let boxWidth = width
      let boxHeight = height

      clearFrameStyles(round, shadow)

      // 使用框架处理器处理不同类型的框架
      const frameResult = handleFrameStyle(frame, {
        container: state.container,
        width,
        height
      })

      if (frameResult) {
        state.bar = frameResult.bar
        
        if (isBarFrame(frame)) {
          totalHeight += frameResult.totalHeight
          boxY = frameResult.boxY
          state.container.addAfter(state.bar, state.box)
          if (frameResult.clearCornerRadius) {
            state.box.cornerRadius = null
            state.image.cornerRadius = null
          }
        } else if (isDeviceFrame(frame)) {
          boxWidth = frameResult.boxWidth
          boxHeight = frameResult.boxHeight
          boxX = frameResult.boxX
          boxY = frameResult.boxY
          state.container.addAfter(state.bar, state.box)
          
          if (frameResult.clearShadow) {
            state.container.shadow = null
          }
          if (frameResult.cornerRadius !== undefined) {
            state.box.cornerRadius = frameResult.cornerRadius
          }
        }
      }

      // 设置位置和尺寸
      const { x, y } = getPosition(
        align,
        frameConf.width - width,
        frameConf.height - totalHeight
      )
      
      // 应用容器配置
      Object.assign(state.container, {
        width,
        height: totalHeight,
        origin: align,
        x,
        y
      })
      
      // 应用盒子配置
      Object.assign(state.box, {
        width: boxWidth,
        height: boxHeight,
        x: boxX,
        y: boxY
      })
      
      // 计算并应用图像配置
      const imageWidth = boxWidth - padding
      const imageHeight = Math.round((imageWidth * boxHeight) / boxWidth)
      
      Object.assign(state.image, {
        width: imageWidth + DIMENSIONS.IMAGE_OFFSET,
        height: imageHeight + DIMENSIONS.IMAGE_OFFSET,
        x: padding / 2 - 1,
        y: (boxHeight - imageHeight) / 2 - 1
      })
    }, [state.container, state.box, state.image], createSnap)
    // 配置监听器
    const watcherConfigs = [
      createWatcherConfig(() => optionStore.mode, updateImageFill),
      createWatcherConfig(
        [() => optionStore.paddingBg, () => optionStore.padding],
        updatePadding
      ),
      createWatcherConfig(() => optionStore.round, updateRound),
      createWatcherConfig(() => optionStore.shadow, updateShadow),
      createWatcherConfig(() => optionStore.scale, updateScale),
      createWatcherConfig(() => optionStore.img.src, updateImageSource),
      createWatcherConfig(() => optionStore.scaleX, applyHorizontalFlip),
      createWatcherConfig(() => optionStore.scaleY, applyVerticalFlip),
      createWatcherConfig(
        [
          () => optionStore.frameConf.width,
          () => optionStore.frameConf.height,
          () => optionStore.padding,
          () => optionStore.align,
          () => optionStore.frame
        ],
        updateFrameSettings
      )
    ]
    
    // 批量注册监听器
    setupWatchers(watcherConfigs)

    // 执行初始化更新
    const initialUpdates = [
      updateImageSource,
      updatePadding,
      updateRound,
      updateShadow,
      updateScale,
      updateFrameSettings
    ]
    
    executeInitialUpdates(initialUpdates)
    
    // 延迟执行翻转更新
    state.timer = delayedExecution(
      [applyHorizontalFlip, applyVerticalFlip],
      TIMING.SCALE_UPDATE_DELAY
    )

    // 组件卸载时清理
    onUnmounted(() => {
      clearTimeout(state.timer)
      state.container?.remove()
      state.bar?.remove()
    })
  },
  // 设置 render 仅仅是为了不弹出 Vue 警告
  render() {
    return h('span')
  },
})
