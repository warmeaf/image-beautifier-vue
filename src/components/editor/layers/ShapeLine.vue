<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { Rect, Ellipse, Line, Text, PropertyEvent } from 'leafer-ui'
import { Arrow } from '@leafer-in/arrow'
import { debounce } from 'lodash-es'
import { numSvg } from '@utils/utils'
import Magnifier from '@utils/shape/Magnifier'

const props = defineProps({
  parent: Object,
  type: String,
  id: [String, Number],
  width: Number,
  height: Number,
  x: Number,
  y: Number,
  fill: String,
  strokeWidth: Number,
  zIndex: Number,
  points: Array,
  editable: Boolean,
  text: String,
  snap: Object,
})

const shape = computed(() => {
  const defaultOption = {
    id: props.id,
    x: props.x,
    y: props.y,
    zIndex: props.zIndex,
  }

  if (props.type === 'SquareFill') {
    return new Rect({
      cornerRadius: 8,
      width: props.width,
      height: props.height,
      fill: props.fill,
      ...defaultOption,
    })
  }

  if (props.type === 'Circle') {
    return new Ellipse({
      stroke: props.fill,
      strokeWidth: props.strokeWidth,
      width: props.width,
      height: props.height,
      ...defaultOption,
    })
  }

  if (props.type === 'Magnifier') {
    return new Magnifier({
      stroke: '#ffffff90',
      strokeWidth: props.strokeWidth,
      strokeAlign: 'outside',
      width: props.width,
      height: props.height,
      shadow: {
        x: 4,
        y: 4,
        blur: 6,
        color: '#00000010',
        box: true,
      },
      ...defaultOption,
    })
  }

  if (props.type === 'Slash') {
    return new Line({
      id: props.id,
      points: props.points,
      zIndex: props.zIndex,
      stroke: props.fill,
      strokeWidth: props.strokeWidth,
    })
  }

  if (props.type === 'MoveDownLeft') {
    return new Arrow({
      id: props.id,
      points: props.points,
      zIndex: props.zIndex,
      strokeCap: 'round',
      strokeJoin: 'round',
      stroke: props.fill,
      strokeWidth: props.strokeWidth,
    })
  }

  if (props.type === 'Pencil') {
    return new Line({
      id: props.id,
      points: props.points,
      zIndex: props.zIndex,
      curve: true,
      stroke: props.fill,
      strokeWidth: props.strokeWidth,
    })
  }

  if (props.type === 'Step') {
    return new Ellipse({
      ...defaultOption,
      width: 32,
      height: 32,
      stroke: '#ffffff90',
      strokeWidth: props.strokeWidth,
      strokeAlign: 'outside',
      lockRatio: true,
      shadow: {
        x: 1,
        y: 1,
        blur: 2,
        color: '#00000045',
        box: true,
      },
      fill: [
        {
          type: 'solid',
          color: props.fill,
        },
        {
          type: 'image',
          url: numSvg(props.text),
          format: 'svg',
          align: 'center',
        },
      ],
    })
  }

  if (props.type === 'emoji') {
    return new Text({
      id: props.id,
      zIndex: props.zIndex,
      text: props.text,
      resizeFontSize: true,
      fontSize: 48,
    })
  }

  return new Rect({
    cornerRadius: 8,
    stroke: props.fill,
    strokeWidth: props.strokeWidth,
    width: props.width,
    height: props.height,
    ...defaultOption,
  })
})

watch(
  [() => props.x, () => props.y, () => props.width, () => props.height],
  () => {
    if (['Slash', 'MoveDownLeft', 'Pencil'].includes(props.type)) {
      shape.value.points = props.points
    } else if (props.type === 'Step') {
      // 空操作
    } else {
      shape.value.x = props.x
      shape.value.y = props.y
      shape.value.width = props.width
      shape.value.height = props.height
    }
  }
)

watch(
  () => props.fill,
  () => {
    if (props.type === 'SquareFill') shape.value.fill = props.fill
    if (
      ['Circle', 'Slash', 'MoveDownLeft', 'Pencil', 'Square'].includes(
        props.type
      )
    )
      shape.value.stroke = props.fill
    if (props.type === 'Step') {
      const oldFill = [].concat(shape.value.fill)
      oldFill[0].color = props.fill
      shape.value.fill = oldFill
    }
  }
)

watch(
  () => props.strokeWidth,
  () => {
    if (
      [
        'Circle',
        'Magnifier',
        'Slash',
        'MoveDownLeft',
        'Pencil',
        'Step',
        'Square',
      ].includes(props.type)
    ) {
      shape.value.strokeWidth = props.strokeWidth
    }
  }
)

watch(
  () => props.editable,
  () => {
    shape.value.editable = !!props.editable
  }
)

// 处理snap相关逻辑
let cleanupFunction = null

watch(
  () => props.snap,
  (snap) => {
    // 清理之前的事件监听
    if (cleanupFunction) {
      cleanupFunction()
      cleanupFunction = null
    }

    if (props.type === 'Magnifier' && shape.value.fill && snap) {
      const oldFill = [].concat(shape.value.fill)
      oldFill[1] = Object.assign({}, oldFill[1], {
        url: snap.data,
        size: { width: snap.width, height: snap.height },
      })
      shape.value.fill = oldFill
    }

    const offset = { x: 0, y: 0 }
    const fillBg = debounce(() => {
      const x = -shape.value.x * 2 - shape.value.width / 2
      const y = -shape.value.y * 2 - shape.value.height / 2
      if (offset.x === x && offset.y === y) return
      offset.x = x
      offset.y = y
      shape.value.fill = [
        { type: 'solid', color: '#ffffff' },
        {
          type: 'image',
          url: snap.data,
          mode: 'clip',
          size: {
            width: snap.width,
            height: snap.height,
          },
          offset,
        },
        {
          type: 'linear',
          from: 'top',
          to: 'bottom',
          stops: [
            { offset: 0, color: '#ffffffaa' },
            { offset: 0.48, color: '#ffffff00' },
          ],
        },
      ]
    }, 5)

    shape.value.on(PropertyEvent.CHANGE, (arg) => {
      if (!snap?.data) return
      if (!['x', 'y', 'width', 'height'].includes(arg.attrName)) return
      fillBg()
    })

    cleanupFunction = () => {
      shape.value.off(PropertyEvent.CHANGE)
    }
  },
  { immediate: true }
)

// 组件挂载和卸载时的处理
onMounted(() => {
  props.parent.add(shape.value)
})

onUnmounted(() => {
  if (cleanupFunction) {
    cleanupFunction()
  }
  shape.value.remove()
})
</script>
