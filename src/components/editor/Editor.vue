<template>
  <div class="md:w-0 md:flex-1 overflow-hidden select-none relative">
    <EView />
    <EZoom />
  </div>
</template>

<script setup>
import EView from './View'
import EZoom from './Zoom'

defineOptions({
  name: 'EEditor',
})
</script>
