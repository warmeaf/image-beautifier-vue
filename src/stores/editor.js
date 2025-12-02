import { defineStore } from 'pinia'
import { maxBy } from 'lodash-es'
import { EDITOR_CONFIG } from '@constants/editor'
import { EXPORT_CONFIG } from '@constants/export'
import { UI_CONFIG } from '@constants/ui'
import { MESSAGES } from '@constants/messages'

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
    invalidTimer: null,
  }),
  getters: {
    shapesList(state) {
      return Array.from(state.shapes.values())
    },
    cursor(state) {
      if (state.useTool === EDITOR_CONFIG.TOOLS.PENCIL) {
        return EDITOR_CONFIG.CURSORS.PENCIL
      }
      return state.useTool
        ? EDITOR_CONFIG.CURSORS.CROSSHAIR
        : EDITOR_CONFIG.CURSORS.AUTO
    },
    isEditing(state) {
      return !!state.app?.tree
    },
    nextStep() {
      const steps = this.shapesList.filter(
        (shape) => shape.type === EDITOR_CONFIG.SHAPE_TYPES.STEP
      )
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
    /**
     * 检查编辑状态，如果无效则显示消息
     * @returns {boolean} 是否正在编辑
     */
    checkEditingState() {
      if (!this.isEditing) {
        this.message?.info(MESSAGES.EDITOR.NO_IMAGE)
        this.setInvalid()
        return false
      }
      return true
    },
    /**
     * 隐藏非截图框的子元素
     * @param {Object} frame - 框架对象
     */
    hideNonScreenshotChildren(frame) {
      frame.children.forEach((child) => {
        if (child.id !== EDITOR_CONFIG.ELEMENTS.SCREENSHOT_BOX) {
          child.visible = false
        }
      })
    },
    /**
     * 显示所有子元素
     * @param {Object} frame - 框架对象
     */
    showAllChildren(frame) {
      frame.children.forEach((child) => {
        child.visible = true
      })
    },
    /**
     * 创建快照
     * @param {string} snapType - 快照类型
     */
    async createSnap(snapType) {
      if (
        snapType === EDITOR_CONFIG.SNAP_TYPES.INIT &&
        this.snap?.data
      ) {
        return
      }
      if (
        snapType !== EDITOR_CONFIG.SNAP_TYPES.INIT &&
        this.snap === null
      ) {
        return
      }

      const frame = this.getFrame
      if (!frame) return

      this.hideNonScreenshotChildren(frame)

      try {
        const image = await frame.export(EXPORT_CONFIG.FORMATS.PNG, {
          pixelRatio: EXPORT_CONFIG.SNAPSHOT_PIXEL_RATIO,
        })
        this.snap = image
      } catch (error) {
        // 静默处理错误，不影响主流程
        console.error('Failed to create snap:', error)
      } finally {
        this.showAllChildren(frame)
      }
    },
    /**
     * 设置无效状态（带自动恢复）
     */
    setInvalid() {
      if (this.invalidTimer) {
        clearTimeout(this.invalidTimer)
      }
      this.invalid = true
      this.invalidTimer = setTimeout(() => {
        this.invalid = false
        this.invalidTimer = null
      }, UI_CONFIG.INVALID_TIMEOUT)
    },
    setMessage(value) {
      this.message = value
    },
    addShape(shape) {
      this.shapes.set(shape.id, shape)
    },
    /**
     * 移除形状
     * @param {Object} shape - 形状对象
     */
    removeShape(shape) {
      this.shapes.delete(shape.id)
      if (
        this.snap &&
        this.shapesList.every(
          (s) => s.type !== EDITOR_CONFIG.SHAPE_TYPES.MAGNIFIER
        )
      ) {
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
    /**
     * 更新选中形状的颜色
     * @param {string} color - 颜色值
     */
    updateSelectedShapesColor(color) {
      if (!this.app?.editor) return
      const { list } = this.app.editor
      if (!list.length) return

      list.forEach((item) => {
        const shape = this.shapes.get(item.id)
        if (shape) {
          shape.fill = color
        }
      })
    },
    /**
     * 设置注释颜色
     * @param {string} color - 颜色值
     */
    setAnnotateColor(color) {
      this.annotateColor = color
      this.updateSelectedShapesColor(color)
    },
    /**
     * 更新选中形状的描边宽度
     * @param {number} width - 描边宽度
     */
    updateSelectedShapesStrokeWidth(width) {
      if (!this.app?.editor) return
      const { list } = this.app.editor
      if (!list.length) return

      list.forEach((item) => {
        const shape = this.shapes.get(item.id)
        if (shape) {
          shape.strokeWidth = width
        }
      })
    },
    /**
     * 设置描边宽度
     * @param {number} width - 描边宽度
     */
    setStrokeWidth(width) {
      this.strokeWidth = width
      this.updateSelectedShapesStrokeWidth(width)
    },
    setClearFun(value) {
      this.clearFun = value
    },
    /**
     * 销毁编辑器
     */
    destroy() {
      if (this.invalidTimer) {
        clearTimeout(this.invalidTimer)
        this.invalidTimer = null
      }
      this.app?.destroy(true)
      this.app = null
      this.snap = null
      this.shapes.clear()
      this.setUseTool(null)
    },
  },
})
