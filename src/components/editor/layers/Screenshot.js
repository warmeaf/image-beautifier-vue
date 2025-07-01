import { defineComponent, onMounted, onUnmounted, watch, h } from 'vue'
import { Box, Rect } from 'leafer-ui'
import { debounce } from 'lodash-es'

import stores from '@stores/index'

import macbookpro16 from '@assets/macbook-pro-16.png'
import macbookair from '@assets/macbook-air.png'
import imacpro from '@assets/imac-pro.png'
import ipadpro from '@assets/ipadpro.png'
import iphonepro from '@assets/iphonepro.png'

import macosIcon from '@utils/macosIcon'
import { windowDark, windowLight } from '@utils/windowsIcon'
import { computedSize, getPosition, getMargin } from '@utils/utils'

const info = {
  macbookpro16: {
    image: macbookpro16,
    width: 1920,
    height: 1266,
    horizontal: 4 / 5,
    vertical: 26 / 33,
    top: 7 / 66,
  },
  macbookair: {
    image: macbookair,
    width: 1920,
    height: 1147,
    horizontal: 396 / 500,
    vertical: 258 / 299,
    top: 9 / 299,
  },
  imacpro: {
    image: imacpro,
    width: 1920,
    height: 1599,
    horizontal: 112 / 125,
    vertical: 252 / 417,
    top: 29 / 417,
  },
  ipadpro: {
    image: ipadpro,
    width: 1920,
    height: 1425,
    horizontal: 430 / 500,
    vertical: 302 / 372,
    top: 35 / 372,
  },
  iphonepro: {
    image: iphonepro,
    width: 968,
    height: 1920,
    horizontal: 214 / 253,
    vertical: 462 / 500,
    top: 19 / 500,
  },
}

