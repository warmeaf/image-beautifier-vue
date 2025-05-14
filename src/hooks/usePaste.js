import { onMounted, onUnmounted } from 'vue'
import { supportImg } from '@utils/utils'

export function usePaste(toPaste) {
  const getPaste = async (e) => {
    const data = e.clipboardData
    if (!data || !data.items) return
    const items = Array.from(data.items).filter((e) =>
      supportImg.includes(e.type)
    )
    if (!items.length) return
    const file = items[0].getAsFile()
    toPaste && toPaste(file)
  }

  onMounted(() => {
    document.addEventListener('paste', getPaste, false)
  })
  onUnmounted(() => {
    document.removeEventListener('paste', getPaste)
  })
}
