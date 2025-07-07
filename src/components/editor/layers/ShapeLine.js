import { defineComponent, onUnmounted, h, watchEffect, watch } from 'vue'
import { Rect, Ellipse, Line, Text, PropertyEvent } from 'leafer-ui'
import { Arrow } from '@leafer-in/arrow'
import { debounce } from 'lodash-es'

import stores from '@stores/index'

import { numSvg } from '@utils/utils'
import Magnifier from '@utils/shape/Magnifier'

export default defineComponent({
  props: {
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
    text: [String, Number],
    snap: Object,
  },
  setup(props) {
    const editorStore = stores.useEditorStore()
    const getShape = () => {
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
    }
    const shape = getShape()

    watchEffect(() => {
      if (['Slash', 'MoveDownLeft', 'Pencil'].includes(props.type)) {
        shape.points = props.points
      } else if (props.type === 'Step') {
        // 空操作
      } else {
        shape.x = props.x
        shape.y = props.y
        shape.width = props.width
        shape.height = props.height
      }
    })

    watchEffect(() => {
      if (props.type === 'SquareFill') {
        shape.fill = props.fill
      }
      if (
        ['Circle', 'Slash', 'MoveDownLeft', 'Pencil', 'Square'].includes(
          props.type
        )
      ) {
        shape.stroke = props.fill
      }
      if (props.type === 'Step') {
        const oldFill = [].concat(shape.fill)
        oldFill[0].color = props.fill
        shape.fill = oldFill
      }
    })

    watchEffect(() => {
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
        shape.strokeWidth = props.strokeWidth
      }
    })

    watchEffect(() => {
      shape.editable = !!props.editable
    })

    // 清理之前的事件监听
    watchEffect(() => {
      if (props.type === 'Magnifier' && shape.fill && props.snap) {
        const oldFill = [].concat(shape.fill)
        oldFill[1] = Object.assign({}, oldFill[1], {
          url: props.snap.data,
          size: { width: props.snap.width, height: props.snap.height },
        })
        shape.fill = oldFill
      }
      const offset = { x: 0, y: 0 }
      const fillBg = debounce(() => {
        const x = -shape.x * 2 - shape.width / 2
        const y = -shape.y * 2 - shape.height / 2
        if (offset.x === x && offset.y === y) return
        offset.x = x
        offset.y = y
        shape.fill = [
          { type: 'solid', color: '#ffffff' },
          {
            type: 'image',
            url: props.snap.data,
            mode: 'clip',
            size: {
              width: props.snap.width,
              height: props.snap.height,
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
      shape.on(PropertyEvent.CHANGE, (arg) => {
        if (!props.snap?.data) return
        if (!['x', 'y', 'width', 'height'].includes(arg.attrName)) return
        fillBg()
      })
    })

    editorStore.getFrame?.add(shape)

    onUnmounted(() => {
      shape.off(PropertyEvent.CHANGE)
      shape.remove()
    })
  },
  // 设置 render 仅仅是为了不弹出 Vue 警告
  render() {
    return h('span')
  },
})
