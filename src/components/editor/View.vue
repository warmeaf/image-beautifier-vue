<template>
  <FrameBox
    v-if="hasAppTree"
    :parent="editorStores.app.tree"
    :cursor="editorStores.cursor"
    v-bind="optionStores.frameConf"
  >
    <template v-if="hasImgSrc" v-slot="{ parent }">
      <!-- 如果需要渲染shapesList，可以在这里添加 -->
      <Screenshot :parent="parent" />
      <!-- 如果需要渲染waterImg，可以在这里添加 -->
    </template>
  </FrameBox>
</template>

<script setup>
import { watch, onUnmounted, computed } from 'vue'
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

import FrameBox from './layers/FrameBox'
import Screenshot from './layers/Screenshot'
import Watermark from './layers/Watermark'
import ShapeLine from './layers/ShapeLine'

import { useEditorStore } from '@stores/editor'
import { useOptionStore } from '@stores/option'

import rotatePng from '@assets/rotate.png'
import pencilPng from '@assets/pencil.png'

import { nanoid } from '@utils/utils'

defineOptions({
  name: 'EView',
})

const editorStores = useEditorStore()
const optionStores = useOptionStore()

const props = defineProps({
  target: {
    type: Object,
    default: () => {},
  },
})

Cursor.set('pencil', { url: pencilPng })
// 监听容器变化
const onResize = debounce(() => {
  const { width, height } = props.target.getBoundingClientRect()
  editorStores.app.tree.zoom('fit', 100)
  if (
    optionStores.frameConf.width < width &&
    optionStores.frameConf.height < height
  ) {
    editorStores.app.tree.zoom(1)
  }
}, 50)

watch(
  () => props.target,
  (target) => {
    console.log(props.target, 'target')
    if (target) {
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
      editorStores.setApp(app)
      editorStores.app.tree.on(ZoomEvent.ZOOM, () => {
        editorStores.setScale(editorStores.app.tree.scale)
      })
      editorStores.app.tree.on(ResizeEvent.RESIZE, () => {
        editorStores.setScale(editorStores.app.tree.scale)
      })
      editorStores.app.editor.on(EditorMoveEvent.SELECT, (event) => {
        const { list } = event
        if (list.length < 2) return
        if (list.some((e) => e.tag === 'Magnifier')) {
          editorStores.app.editor.config.rotateable = false
          editorStores.app.editor.config.lockRatio = true
        } else {
          editorStores.app.editor.config.rotateable = true
          editorStores.app.editor.config.lockRatio = false
        }
      })

      let shapeId = null
      const onStart = (arg) => {
        if (!editorStores.useTool) return
        const { target } = arg
        const shape = editorStores.getShape(target.id)
        if (shape) return
        shapeId = nanoid()
        const size = arg.getPageBounds ? arg.getPageBounds() : arg.getPage()
        const type = editorStores.useTool
        const newShape = {
          id: shapeId,
          type,
          fill: editorStores.annotateColor,
          strokeWidth: editorStores.strokeWidth,
          zIndex: editorStores.shapes.size + 1,
          ...size,
        }
        return newShape
      }
      editorStores.app.tree.on(PointerEvent.DOWN, (arg) => {
        const type = editorStores.useTool
        if (type !== 'Step') return
        const newShape = onStart(arg)
        if (!newShape) return
        newShape.text = editorStores.nextStep
        newShape.editable = true
        editorStores.addShape(newShape)
        shapeId = null
        editorStores.setUseTool(null)
      })
      editorStores.app.tree.on(DragEvent.START, (arg) => {
        const type = editorStores.useTool
        if (type === 'Step') return
        const newShape = onStart(arg)
        if (!newShape) return
        if (['Slash', 'MoveDownLeft', 'Pencil'].includes(type)) {
          newShape.points = [newShape.x, newShape.y]
        }
        editorStores.addShape(newShape)
      })
      editorStores.app.tree.on(DragEvent.DRAG, (arg) => {
        if (!editorStores.useTool) return
        if (!shapeId) return
        const shape = editorStores.getShape(shapeId)
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
        editorStores.addShape(newShape)
      })
      editorStores.app.tree.on(DragEvent.END, () => {
        if (!editorStores.useTool) return
        if (!shapeId) return
        const shape = editorStores.getShape(shapeId)
        if (shape) {
          if (
            (shape.width === 0 || shape.height === 0) &&
            !['Slash', 'MoveDownLeft', 'Pencil'].includes(shape.type)
          ) {
            editorStores.removeShape(shape)
          } else {
            editorStores.addShape(Object.assign({}, shape, { editable: true }))
          }
        }
        shapeId = null
        if (editorStores.useTool !== 'Pencil') editorStores.setUseTool(null)
      })
    }

    addListener(target, onResize)
  },
  {
    immediate: true,
  }
)

const hasAppTree = computed(() => {
  return !!editorStores.app?.tree
})
const hasImgSrc = computed(() => {
  return !!editorStores.img?.src
})

onUnmounted(() => {
  removeListener(props.target, onResize)
  editorStores.destroy()
})
</script>
