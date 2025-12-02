<template>
  <color-picker :pure-color="value" @pure-color-change="handleColorChange">
    <template v-if="isShowEyeDropper" #extra>
      <div className="mb-1">
        <a-button
          type="text"
          shape="circle"
          size="small"
          class="icon-btn"
          :icon="h(Icon.Pipette, { size: 16 })"
          @click="useDropper"
        />
      </div>
    </template>
  </color-picker>
</template>

<script setup>
import { computed, h } from 'vue'
import { TinyColor } from '@ctrl/tinycolor'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import Icon from '@components/Icon'

const props = defineProps({
  value: {
    type: String,
    default: '#ff0000',
  },
})
const emit = defineEmits(['change'])

const isShowEyeDropper = computed(() => {
  return !!window.EyeDropper
})
const useDropper = () => {
  if (!window.EyeDropper) return
  const eyeDropper = new EyeDropper()
  eyeDropper
    .open()
    .then((result) => {
      const color = result.sRGBHex
      const tinyColor = new TinyColor(color)
      emit('change', tinyColor)
    })
    .catch((error) => {
      // 用户取消或取色器错误，静默处理
      console.error('EyeDropper error:', error)
    })
}

const handleColorChange = (color) => {
  const tinyColor = new TinyColor(color)
  emit('change', tinyColor)

  if (tinyColor.getAlpha() === 0) {
    document
      .querySelector('.current-color')
      ?.classList.add('current-color__transparent')
  } else {
    document
      .querySelector('.current-color')
      ?.classList.remove('current-color__transparent')
  }
}
</script>

<style>
.current-color__transparent {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) !important;
  background-repeat: repeat !important;
}
</style>
