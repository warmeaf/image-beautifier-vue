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
import { SizeBar, FrameBar, QuickActionsBar } from './bars'
import { ScaleControl, PaddingControl, RoundedControl, ShadowControl } from './controls'
import { BackgroundSelector } from './background'
import { WaterMark } from './features'

defineEmits(['showMore'])
</script>