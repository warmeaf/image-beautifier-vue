<template>
  <a-drawer
    placement="right"
    :closable="false"
    :mask="false"
    :open="showMore"
    :get-container="false"
    width="100%"
    class="[&_.ant-drawer-body]:p-0!"
  >
    <div class="flex flex-col gap-2 h-full overflow-hidden">
      <div class="shrink-0 pt-4 px-4">
        <a-button
          type="text"
          size="small"
          class="icon-btn text-xs flex items-center opacity-80 m-0"
          @click="
            () => {
              setShowMore(false)
            }
          "
          ><span>Back</span>
          <chevron-right class="relative top-[1px]" :size="16"
        /></a-button>
      </div>
      <div class="h-0 flex-1 overflow-y-auto px-4 py-2">
        <h4 class="text-sm font-bold py-2">Custom</h4>
        <div class="py-1">
          <color-picker @change="handleCustom">
            <a-button
              type="default"
              size="small"
              shape="circle"
              class="icon-btn"
              :icon="h('img', { src: colorSvg, width: '18px' })"
            />
          </color-picker>
        </div>
        <h4 class="text-sm font-bold py-2">Solid Colors</h4>
        <background-select
          type="solid"
          @change="onSelectChange"
          :value="optionStore.background"
        />
        <h4 class="text-sm font-bold py-2">Gradients</h4>
        <background-select
          type="gradient"
          @change="onSelectChange"
          :value="optionStore.background"
        />
        <h4 class="text-sm font-bold py-2">Cosmic Gradients</h4>
        <background-select
          type="cosmic"
          @change="onSelectChange"
          :value="optionStore.background"
        />
        <h4 class="text-sm font-bold py-2">Desktop</h4>
        <background-select
          type="desktop"
          @change="onSelectChange"
          :value="optionStore.background"
        />
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { h } from 'vue'
import Icon from '@components/Icon'
import ColorPicker from '@components/ColorPicker'
import colorSvg from '@assets/color.svg'
import BackgroundSelect from './BackgroundSelect'
import stores from '@stores/index'
const optionStore = stores.useOptionStore()
const ChevronRight = Icon.ChevronRight

defineProps({
  showMore: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['change'])

const setShowMore = (val) => {
  emits('change', false)
}
const handleCustom = (e) => {
  const color = e.toHexString()
  optionStore.frameConf.background = {
    type: 'solid',
    color,
  }
}
const onSelectChange = (key) => {
  optionStore.setBackground(key)
}
</script>
