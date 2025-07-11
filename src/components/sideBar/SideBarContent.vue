<template>
  <div class="flex-1 flex-col gap-2 p-4 overflow-y-auto overflow-x-hidden">
    <size-bar />
    <quick-actions-bar />
    <scale-control />
    <padding-control />
    <rounded-control />
    <shadow-control />
    <frame-bar />
    <background-selector @show-more="$emit('showMore', $event)" />
    <water-mark />
  </div>
</template>

<script setup>
import SizeBar from './SizeBar'
import QuickActionsBar from './QuickActionsBar'
import ScaleControl from './ScaleControl'
import PaddingControl from './PaddingControl'
import RoundedControl from './RoundedControl'
import ShadowControl from './ShadowControl'
import FrameBar from './FrameBar'
import BackgroundSelector from './BackgroundSelector'
import WaterMark from './WaterMark.vue'

defineEmits(['showMore'])
</script>