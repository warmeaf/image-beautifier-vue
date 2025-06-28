import { onUnmounted } from 'vue'

import { tinykeys } from 'tinykeys'

export function useKeyboardShortcuts(toSave, toCopy) {
  const unsubscribe = tinykeys(window, {
    '$mod+KeyS': (event) => {
      event.preventDefault()
      toSave && toSave()
    },
    '$mod+KeyC': (event) => {
      event.preventDefault()
      toCopy && toCopy()
    },
  })

  onUnmounted(() => {
    unsubscribe()
  })
}
