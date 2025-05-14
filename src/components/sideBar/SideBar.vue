<template>
  <div
    class="bg-white dark:bg-black flex flex-col md:w-[340px] border-l border-l-gray-50 dark:border-l-gray-700 dark:text-gray-400 shadow-lg relative z-10 select-none"
  >
    <div class="flex-1 flex-col gap-2 p-4 overflow-y-auto overflow-x-hidden">
      <size-bar />
      <div class="[&_label]:font-semibold pt-2 [&_label]:text-sm">
        <label>Quick</label>
        <div class="flex gap-4 items-center py-2">
          <cropper-image />
          <a-button
            type="text"
            shape="circle"
            class="icon-btn"
            :icon="h(Icon.FlipHorizontal2, { size: 18 })"
          ></a-button>
          <a-button
            type="text"
            shape="circle"
            class="icon-btn"
            :icon="h(Icon.FlipVertical2, { size: 18 })"
          ></a-button>
          <e-position />
        </div>
      </div>
      <div class="[&_label]:font-semibold [&_label]:text-sm">
        <label>Scale</label>
        <a-slider :min="0.1" :max="3" :step="0.1" />
      </div>
      <div class="[&_label]:font-semibold [&_label]:text-sm">
        <div class="flex justify-between">
          <label>Padding</label>
          <color-picker />
        </div>
        <a-slider :min="0" :max="60" />
      </div>
      <div class="[&_label]:font-semibold [&_label]:text-sm">
        <label>Rounded</label>
        <a-slider :min="0" :max="20" />
      </div>
      <frame-bar />
      <div class="[&_label]:font-semibold [&_label]:text-sm">
        <label>Shadow</label>
        <a-slider :min="0" :max="6" />
      </div>
      <water-mark />
    </div>
    <download-bar />
    <drawer-bar />
  </div>
</template>

<script setup>
import { h } from 'vue'

import Icon from '@components/Icon'
import ColorPicker from '@components/ColorPicker'
import SizeBar from './SizeBar'
import CropperImage from './CropperImage'
import EPosition from './EPosition'
import WaterMark from './WaterMark.vue'
import DownloadBar from './DownloadBar'
import DrawerBar from './DrawerBar'
import FrameBar from './FrameBar'
</script>
