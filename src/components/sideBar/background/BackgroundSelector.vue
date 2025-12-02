<template>
  <div class="[&_label]:font-semibold [&_label]:text-sm">
    <div class="flex justify-between items-center">
      <label>Background</label>
      <a-button
        type="text"
        size="small"
        class="icon-btn text-xs flex items-center opacity-80 m-0"
        @click="
          () => {
            $emit('showMore', true)
          }
        "
        ><span>More</span>
        <chevron-right class="relative top-[1px]" :size="16"
      /></a-button>
    </div>
    <div class="py-3">
      <a-radio-group
        :value="optionStore.background"
        class="!grid grid-cols-7 [&_span]:ps-0"
        @change="onBgChange"
      >
        <a-radio
          class="[&_.ant-radio]:hidden! [&_span]:p-0 mr-0"
          value="default_1"
        >
          <div
            :class="
              cn('w-8 h-8 rounded-full', backgroundConfig.default_1.class)
            "
          ></div>
        </a-radio>
        <template v-for="key in Object.keys(backgroundConfig)">
          <a-radio
            v-if="key.includes('default') && key !== 'default_1'"
            :key="key"
            :value="key"
            class="[&_.ant-radio]:hidden! [&_span]:p-0 mr-0"
          >
            <div
              :class="
                cn('w-8 h-8 rounded-full', backgroundConfig[key].class)
              "
            ></div>
          </a-radio>
        </template>
      </a-radio-group>
    </div>
  </div>
</template>

<script setup>
import Icon from '@components/Icon'
import stores from '@stores/index'
import backgroundConfig from '@utils/backgroundConfig'
import { cn } from '@utils/utils'

const emit = defineEmits(['showMore'])
const optionStore = stores.useOptionStore()
const ChevronRight = Icon.ChevronRight

const onBgChange = (e) => {
  const key = e.target.value
  optionStore.setBackground(key)
}
</script>