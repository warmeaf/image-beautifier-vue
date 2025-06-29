import { defineComponent, watch, onUnmounted, h } from 'vue'
import { Rect } from 'leafer-ui'
import stores from '@stores/index'

export default defineComponent({
  setup() {
    const optionStore = stores.useOptionStore()
    const editorStore = stores.useEditorStore()
    const rect = new Rect({
      x: 0,
      y: 0,
    })
    editorStore.getFrame?.add(rect)

    watch(
      [() => optionStore.frameConf.width, () => optionStore.frameConf.height],
      () => {
        rect.width = optionStore.frameConf.width
        rect.height = optionStore.frameConf.height
      },
      {
        immediate: true,
      }
    )
    watch(
      () => optionStore.waterIndex,
      () => {
        rect.zIndex = optionStore.waterIndex
      },
      {
        immediate: true,
      }
    )
    watch(
      [() => optionStore.waterSvg, () => optionStore.frameConf.width],
      () => {
        rect.fill = {
          type: 'image',
          url: optionStore.waterSvg,
          mode: 'repeat',
          format: 'svg',
          size: Math.round(optionStore.frameConf.width / 6),
        }
      },
      {
        immediate: true,
      }
    )

    onUnmounted(() => {
      rect.remove()
    })
  },
  // 设置 render 仅仅是为了不弹出 Vue 警告
  render() {
    return h('span')
  },
})
