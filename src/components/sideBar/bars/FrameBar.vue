<template>
  <div class="[&_label]:font-semibold [&_label]:text-sm">
    <div class="flex justify-between items-center">
      <label>Frame</label>
      <a-button
        type="text"
        size="small"
        class="icon-btn text-xs flex items-center opacity-80 m-0"
        @click="
          () => {
            setShowMore(true)
          }
        "
        ><span>More</span> <chevron-right class="relative top-[1px]" :size="16"
      /></a-button>
    </div>
    <div
      class="py-3 [&_.ant-radio-wrapper_span]:p-0! [&_.ant-radio-wrapper_span]:px-1!"
    >
      <a-radio-group
        class="!grid grid-cols-3"
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
      </a-radio-group>
    </div>
  </div>
  <a-drawer
    placement="right"
    :closable="false"
    :mask="false"
    :open="showMore"
    :get-container="false"
    @close="setShowMore"
    width="100%"
    class="[&_.ant-drawer-body]:p-0!"
  >
    <div class="flex flex-col gap-2 h-full overflow-hidden">
      <div class="shrink-0 pt-4 px-4">
        <a-button
          type="text"
          size="small"
          class="icon-btn text-xs flex items-center opacity-80 m-0"
          @click="
            () => {
              setShowMore(false)
            }
          "
          ><span>Back</span>
          <chevron-right class="relative top-[1px]" :size="16"
        /></a-button>
      </div>
      <div class="h-0 flex-1 overflow-y-auto px-4 py-2">
        <h4 class="text-sm font-bold py-2">Browser</h4>
        <div
          class="py-3 [&_.ant-radio-wrapper_span]:p-0 [&_.ant-radio-wrapper_span]:px-1"
        >
          <a-radio-group
            class="grid! grid-cols-3!"
            @change="handelChange"
            :value="optionStore.frame"
          >
            <a-radio
              class="[&_.ant-radio]:hidden! [&_span]:mr-0! [&_span]:block! [&_span]:w-full!"
              value="windowsBarLight"
            >
              <div class="bg-gray-300/30 rounded-md h-14 overflow-hidden">
                <div
                  class="bg-slate-300/40 h-12 w-[85%] rounded-sm shadow-md mt-2 ml-3 overflow-hidden"
                >
                  <div class="bg-white/90 px-0.5">
                    <div
                      class="h-2.5 bg-no-repeat bg-[right_center] bg-[auto_100%]"
                      :style="{
                        backgroundImage: `url(${windowLight})`,
                      }"
                    />
                  </div>
                </div>
              </div>
            </a-radio>
          </a-radio-group>
        </div>
        <div class="flex justify-between items-center py-2">
          <h4 class="text-sm font-bold">Devices</h4>
          <a-radio-group
            :value="optionStore.frameMode"
            @change="(e) => optionStore.setFrameMode(e.target.value)"
            size="small"
          >
            <a-radio-button value="cover">Cover</a-radio-button>
            <a-radio-button value="fit">Contain</a-radio-button>
            <a-radio-button value="strench">Stretch</a-radio-button>
          </a-radio-group>
        </div>
        <div
          class="py-3 [&_.ant-radio-wrapper_span]:p-0 [&_.ant-radio-wrapper_span]:px-1"
        >
          <a-radio-group
            class="grid! grid-cols-3!"
            @change="handelChange"
            :value="optionStore.frame"
          >
            <a-radio
              class="[&_.ant-radio]:hidden! [&_span]:mr-0! [&_span]:block! [&_span]:w-full!"
              value="macbookpro16"
            >
              <div
                class="bg-gray-300/30 rounded-md h-14 overflow-hidden bg-no-repeat bg-[10px_-5px] bg-[100px_auto]"
                :style="{
                  backgroundImage: `url(${macbookpro})`,
                }"
              />
            </a-radio>
            <a-radio
              class="[&_.ant-radio]:hidden! [&_span]:mr-0! [&_span]:block! [&_span]:w-full!"
              value="macbookair"
            >
              <div
                class="bg-gray-300/30 rounded-md h-14 overflow-hidden bg-no-repeat bg-[13px_-6px] bg-[92px_auto]"
                :style="{
                  backgroundImage: `url(${macbookair})`,
                }"
              />
            </a-radio>
            <a-radio
              class="[&_.ant-radio]:hidden! [&_span]:mr-0! [&_span]:block! [&_span]:w-full!"
              value="imacpro"
            >
              <div
                class="bg-gray-300/30 rounded-md h-14 overflow-hidden bg-no-repeat bg-[13px_top] bg-[90px_auto]"
                :style="{
                  backgroundImage: `url(${imacpro})`,
                }"
              />
            </a-radio>
            <a-radio
              class="[&_.ant-radio]:hidden! [&_span]:mr-0! [&_span]:block! [&_span]:w-full!"
              value="ipadpro"
            >
              <div
                class="bg-gray-300/30 rounded-md h-14 overflow-hidden bg-no-repeat bg-[center_top] bg-[100px_auto]"
                :style="{
                  backgroundImage: `url(${ipadpro})`,
                }"
              />
            </a-radio>
            <a-radio
              class="[&_.ant-radio]:hidden! [&_span]:mr-0! [&_span]:block! [&_span]:w-full!"
              value="iphonepro"
            >
              <div
                class="bg-gray-300/30 rounded-md h-14 overflow-hidden bg-no-repeat bg-[center_top] bg-[100px_auto]"
                :style="{
                  backgroundImage: `url(${iphonepro})`,
                }"
              />
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue'
import stores from '@stores/index'
import Icon from '@components/Icon'
import { windowLight } from '@utils/windowsIcon'

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

const showMore = ref(false)
const setShowMore = (val) => {
  showMore.value = val
}
</script>
