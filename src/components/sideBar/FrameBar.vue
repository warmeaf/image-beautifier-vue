<template>
  <div class="[&_label]:font-semibold [&_label]:text-sm">
    <div class="flex justify-between items-center">
      <label>Frame</label>
      <a-button
        type="text"
        size="small"
        class="icon-btn text-xs flex items-center opacity-80 m-0"
        ><span>More</span> <chevron-right class="relative top-[1px]" :size="16"
      /></a-button>
    </div>
    <div
      class="py-3 [&_.ant-radio-wrapper_span]:p-0! [&_.ant-radio-wrapper_span]:px-1!"
    >
      <a-radio-group
        class="!grid grid-cols-5"
        @change="handelChange"
        :value="optionStore.frame"
      >
        <a-radio
          class="[&_.ant-radio]:hidden! [&_span]:mr-0 [&_span]:block! [&_span]:w-full"
          value="none"
        >
          <div class="bg-gray-300/30 rounded-md h-8 overflow-hidden">
            <div
              class="bg-slate-300/40 h-7 w-[85%] rounded-md shadow-sm -mt-1 -ml-1"
            ></div>
          </div>
        </a-radio>
        <a-radio
          class="[&_.ant-radio]:hidden! [&_span]:mr-0 [&_span]:block! [&_span]:w-full"
          value="light"
        >
          <div class="bg-gray-300/30 rounded-md h-8 overflow-hidden">
            <div
              class="bg-slate-300/40 border-2 border-white/80 h-7 w-[85%] rounded-md shadow-sm -mt-1 -ml-1"
            ></div>
          </div>
        </a-radio>
        <a-radio
          class="[&_.ant-radio]:hidden! [&_span]:mr-0 [&_span]:block! [&_span]:w-full"
          value="dark"
        >
          <div class="bg-gray-300/30 rounded-md h-8 overflow-hidden">
            <div
              class="bg-slate-300/40 border-2 border-black/40 h-7 w-[85%] rounded-md shadow-sm -mt-1 -ml-1"
            ></div>
          </div>
        </a-radio>
        <a-radio
          class="[&_.ant-radio]:hidden! [&_span]:mr-0 [&_span]:block! [&_span]:w-full"
          value="macosBarLight"
        >
          <div class="bg-gray-300/30 rounded-md h-8 overflow-hidden">
            <div
              class="bg-slate-300/40 h-7 w-[85%] rounded-sm shadow-sm mt-2 ml-3 overflow-hidden"
            >
              <div
                class="h-1.5 bg-white/90 px-0.5 flex items-center gap-[1px] before:block before:rounded-full before:w-0.5 before:h-0.5 before:bg-red-500 after:w-0.5 after:h-0.5 after:bg-green-500"
              >
                <i class="block w-0.5 h-0.5 bg-yellow-500"></i>
              </div>
            </div>
          </div>
        </a-radio>
        <a-radio
          class="[&_.ant-radio]:hidden! [&_span]:mr-0 [&_span]:block! [&_span]:w-full"
          value="macosBarDark"
        >
          <div class="bg-gray-300/30 rounded-md h-8 overflow-hidden">
            <div
              class="bg-slate-300/40 h-7 w-[85%] rounded-sm shadow-sm mt-2 ml-3 overflow-hidden"
            >
              <div
                class="h-1.5 bg-black/90 px-0.5 flex items-center gap-[1px] before:block before:rounded-full before:w-0.5 before:h-0.5 before:bg-red-500 after:w-0.5 after:h-0.5 after:bg-green-500"
              >
                <i class="block w-0.5 h-0.5 bg-yellow-500"></i>
              </div>
            </div>
          </div>
        </a-radio>
      </a-radio-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import stores from '@stores/index'
import Icon from '@components/Icon'
import { windowDark, windowLight } from '@utils/windowsIcon'

import macbookpro from '@assets/macbookpro.png'
import macbookair from '@assets/macbook-air-little.png'
import imacpro from '@assets/imac.png'
import ipadpro from '@assets/ipad.png'
import iphonepro from '@assets/iphone.png'

const optionStore = stores.useOptionStore()

const ChevronRight = Icon.ChevronRight
const handelChange = (e) => {
  const { value } = e.target
  optionStore.setFrame(value)
  if (value === 'macbookpro16') {
    optionStore.setPaddingBg('#000000')
  }
}
</script>
