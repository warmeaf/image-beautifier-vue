<template>
  <div class="[&_label]:font-semibold [&_label]:text-sm">
    <label>Shadow</label>
    <a-slider
      :min="0"
      :max="6"
      @change="(val) => optionStore.setShadow(val)"
      :value="
        typeof optionStore.shadow === 'number' ? optionStore.shadow : 0
      "
    />
  </div>
</template>

<script setup>
import stores from '@stores/index'

const optionStore = stores.useOptionStore()
</script>