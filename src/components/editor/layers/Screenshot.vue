<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Box, Rect } from 'leafer-ui'
import { debounce } from 'lodash-es'

import { useEditorStore } from '@stores/editor'
import { useOptionStore } from '@stores/option'

import macbookpro16 from '@assets/macbook-pro-16.png'
import macbookair from '@assets/macbook-air.png'
import imacpro from '@assets/imac-pro.png'
import ipadpro from '@assets/ipadpro.png'
import iphonepro from '@assets/iphonepro.png'

import macosIcon from '@utils/macosIcon'
import { windowDark, windowLight } from '@utils/windowsIcon'
import { computedSize, getPosition, getMargin } from '@utils/utils'

const editorStore = useEditorStore()
const optionStore = useOptionStore()

const props = defineProps({
  parent: Object,
})

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

const createSnap = debounce(() => {
  editorStore.createSnap('update')
}, 100)

const bar = ref(null)
const image = ref(null)
const box = ref(null)
const container = ref(null)

// 初始化组件
onMounted(() => {
  // 创建图像元素
  image.value = new Rect({
    origin: 'center',
  })

  // 创建容器盒子
  box.value = new Box({
    overflow: 'hide',
    children: [image.value],
  })

  // 创建外层容器
  container.value = new Box({
    id: 'screenshot-box',
    overflow: 'hide',
    strokeAlign: 'outside',
    scale: 1,
    fill: '#ffffff00',
    children: [box.value],
  })

  // 添加到父元素
  props.parent.add(container.value)

  // 设置图像填充
  updateImageFill()
  updatePadding()
  updateRound()
  updateShadow()
  updateScale()
  updateImageSource()
  updateScaleX()
  updateScaleY()
  updateFrameSettings()
})

// 更新图像填充
const updateImageFill = () => {
  if (!image.value) return

  image.value.fill = {
    type: 'image',
    url: editorStore.img.src,
    align: optionStore.mode === 'fit' ? 'center' : 'top',
    mode: optionStore.mode,
  }
  createSnap()
}

// 更新内边距
const updatePadding = () => {
  if (!box.value) return

  if (optionStore.padding === 0 && !info[optionStore.frame]) {
    box.value.fill = '#ffffff00'
  } else {
    box.value.fill = optionStore.paddingBg
  }
  createSnap()
}

// 更新圆角
const updateRound = () => {
  if (!container.value || !image.value) return

  const { round } = optionStore
  container.value.cornerRadius = round
  if (!bar.value || info[optionStore.frame]) {
    image.value.cornerRadius = round
  }
  createSnap()
}

// 更新阴影
const updateShadow = () => {
  if (!container.value) return

  const { shadow } = optionStore
  if (shadow === 0 || optionStore.frame === 'macbookpro16') {
    container.value.shadow = null
  } else {
    container.value.shadow = {
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
  if (!container.value) return

  container.value.scale = optionStore.scale
  createSnap()
}

// 更新图像源
const updateImageSource = () => {
  if (!image.value) return

  image.value.url = editorStore.img.src
}

// 更新X轴缩放
const updateScaleX = () => {
  if (!image.value) return

  image.value.scaleX = optionStore.scaleX ? -1 : 1
  createSnap()
}

// 更新Y轴缩放
const updateScaleY = () => {
  if (!image.value) return

  image.value.scaleY = optionStore.scaleY ? -1 : 1
  createSnap()
}

// 更新框架设置
const updateFrameSettings = () => {
  if (!container.value || !box.value || !image.value) return

  const { align, frame, frameConf, padding } = optionStore
  const { img } = editorStore
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
  if (bar.value) {
    bar.value.remove()
    bar.value = null
  }

  // 根据frame类型设置不同的样式
  switch (frame) {
    case 'light':
      container.value.strokeWidth = 8
      container.value.stroke = '#ffffff80'
      break
    case 'dark':
      container.value.strokeWidth = 8
      container.value.stroke = '#00000050'
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
      bar.value = new Rect({
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
      container.value.addAfter(bar.value, box.value)
      box.value.cornerRadius = null
      image.value.cornerRadius = null
      break
    case 'macbookpro16':
    case 'macbookair':
    case 'imacpro':
    case 'ipadpro':
    case 'iphonepro':
      const device = info[frame]
      const bgSize = computedSize(device.width, device.height, width, height)
      bar.value = new Rect({
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
      container.value.shadow = null
      box.value.cornerRadius =
        frame === 'iphonepro' ? (bgSize.width * 1) / 10 : null
      container.value.addAfter(bar.value, box.value)
      break
    default:
      container.value.strokeWidth = null
      container.value.stroke = null
  }

  // 设置位置和尺寸
  const { x, y } = getPosition(
    align,
    frameConf.width - width,
    frameConf.height - totalHeight
  )
  container.value.width = width
  container.value.height = totalHeight
  container.value.origin = align
  container.value.x = x
  container.value.y = y
  box.value.width = boxWidth
  box.value.height = boxHeight
  box.value.x = boxX
  box.value.y = boxY
  const imageWidth = boxWidth - padding
  const imageheight = Math.round((imageWidth * boxHeight) / boxWidth)
  image.value.width = imageWidth + 2 // 解决有缝隙的问题
  image.value.height = imageheight + 2
  image.value.x = padding / 2 - 1
  image.value.y = (boxHeight - imageheight) / 2 - 1
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
watch(() => editorStore.img.src, updateImageSource)
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

// 组件卸载时清理
onUnmounted(() => {
  if (container.value) {
    container.value.remove()
  }
  if (bar.value) {
    bar.value.remove()
  }
})
</script>
