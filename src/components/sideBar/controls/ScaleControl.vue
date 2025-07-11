<template>
  <div class="[&_label]:font-semibold [&_label]:text-sm">
    <label>Scale</label>
    <a-slider
      :min="0.1"
      :max="3"
      :step="0.1"
      :value="typeof optionStore.scale === 'number' ? optionStore.scale : 1"
      @change="
        (val) => {
          optionStore.setScale(val)
        }
      "
    />
  </div>
</template>

<script setup>
import stores from '@stores/index'

const optionStore = stores.useOptionStore()
</script>