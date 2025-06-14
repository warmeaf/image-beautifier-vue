<template>
  <div class="md:w-0 md:flex-1 overflow-hidden select-none relative">
    <div ref="target" class="w-full h-full relative z-0">
      <e-view v-if="showView" :target="target" />
    </div>
    <e-zoom />
  </div>
</template>

<script setup>
import { useTemplateRef, computed } from 'vue'
import EView from './View'
import EZoom from './Zoom'
defineOptions({
  name: 'EEditor',
})

const target = useTemplateRef('target')
const showView = computed(() => target.value)
</script>
