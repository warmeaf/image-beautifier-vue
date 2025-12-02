<script setup>
import stores from '@stores/index'
import { Frame } from 'leafer-ui'
import { onUnmounted, watch } from 'vue'

const editorStore = stores.useEditorStore()

const props = defineProps({
  width: Number,
  height: Number,
  background: [String, Object],
  cursor: String,
})

// 初始化frame对象
const frame = new Frame({
  width: props.width,
  height: props.height,
  overflow: 'hide',
  fill: props.background,
  cursor: 'auto',
})
// 添加到父元素
editorStore.setFrame(frame)

// 监听属性变化
watch(
  () => props.width,
  (newVal) => {
    if (frame) frame.width = newVal
  }
)

watch(
  () => props.height,
  (newVal) => {
    if (frame) frame.height = newVal
  }
)

watch(
  () => props.background,
  (newVal) => {
    if (frame) frame.fill = newVal
  }
)

watch(
  () => props.cursor,
  (newVal) => {
    if (frame) frame.cursor = newVal || 'auto'
  }
)

// 组件卸载时清理
onUnmounted(() => {
  if (frame) {
    frame.remove()
  }
})
</script>

<template>
  <slot></slot>
</template>
