<template>
  <div
    class="[&_label]:font-semibold [&_label]:text-sm flex gap-4 items-center justify-between"
  >
    <label>Watermark</label>
    <a-switch
      size="small"
      class="bg-slate-200"
      :checked="useWater"
      @change="setUseWater"
    />
  </div>
  <div
    v-if="useWater"
    class="[&_label]:font-semibold [&_label]:text-xs grid gap-3 pl-2 pt-2"
  >
    <a-input
      :default-value="waterCont"
      placeholder="Watermark content"
      @change="(e) => setWaterCont(e.target.value)"
    />
    <div class="flex items-center justify-between">
      <label>Color</label>
      <ColorPicker
        :value="waterColor"
        @change="handleColorChange"
        size="small"
      />
    </div>
    <div class="flex items-center justify-between">
      <label>Direction</label>
      <div>
        <a-radio-group
          :value="direction"
          @change="(e) => setDirection(e.target.value)"
          size="small"
        >
          <a-radio-button :value="-45"
            ><ArrowUpRight :size="16" class="mt-[3px]"
          /></a-radio-button>
          <a-radio-button :value="45"
            ><ArrowDownRight :size="16" class="mt-[3px]"
          /></a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <label>Only Background</label>
      <a-switch
        size="small"
        :checked="onlyBackground"
        @change="(checked) => setOnlyBackground(checked)"
        class="bg-slate-200"
      />
    </div>
  </div>
</template>

<script setup>
import ColorPicker from '@components/ColorPicker'
import Icon from '@components/Icon'
import stores from '@stores/index'
import { text2Svg } from '@utils/utils'
import { ref, watch } from 'vue'

const ArrowUpRight = Icon.ArrowUpRight
const ArrowDownRight = Icon.ArrowDownRight

const optionStore = stores.useOptionStore()

const useWater = ref(false)
const onlyBackground = ref(false)
const waterCont = ref('ShotEasy')
const waterColor = ref('#00000030')
const direction = ref(45)

const handleColorChange = (color) => {
  waterColor.value = typeof color === 'string' ? color : color.toRgbString()
}

const setUseWater = (val) => {
  useWater.value = val
}
const setWaterCont = (val) => {
  waterCont.value = val
}
const setDirection = (val) => {
  direction.value = val
}
const setOnlyBackground = (val) => {
  onlyBackground.value = val
  optionStore.setWaterIndex(val ? -1 : 1)
}

watch([useWater, waterCont, waterColor, direction], () => {
  if (useWater.value && waterCont.value.trim()) {
    const svgImg = text2Svg({
      text: waterCont.value,
      color: waterColor.value,
      angleDegrees: direction.value,
    })
    optionStore.setWaterImg(svgImg)
  } else {
    optionStore.setWaterImg(null)
  }
})
</script>
