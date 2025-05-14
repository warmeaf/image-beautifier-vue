import { ref } from 'vue'
import { tinykeys } from 'tinykeys'

export function useKeyboardShortcuts(toSave, toCopy, dependencies) {
  const save = ref(toSave)
  const copy = ref(toCopy)
}
