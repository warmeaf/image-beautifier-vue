<template>
  <div class="[&_label]:font-semibold pt-2 [&_label]:text-sm">
    <label>Quick</label>
    <div class="flex gap-4 items-center py-2">
      <cropper-image />
      <a-button
        type="text"
        shape="circle"
        class="icon-btn"
        :icon="h(Icon.FlipHorizontal2, { size: 18 })"
        @click="
          () => {
            optionStore.toggleFlip('x')
          }
        "
      ></a-button>
      <a-button
        type="text"
        shape="circle"
        class="icon-btn"
        :icon="h(Icon.FlipVertical2, { size: 18 })"
        @click="
          () => {
            optionStore.toggleFlip('y')
          }
        "
      ></a-button>
      <e-position />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import stores from '@stores/index'
import Icon from '@components/Icon'
import { CropperImage, EPosition } from '../features'

const optionStore = stores.useOptionStore()
</script>