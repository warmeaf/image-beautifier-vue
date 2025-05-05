<template>
  <color-picker v-model:pureColor="pureColor">
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
import { ref, computed, watch, h } from 'vue'
import { TinyColor } from '@ctrl/tinycolor'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import Icon from '@components/Icon'

const pureColor = ref('#d81b43')
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
      console.log(tinyColor)
      pureColor.value = tinyColor.toHexString()
    })
    .catch((e) => {
      console.log(e)
    })
}

watch(pureColor, (newVal) => {
  const tinyColor = new TinyColor(newVal)
  if (tinyColor.getAlpha() === 0) {
    document
      .querySelector('.current-color')
      ?.classList.add('current-color__transparent')
  } else {
    document
      .querySelector('.current-color')
      ?.classList.remove('current-color__transparent')
  }
})
</script>

<style>
.current-color__transparent {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) !important;
  background-repeat: repeat !important;
}
</style>