export default defineComponent({
  setup() {
    const editorStore = stores.useEditorStore()
    const optionStore = stores.useOptionStore()
    let timer = null
    let bar = null
    let image = null
    let box = null
    let container = null

    const createSnap = debounce(() => {
      editorStore.createSnap('update')
    }, 100)

    // 更新图像填充
    const updateImageFill = () => {
      if (!image) return

      image.fill = {
        type: 'image',
        url: optionStore.img.src,
        align: optionStore.mode === 'fit' ? 'center' : 'top',
        mode: optionStore.mode,
      }
      createSnap()
    }
    // 更新内边距
    const updatePadding = () => {
      if (!box) return

      if (optionStore.padding === 0 && !info[optionStore.frame]) {
        box.fill = '#ffffff00'
      } else {
        box.fill = optionStore.paddingBg
      }
      createSnap()
    }
    // 更新圆角
    const updateRound = () => {
      if (!container || !image) return

      const { round } = optionStore
      container.cornerRadius = round
      if (!bar || info[optionStore.frame]) {
        image.cornerRadius = round
      }
      createSnap()
    }
    // 更新阴影
    const updateShadow = () => {
      if (!container) return

      const { shadow } = optionStore
      if (shadow === 0 || optionStore.frame === 'macbookpro16') {
        container.shadow = null
      } else {
        container.shadow = {
          x: shadow * 4,
          y: shadow * 4,
          blur: shadow * 3,
          color: '#00000045',
          box: true,
        }
      }
      createSnap()
    }
    // 更新缩放
    const updateScale = () => {
      if (!container) return

      container.scale = optionStore.scale
      createSnap()
    }
    // 更新图像源
    const updateImageSource = () => {
      if (!image) return

      image.url = optionStore.img.src
      updateImageFill()
    }
    // 更新X轴缩放
    const updateScaleX = () => {
      if (!image) return

      image.scaleX = optionStore.scaleX ? -1 : 1
      createSnap()
    }
    // 更新Y轴缩放
    const updateScaleY = () => {
      if (!image) return

      image.scaleY = optionStore.scaleY ? -1 : 1
      createSnap()
    }
    // 更新框架设置
    const updateFrameSettings = () => {
      if (!container || !box || !image) return

      const { align, frame, frameConf, padding } = optionStore
      const { img } = optionStore
      const margin = getMargin(frameConf.width, frameConf.height)
      const { width, height } = computedSize(
        img.width,
        img.height,
        frameConf.width - margin,
        frameConf.height - margin
      )
      let totalHeight = height
      let boxX = 0
      let boxY = 0
      let boxWidth = width
      let boxHeight = height

      // 清理之前的bar
      if (bar) {
        bar.remove()
        bar = null
      }

      // 根据frame类型设置不同的样式
      switch (frame) {
        case 'light':
          container.strokeWidth = 8
          container.stroke = '#ffffff80'
          break
        case 'dark':
          container.strokeWidth = 8
          container.stroke = '#00000050'
          break
        case 'macosBarLight':
        case 'macosBarDark':
        case 'windowsBarLight':
        case 'windowsBarDark':
          totalHeight += 32
          boxY = 32
          const barUrl = {
            mac: {
              type: 'image',
              url: macosIcon,
              format: 'svg',
              mode: 'clip',
              offset: { x: 10, y: 0 },
            },
            windowsBarLight: {
              type: 'image',
              url: windowDark,
              format: 'svg',
              mode: 'clip',
              offset: { x: width - 105, y: 0 },
            },
            windowsBarDark: {
              type: 'image',
              url: windowLight,
              format: 'svg',
              mode: 'clip',
              offset: { x: width - 105, y: 0 },
            },
          }
          bar = new Rect({
            x: 0,
            y: 0,
            height: 32,
            width: width,
            fill: [
              {
                type: 'solid',
                color: frame.includes('Dark') ? '#3a3a3b' : '#ffffff',
              },
              barUrl[frame] || barUrl.mac,
            ],
          })
          container.strokeWidth = 0
          container.addAfter(bar, box)
          box.cornerRadius = null
          image.cornerRadius = null
          break
        case 'macbookpro16':
        case 'macbookair':
        case 'imacpro':
        case 'ipadpro':
        case 'iphonepro':
          const device = info[frame]
          const bgSize = computedSize(
            device.width,
            device.height,
            width,
            height
          )
          bar = new Rect({
            x: 0,
            y: 0,
            height,
            width,
            fill: [
              {
                type: 'image',
                url: device.image,
                align: 'center',
                mode: 'clip',
                size: {
                  width: bgSize.width,
                  height: bgSize.height,
                },
              },
            ],
          })
          boxWidth = bgSize.width * device.horizontal
          boxHeight = bgSize.height * device.vertical
          boxX = (width - boxWidth) / 2
          boxY = bgSize.height * device.top + (height - bgSize.height) / 2
          container.shadow = null
          box.cornerRadius =
            frame === 'iphonepro' ? (bgSize.width * 1) / 10 : null
          container.addAfter(bar, box)
          break
        default:
          container.strokeWidth = null
          container.stroke = null
      }

      // 设置位置和尺寸
      const { x, y } = getPosition(
        align,
        frameConf.width - width,
        frameConf.height - totalHeight
      )
      container.width = width
      container.height = totalHeight
      container.origin = align
      container.x = x
      container.y = y
      box.width = boxWidth
      box.height = boxHeight
      box.x = boxX
      box.y = boxY
      const imageWidth = boxWidth - padding
      const imageheight = Math.round((imageWidth * boxHeight) / boxWidth)
      image.width = imageWidth + 2 // 解决有缝隙的问题
      image.height = imageheight + 2
      image.x = padding / 2 - 1
      image.y = (boxHeight - imageheight) / 2 - 1
      createSnap()
    }
    // 监听属性变化
    watch(() => optionStore.mode, updateImageFill)
    watch(
      [() => optionStore.paddingBg, () => optionStore.padding],
      updatePadding
    )
    watch(() => optionStore.round, updateRound)
    watch(() => optionStore.shadow, updateShadow)
    watch(() => optionStore.scale, updateScale)
    watch(() => optionStore.scaleX, updateScaleX)
    watch(() => optionStore.scaleY, updateScaleY)
    watch(
      [
        () => optionStore.frameConf.width,
        () => optionStore.frameConf.height,
        () => optionStore.padding,
        () => optionStore.align,
        () => optionStore.frame,
      ],
      updateFrameSettings
    )

    image = new Rect({
      origin: 'center',
    })
    // 创建容器盒子
    box = new Box({
      overflow: 'hide',
      children: [image],
    })
    // 创建外层容器
    container = new Box({
      id: 'screenshot-box',
      overflow: 'hide',
      strokeAlign: 'outside',
      scale: 1,
      fill: '#ffffff00',
      children: [box],
    })
    // 添加到父元素
    editorStore.getFrame?.add(container)
    // 设置图像填充
    updateImageSource()
    updatePadding()
    updateRound()
    updateShadow()
    updateScale()
    updateFrameSettings()
    timer = setTimeout(() => {
      updateScaleX()
      updateScaleY()
    }, 0)

    // 组件卸载时清理
    onUnmounted(() => {
      clearTimeout(timer)
      if (container) {
        container.remove()
      }
      if (bar) {
        bar.remove()
      }
    })
  },
  // 设置 render 仅仅是为了不弹出 Vue 警告
  render() {
    return h('span')
  },
})
