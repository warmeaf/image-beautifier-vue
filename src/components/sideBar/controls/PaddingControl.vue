<template>
  <div class="[&_label]:font-semibold [&_label]:text-sm">
    <div class="flex justify-between">
      <label>Padding</label>
      <color-picker
        :value="optionStore.paddingBg"
        @change="
          (tinyColor) => {
            optionStore.setPaddingBg(tinyColor.toRgbString())
          }
        "
      />
    </div>
    <a-slider
      :min="0"
      :max="60"
      @change="(val) => optionStore.setPadding(val)"
      :value="
        typeof optionStore.padding === 'number' ? optionStore.padding : 0
      "
    />
  </div>
</template>

<script setup>
import ColorPicker from '@components/ColorPicker'
import stores from '@stores/index'

const optionStore = stores.useOptionStore()
</script>