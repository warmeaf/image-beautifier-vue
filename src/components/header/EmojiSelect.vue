<template>
  <a-popover
    trigger="click"
    :open="open"
    :mouse-enter-delay="0"
    @open-change="handleOpenChange"
  >
    <template #content>
      <div class="emoji-picker" ref="emojiPicker"></div>
    </template>
    <a-button
      type="text"
      shape="circle"
      class="icon-btn"
      :disabled="disabled"
      :icon="
        h(Icon.Smile, {
          size: 16,
        })
      "
    ></a-button>
  </a-popover>
</template>

<script setup>
import Icon from '@components/Icon'
import { Picker } from 'emoji-mart'
import { h, nextTick, onMounted, onUnmounted, ref } from 'vue'

const emojiPicker = ref(null)
let instance = null
let timer = null

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  emojiMartProps: {
    type: Object,
    default: () => {},
  },
})
const open = ref(false)
const hide = () => {
  open.value = false
}
const onEmojiSelect = (e) => {
  hide()
  props.emojiMartProps?.onEmojiSelect(e)
}

const handleOpenChange = (newOpen) => {
  open.value = newOpen
  if (open.value) {
    nextTick(() => {
      const emojiMartProps = {
        ...props.emojiMartProps,
        parent: emojiPicker.value,
        onEmojiSelect,
      }
      if (!instance && emojiPicker.value) {
        instance = new Picker(emojiMartProps)
      }
    })
  }
}

// hack 处理，否则首次调用 handleOpenChange 时获取不到 emojiPicker.value
onMounted(() => {
  open.value = true
  timer = setTimeout(() => {
    open.value = false
  }, 0)
})
onUnmounted(() => {
  clearTimeout(timer)
})
</script>
