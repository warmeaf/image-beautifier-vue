<script setup>
import { onMounted, onUnmounted } from 'vue'
import { tinykeys } from 'tinykeys'
import stores from '@stores/index'
const editorStore = stores.useEditorStore()

onMounted(() => {
  const deleteItem = () => {
    const { list } = editorStore.app?.editor
    if (list?.length) {
      for (let item of list) {
        item.remove()
        editorStore.removeShape(item)
      }
      editorStore.app.editor.cancel()
    }
  }

  const handleZoom = (type) => {
    if (type === 'fit') {
      editorStore.app?.tree.zoom(type, 100)
    } else {
      editorStore.app?.tree.zoom(type)
    }
    editorStore.setScale(editorStore.app.tree.scale)
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
</script>
