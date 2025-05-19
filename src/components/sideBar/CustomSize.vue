<template>
  <div class="flex gap-2 items-center py-2 font-normal">
    <a-input-number
      :min="1"
      :value="width"
      :placeholder="frameWidth"
      class="flex-1"
    >
      <template #prefix>
        <span class="opacity-60 mx-1">W</span>
      </template>
    </a-input-number>
    <span class="text-xs opacity-50">x</span>
    <a-input-number
      :min="1"
      :value="height"
      :placeholder="frameHeight"
      class="flex-1"
    >
      <template #prefix>
        <span class="opacity-60 mx-1">H</span>
      </template>
    </a-input-number>
    <a-button
      type="primary"
      shape="circle"
      class="icon-btn"
      :icon="h(Icon.Check, { size: 18 })"
      :disabled="!width || !height"
    ></a-button>
    <a-tooltip title="Auto size">
      <a-button
        type="primary"
        shape="circle"
        class="icon-btn"
        :icon="h(Icon.Maximize, { size: 18 })"
        :disabled="type === 'auto'"
      ></a-button>
    </a-tooltip>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'

import Icon from '@components/Icon'

const height = ref('')
const width = ref('')
const frameWidth = ref(1920)
const frameHeight = ref(1080)
</script>
