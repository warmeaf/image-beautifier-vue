import { onMounted, onUnmounted } from 'vue'
import { tinykeys } from 'tinykeys'

export function useHotKeys(stores) {
  onMounted(() => {
    const deleteItem = () => {
      const { list } = stores.editorStore.app?.editor
      if (list?.length) {
        for (let item of list) {
          item.remove()
          stores.editorStore.removeShape(item)
        }
        stores.editorStore.app.editor.cancel()
      }
    }

    const handleZoom = (type) => {
      if (type === 'fit') {
        stores.editorStore.app?.tree.zoom(type, 100)
      } else {
        stores.editorStore.app?.tree.zoom(type)
      }
      stores.editorStore.setScale(stores.editorStore.app.tree.scale)
    }

    const unsubscribe = tinykeys(window, {
      Backspace: deleteItem,
      Delete: deleteItem,
      '$mod+Minus': (event) => {
        event.preventDefault()
        handleZoom('out')
      },
      '$mod+Equal': (event) => {
        event.preventDefault()
        handleZoom('in')
      },
      '$mod+Digit0': (event) => {
        event.preventDefault()
        handleZoom('fit')
      },
    })

    // 在组件卸载时清理事件监听
    onUnmounted(() => {
      unsubscribe()
    })
  })
}
