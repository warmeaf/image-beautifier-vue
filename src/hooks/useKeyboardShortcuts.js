import { onUnmounted } from 'vue'
import { tinykeys } from 'tinykeys'

/**
 * 键盘快捷键 composable
 * @param {Function} onSave - 保存回调函数
 * @param {Function} onCopy - 复制回调函数
 */
export function useKeyboardShortcuts(onSave, onCopy) {
  const unsubscribe = tinykeys(window, {
    '$mod+KeyS': (event) => {
      event.preventDefault()
      if (onSave) {
        onSave()
      }
    },
    '$mod+KeyC': (event) => {
      event.preventDefault()
      if (onCopy) {
        onCopy()
      }
    },
  })

  onUnmounted(() => {
    unsubscribe()
  })
}
