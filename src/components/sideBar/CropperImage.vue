<template>
  <a-tooltip title="Crop Image">
    <a-button
      type="text"
      shape="circle"
      class="icon-btn"
      :icon="h(Icon.Crop, { size: 18 })"
      @click="isModalOpen = true"
    />
  </a-tooltip>
  <a-modal
    title="Cropper"
    :open="isModalOpen"
    destroyOnClose
    @cancel="handleCancel"
  >
    <vue-cropper ref="cropperRef" :style="{ height: '400px', width: '100%' }" />
  </a-modal>
</template>

<script setup>
import { h, ref } from 'vue'

import Icon from '@components/Icon'

import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const isModalOpen = ref(false)
const handleCancel = () => {
  isModalOpen.value = false
}
</script>
