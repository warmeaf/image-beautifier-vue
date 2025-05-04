<template>
  <div
    class="md:w-0 md:flex-1 flex flex-col justify-center items-center overflow-hidden select-none relative"
  >
    <div :class="cn('max-w-[600px]', 'invalid')"></div>
  </div>
</template>

<script setup>
import { cn } from '@utils/utils'

defineOptions({
  name: 'EInit',
})
</script>
