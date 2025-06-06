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
      <div class="[&_label]:font-semibold [&_label]:text-sm">
        <label>Shadow</label>
        <a-slider :min="0" :max="6" />
      </div>
      <frame-bar />
      <div class="[&_label]:font-semibold [&_label]:text-sm">
        <div class="flex justify-between items-center">
          <label>Background</label>
          <a-button
            type="text"
            size="small"
            class="icon-btn text-xs flex items-center opacity-80 m-0"
            ><span>More</span>
            <chevron-right class="relative top-[1px]" :size="16"
          /></a-button>
        </div>
        <div class="py-3">
          <a-radio-group
            :value="backgroundValue"
            class="!grid grid-cols-7 [&_span]:ps-0"
          >
            <a-radio
              class="[&_.ant-radio]:hidden! [&_span]:p-0 mr-0"
              value="default_1"
            >
              <div
                :class="
                  cn('w-8 h-8 rounded-full', backgroundConfig.default_1.class)
                "
              ></div>
            </a-radio>
            <template v-for="key in Object.keys(backgroundConfig)">
              <a-radio
                v-if="key.includes('default') && key !== 'default_1'"
                :key="key"
                :value="key"
                class="[&_.ant-radio]:hidden! [&_span]:p-0 mr-0"
              >
                <div
                  :class="
                    cn('w-8 h-8 rounded-full', backgroundConfig[key].class)
                  "
                ></div>
              </a-radio>
            </template>
          </a-radio-group>
        </div>
      </div>
      <water-mark />
    </div>
    <download-bar />
    <drawer-bar />
  </div>
</template>

<script setup>
import { h, ref } from 'vue'

import { cn } from '@utils/utils'
import backgroundConfig from '@utils/backgroundConfig'

import Icon from '@components/Icon'
import ColorPicker from '@components/ColorPicker'
import SizeBar from './SizeBar'
import CropperImage from './CropperImage'
import EPosition from './EPosition'
import WaterMark from './WaterMark.vue'
import DownloadBar from './DownloadBar'
import DrawerBar from './DrawerBar'
import FrameBar from './FrameBar'

const ChevronRight = Icon.ChevronRight
const backgroundValue = ref('default_1')
</script>
