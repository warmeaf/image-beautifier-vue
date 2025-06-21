<template>
  <div class="w-full h-full relative z-0" ref="targetRef">
    <FrameBox
      v-if="hasAppTree"
      :parent="editorStore.app.tree"
      :cursor="editorStore.cursor"
      v-bind="optionStore.frameConf"
    >
      <template v-if="hasImgSrc" v-slot="{ frame }">
        <ShapeLine
          v-for="item in editorStore.shapesList"
          :key="item.id"
          :parent="frame"
          v-bind="
            Object.assign(
              {},
              item,
              item.type === 'Magnifier' ? { snap: editorStore.snap } : {}
            )
          "
        />
        <Screenshot :parent="frame" />
        <Watermark v-if="optionStore.waterImg" :parent="frame" />
      </template>
    </FrameBox>
  </div>
</template>

<script setup>
import {
  watch,
  onUnmounted,
  computed,
  nextTick,
  ref,
  onMounted,
  unref,
} from 'vue'
import { debounce } from 'lodash-es'
import { addListener, removeListener } from 'resize-detector'
import {
  App,
  ResizeEvent,
  ZoomEvent,
  DragEvent,
  PointerEvent,
  Cursor,
} from 'leafer-ui'
import { EditorMoveEvent } from '@leafer-in/editor'
import { ScrollBar } from '@leafer-in/scroll'
import '@leafer-in/view'
import '@leafer-in/export'

import FrameBox from './layers/FrameBox'
import Screenshot from './layers/Screenshot.js'
import Watermark from './layers/Watermark.js'
import ShapeLine from './layers/ShapeLine.js'

import stores from '@stores/index'
import { useHotKeys } from '@hooks/useHotKeys'

import rotatePng from '@assets/rotate.png'
import pencilPng from '@assets/pencil.png'

import { nanoid } from '@utils/utils'

defineOptions({
  name: 'EView',
})

const editorStore = stores.useEditorStore()
const optionStore = stores.useOptionStore()
useHotKeys(stores)

const targetRef = ref(null)

Cursor.set('pencil', { url: pencilPng })
// 监听容器变化
const setZoom = () => {
  const { width, height } = targetRef.value.getBoundingClientRect()
  editorStore.app.tree.zoom('fit', 100)
  if (
    optionStore.frameConf.width < width &&
    optionStore.frameConf.height < height
  ) {
    editorStore.app.tree.zoom(1)
  }
}
const onResize = debounce(() => {
  setZoom()
}, 50)

watch(
  [() => optionStore.frameConf.width, () => optionStore.frameConf.height],
  () => {
    nextTick(() => {
      setZoom()
      editorStore.setScale(editorStore.app.tree.scale)
    })
  },
  {
    immediate: true,
  }
)

const hasAppTree = computed(() => {
  return !!editorStore.app?.tree
})
const hasImgSrc = computed(() => {
  return !!editorStore.img?.src
})

onMounted(() => {
  const target = unref(targetRef)
  if (target) {
    addListener(target, onResize)

    const app = new App({
      view: target,
      editor: {
        lockRatio: 'corner',
        stroke: '#3f99f7',
        skewable: false,
        hover: false,
        middlePoint: { cornerRadius: 100, width: 20, height: 6 },
        rotatePoint: {
          width: 20,
          height: 20,
          fill: {
            type: 'image',
            url: rotatePng,
          },
        },
      },
      tree: {
        usePartRender: true,
      },
      sky: {
        type: 'draw',
        usePartRender: true,
      },
    })
    new ScrollBar(app)
    editorStore.setApp(app)
    app.tree.on(ZoomEvent.ZOOM, () => {
      editorStore.setScale(editorStore.app.tree.scale)
    })
    app.tree.on(ResizeEvent.RESIZE, () => {
      editorStore.setScale(editorStore.app.tree.scale)
    })
    app.editor.on(EditorMoveEvent.SELECT, (event) => {
      const { list } = event
      if (list.length < 2) return
      if (list.some((e) => e.tag === 'Magnifier')) {
        editorStore.app.editor.config.rotateable = false
        editorStore.app.editor.config.lockRatio = true
      } else {
        editorStore.app.editor.config.rotateable = true
        editorStore.app.editor.config.lockRatio = false
      }
    })

    let shapeId = null
    const onStart = (arg) => {
      if (!editorStore.useTool) return
      const { target } = arg
      const shape = editorStore.getShape(target.id)
      if (shape) return
      shapeId = nanoid()
      const size = arg.getPageBounds ? arg.getPageBounds() : arg.getPage()
      const type = editorStore.useTool
      const newShape = {
        id: shapeId,
        type,
        fill: editorStore.annotateColor,
        strokeWidth: editorStore.strokeWidth,
        zIndex: editorStore.shapes.size + 1,
        ...size,
      }
      return newShape
    }
    app.tree.on(PointerEvent.DOWN, (arg) => {
      const type = editorStore.useTool
      if (type !== 'Step') return
      const newShape = onStart(arg)
      if (!newShape) return
      newShape.text = editorStore.nextStep
      newShape.editable = true
      editorStore.addShape(newShape)
      shapeId = null
      editorStore.setUseTool(null)
    })
    app.tree.on(DragEvent.START, (arg) => {
      const type = editorStore.useTool
      if (type === 'Step') return
      const newShape = onStart(arg)
      if (!newShape) return
      if (['Slash', 'MoveDownLeft', 'Pencil'].includes(type)) {
        newShape.points = [newShape.x, newShape.y]
      }
      editorStore.addShape(newShape)
    })
    app.tree.on(DragEvent.DRAG, (arg) => {
      if (!editorStore.useTool) return
      if (!shapeId) return
      const shape = editorStore.getShape(shapeId)
      if (!shape) return
      const size = arg.getPageBounds()
      const max = Math.max(size.width, size.height)
      if (shape.type === 'Magnifier') {
        size.width = max
        size.height = max
      }
      const newShape = Object.assign({}, shape, size)
      const { points, type } = newShape
      if (points && points.length) {
        const { x, y } = arg.getInnerTotal()
        const newX = x > 0 ? size.x + x : size.x
        const newY = y > 0 ? size.y + y : size.y
        if (type === 'Pencil') {
          newShape.points = [...points, newX, newY]
        } else {
          newShape.points = [points[0], points[1], newX, newY]
        }
      }
      editorStore.addShape(newShape)
    })
    app.tree.on(DragEvent.END, () => {
      if (!editorStore.useTool) return
      if (!shapeId) return
      const shape = editorStore.getShape(shapeId)
      if (shape) {
        if (
          (shape.width === 0 || shape.height === 0) &&
          !['Slash', 'MoveDownLeft', 'Pencil'].includes(shape.type)
        ) {
          editorStore.removeShape(shape)
        } else {
          editorStore.addShape(Object.assign({}, shape, { editable: true }))
        }
      }
      shapeId = null
      if (editorStore.useTool !== 'Pencil') editorStore.setUseTool(null)
    })
  }
})

onUnmounted(() => {
  removeListener(targetRef.value, onResize)
  editorStore.destroy()
})
</script>
