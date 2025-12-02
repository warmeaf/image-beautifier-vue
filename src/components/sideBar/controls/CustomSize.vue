<template>
  <div class="flex gap-2 items-center py-2 font-normal">
    <a-input-number
      :min="1"
      :value="width"
      :placeholder="String(frameWidth)"
      @change="setWith"
      class="flex-1"
    >
      <template #prefix>
        <span class="opacity-60 mx-1">W</span>
      </template>
    </a-input-number>
    <span class="text-xs opacity-50">x</span>
    <a-input-number
      :min="1"
      :value="height"
      :placeholder="String(frameHeight)"
      @change="setHeight"
      class="flex-1"
    >
      <template #prefix>
        <span class="opacity-60 mx-1">H</span>
      </template>
    </a-input-number>
    <a-button
      type="primary"
      shape="circle"
      class="icon-btn"
      :icon="h(Icon.Check, { size: 18 })"
      :disabled="!width || !height"
      @click="setCustom"
    ></a-button>
    <a-tooltip title="Auto size">
      <a-button
        type="primary"
        shape="circle"
        class="icon-btn"
        :icon="h(Icon.Maximize, { size: 18 })"
        :disabled="type === 'auto'"
        @click="setAuto"
      ></a-button>
    </a-tooltip>
  </div>
</template>

<script setup>
import Icon from '@components/Icon'
import { h, ref, watch } from 'vue'

const height = ref('')
const width = ref('')

const props = defineProps({
  frameWidth: {
    type: [String, Number],
    default: '1920',
  },
  frameHeight: {
    type: [String, Number],
    default: '1080',
  },
  type: {
    type: String,
    default: 'auto',
  },
})

const emits = defineEmits(['set'])

const setWith = (val) => {
  width.value = val
}
const setHeight = (val) => {
  height.value = val
}
const setAuto = () => {
  emits('set', { type: 'auto', title: 'Auto' })
}
const setCustom = () => {
  emits('set', {
    type: 'custom',
    title: 'Custom',
    width: Number(width.value),
    height: Number(height.value),
  })
}

watch(
  () => props.type,
  (type) => {
    if (type === 'custom') {
      setWith(props.frameWidth)
      setHeight(props.frameHeight)
    } else {
      setWith('')
      setHeight('')
    }
  },
  {
    immediate: true,
  }
)
</script>
