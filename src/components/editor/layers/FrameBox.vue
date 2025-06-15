<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Frame } from 'leafer-ui'

const props = defineProps({
  width: Number,
  height: Number,
  background: [String, Object],
  parent: Object,
  cursor: String,
})

const frame = ref(null)

// 初始化frame对象
onMounted(() => {
  frame.value = new Frame({
    width: props.width,
    height: props.height,
    overflow: 'hide',
    fill: props.background,
    cursor: 'auto',
  })
  frame.value.name = 'frame'

  // 添加到父元素
  props.parent.add(frame.value)
})

// 监听属性变化
watch(
  () => props.width,
  (newVal) => {
    if (frame.value) frame.value.width = newVal
  }
)

watch(
  () => props.height,
  (newVal) => {
    if (frame.value) frame.value.height = newVal
  }
)

watch(
  () => props.background,
  (newVal) => {
    if (frame.value) frame.value.fill = newVal
  }
)

watch(
  () => props.cursor,
  (newVal) => {
    if (frame.value) frame.value.cursor = newVal || 'auto'
  }
)

// 组件卸载时清理
onUnmounted(() => {
  if (frame.value) {
    frame.value.remove()
  }
})
</script>

<template>
  <!-- 将parent属性传递给子组件 -->
  <slot v-if="frame" :parent="frame"></slot>
</template>
