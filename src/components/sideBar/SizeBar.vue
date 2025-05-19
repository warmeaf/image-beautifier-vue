<template>
  <a-popover
    trigger="click"
    :arrow="false"
    placement="bottomRight"
    :open="open"
    :overlay-class-name="
      cn(
        'shoteasy-components [&_.ant-popover-inner]:h-full [&_.ant-popover-inner]:overflow-x-hidden [&_.ant-popover-inner]:overflow-y-auto [&_.ant-popover-content]:h-full'
      )
    "
    :overlay-style="{
      width: '400px',
      height: `${height}px`,
    }"
    @open-change="handleOpenChange"
  >
    <div
      :class="
        cn(
          'px-3 py-1.5 border shrink-0 border-gray-200 dark:border-gray-700 gap-3 shadow-xs overflow-hidden max-h-12 rounded-md hover:border-blue-500 [&_svg]:hover:text-blue-500 cursor-pointer flex items-center',
          open && 'shadow-sm'
        )
      "
      ref="box"
    >
      <div
        class="border border-black/50 bg-black/10 dark:bg-white/20 dark:border-white/40 w-4 rounded-sm"
        :style="{
          aspectRatio: 4 / 3,
        }"
      />
      <div class="text-xs">
        <div class="font-semibold leading-3 mb-0.5">Auto</div>
        <div v-if="!isShowSize" class="text-gray-500 leading-3">
          Adaptive screenshot size
        </div>
        <div v-else class="text-gray-500 leading-3">1920 x 1080 px</div>
      </div>
      <div class="flex-1"></div>
      <chevron-up v-if="open" :size="16" />
      <chevron-down v-else :size="16" />
    </div>
    <template #title>
      <custom-size :frameWidth="800" :frameHeight="600" />
    </template>
    <template #content>
      <div
        class="border-t border-gray-200 dark:border-gray-800 py-2 divide-y divide-gray-200 dark:divide-gray-700"
        data-mode="light"
      >
        <div v-for="item in sizeConfig" :key="item.key">
          <div v-if="item.key !== 'default'" class="font-semibold pt-2">
            {{ item.title }}
          </div>
          <section class="flex flex-wrap items-end pb-2">
            <a-button
              v-for="(child, index) in item.lists"
              :key="index"
              type="text"
              class="size-bar-btn flex-[33%] p-3 flex-col gap-0 disabled:bg-blue-500/5 disabled:border-blue-500 disabled:cursor-default disabled:text-black"
              :disabled="checkSelected(item.key, child)"
            >
              <div class="py-2 px-3 w-full">
                <div
                  class="border border-black/50 bg-black/10 dark:bg-white/20 dark:border-white/40 w-full flex items-center justify-center rounded-md opacity-75"
                  :style="{ aspectRatio: child.w / child.h }"
                >
                  <span>{{ child.w }} : {{ child.h }}</span>
                </div>
              </div>
              <div v-if="child.title" class="text-xs">{{ child.title }}</div>
              <div class="text-xs overflow-hidden text-gray-500">
                {{ child.width }} x {{ child.height }}
              </div>
            </a-button>
          </section>
        </div>
      </div>
    </template>
  </a-popover>
</template>

<script setup>
import { ref, computed } from 'vue'

import Icon from '@components/Icon'
import CustomSize from './CustomSize'

import { cn, getMargin } from '@utils/utils'
import sizeConfig from '@utils/sizeConfig'

const ChevronUp = Icon.ChevronUp
const ChevronDown = Icon.ChevronDown

const open = ref(false)
const handleOpenChange = (val) => {
  open.value = val
}

const height = ref(500)
const isShowSize = ref(false)

const checkSelected = (key, item) => {
  return false
}
</script>
