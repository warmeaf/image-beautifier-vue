<template>
  <div
    class="flex items-center justify-center shrink-0 gap-3 bg-white dark:bg-black py-2 px-5 border-b border-b-gray-50 dark:border-b-gray-700 shadow-sm relative z-[11] select-none"
  >
    <div class="flex-1">
      <e-logo />
    </div>
  </div>
</template>

<script setup>
import ELogo from '@components/header/Logo'

defineOptions({
  name: 'EHeader',
})
</script>
