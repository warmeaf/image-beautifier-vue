import { defineStore } from 'pinia'
import { maxBy } from 'lodash-es'

let timer = null
export const useEditorStore = defineStore('editor', {
  state: () => ({
    invalid: false,
    app: null,
    scale: 100,
    useTool: null,
    annotateColor: '#ff0000',
    strokeWidth: 4,
    shapes: new Map(),
    message: null,
    clearFun: null,
    snap: null,
  }),
  getters: {
    shapesList(state) {
      return Array.from(state.shapes.values())
    },
    cursor(state) {
      return state.useTool === 'Pencil'
        ? 'pencil'
        : state.useTool
        ? 'crosshair'
        : 'auto'
    },
    isEditing(state) {
      const is = !!state.app?.tree
      if (!is) {
        this.message.info('Please add a image')
        this.setInvalid()
      }
      return is
    },
    nextStep() {
      const steps = this.shapesList.filter((e) => e.type === 'Step')
      const maxItem = maxBy(steps, (item) => Number(item.text))
      if (maxItem?.text) return Number(maxItem.text) + 1
      return 1
    },
    getShape(state) {
      return (id) => {
        return state.shapes.get(id)
      }
    },
    getFrame(state) {
      return state.app?.tree?.children[0]
    },
  },
  actions: {
    createSnap(type) {
      if (type === 'init' && this.snap?.data) return
      if (type !== 'init' && this.snap === null) return
      const ex = async () => {
        const frame = this.getFrame
        if (!frame) return
        frame.children.map((child) => {
          if (child.id !== 'screenshot-box') {
            child.visible = false
          }
        })
        const image = await frame
          .export('png', { pixelRatio: 2 })
          .catch((e) => console.log(e))
        frame.children.map((child) => (child.visible = true))
        this.snap = image
      }
      ex()
    },
    setInvalid() {
      clearTimeout(timer)
      this.invalid = true
      timer = setTimeout(() => {
        this.invalid = false
      }, 200)
    },
    setMessage(value) {
      this.message = value
    },
    addShape(shape) {
      this.shapes.set(shape.id, shape)
    },
    removeShape(shape) {
      this.shapes.delete(shape.id)
      if (this.snap && this.shapesList.every((e) => e.type !== 'Magnifier')) {
        this.snap = null
      }
    },
    setApp(app) {
      this.app = app
    },
    setFrame(frame) {
      if (!this.app?.tree) return
      this.app.tree.add(frame)
    },
    setScale(value) {
      this.scale = parseInt(value * 100)
    },
    setUseTool(value) {
      this.useTool = value
      if (value) {
        this.setSelect(false)
      } else {
        this.setSelect(true)
      }
    },
    setSelect(value) {
      if (!this.app) return
      this.app.editor.app.config.move.drag = false
      this.app.editor.hittable = value
    },
    setAnnotateColor(color) {
      this.annotateColor = color
      if (!this.app?.editor) return
      const { list } = this.app.editor
      if (!list.length) return
      for (let item of list) {
        const shape = this.shapes.get(item.id)
        if (shape) shape.fill = color
      }
    },
    setStrokeWidth(value) {
      this.strokeWidth = value
      if (!this.app?.editor) return
      const { list } = this.app.editor
      if (!list.length) return
      for (let item of list) {
        const shape = this.shapes.get(item.id)
        if (shape) shape.strokeWidth = value
      }
    },
    setClearFun(value) {
      this.clearFun = value
    },
    destroy() {
      this.app?.destroy(true)
      this.app = null
      this.snap = null
      this.shapes.clear()
      this.setUseTool(null)
    },
  },
})
