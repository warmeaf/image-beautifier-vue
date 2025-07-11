<template>
  <div class="[&_label]:font-semibold [&_label]:text-sm">
    <label>Rounded</label>
    <a-slider
      :min="0"
      :max="20"
      @change="(val) => optionStore.setRound(val)"
      :value="typeof optionStore.round === 'number' ? optionStore.round : 0"
    />
  </div>
</template>

<script setup>
import stores from '@stores/index'

const optionStore = stores.useOptionStore()
</script>