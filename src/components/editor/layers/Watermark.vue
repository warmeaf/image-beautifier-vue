<script setup>
import { watch, onUnmounted } from 'vue'
import { Rect } from 'leafer-ui'
import stores from '@stores/index'
const optionStore = stores.useOptionStore()

const props = defineProps({
  parent: Object,
})

const rect = new Rect({
  x: 0,
  y: 0,
})

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

props.parent.add(rect)

onUnmounted(() => {
  rect.remove()
})
</script>
