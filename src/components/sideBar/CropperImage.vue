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
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <vue-cropper
      ref="cropperRef"
      :style="{ height: '400px', width: '100%' }"
      :img="optionStore.img.src"
      v-bind="option"
    />
  </a-modal>
</template>

<script setup>
import { h, ref } from 'vue'

import Icon from '@components/Icon'

import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

import stores from '@stores/index'
import { getMargin } from '@utils/utils'

const optionStore = stores.useOptionStore()

const option = ref({
  size: 1,
  full: false,
  canMove: true,
  fixedBox: false,
  original: false,
  canMoveBox: true,
  autoCrop: true,
  // 只有自动截图开启 宽度高度才生效
  autoCropWidth: 750,
  autoCropHeight: 340,
  centerBox: true,
  high: true,
  max: 1,
})

const isModalOpen = ref(false)
const cropperRef = ref(null)
const handleOk = () => {
  if (cropperRef.value) {
    const width = cropperRef.value.cropW
    const height = cropperRef.value.cropH
    cropperRef.value.getCropData((imgUrl) => {
      optionStore.setImg(
        Object.assign({}, optionStore.img, {
          src: imgUrl,
          width,
          height,
        })
      )
      if (optionStore.size.type === 'auto') {
        const margin = getMargin(width, height)
        optionStore.setFrameSize(width + margin, height + margin)
      }
    })
  }
  isModalOpen.value = false
}
const handleCancel = () => {
  isModalOpen.value = false
}
</script>
