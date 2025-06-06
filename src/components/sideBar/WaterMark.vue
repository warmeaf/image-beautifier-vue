<template>
  <div
    class="[&_label]:font-semibold [&_label]:text-sm flex gap-4 items-center justify-between"
  >
    <label>Watermark</label>
    <a-switch size="small" class="bg-slate-200" />
  </div>
</template>

<script setup>
import Icon from '@components/Icon'
import ColorPicker from '@components/ColorPicker'
import { text2Svg } from '@utils/utils'
</script>
