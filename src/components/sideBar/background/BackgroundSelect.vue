<template>
  <a-radio-group
    @change="(e) => onChange(e.target.value)"
    :value="value"
    :class="
      cn(
        'grid! [&_span]:ps-0!',
        isImg.includes(type)
          ? 'grid-cols-5! gap-y-1.5!'
          : 'grid-cols-7! gap-y-3!'
      )
    "
  >
    <a-radio
      v-for="(item, index) in lists"
      :key="index"
      class="[&_.ant-radio]:hidden! [&_span]:p-0! mr-0!"
      :value="item.key"
    >
      <div
        v-if="isImg.includes(type)"
        :class="cn('w-12 h-8 rounded-md overflow-hidden')"
      >
        <img
          :src="`${item.value.class}&w=48`"
          class="w-full h-full object-cover object-center"
        />
      </div>
      <div
        v-else
        :class="cn('w-8 h-8 rounded-full overflow-hidden', item.value.class)"
      ></div>
    </a-radio>
  </a-radio-group>
</template>

<script setup>
import { computed } from 'vue'
import backgroundConfig from '@utils/backgroundConfig'
import { cn } from '@utils/utils'

const isImg = ['cosmic', 'desktop']

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  options: {
    type: Object,
    default: () => backgroundConfig,
  },
})
const emits = defineEmits(['change'])
const onChange = (val) => {
  emits('change', val)
}

const lists = computed(() => {
  const arr = []
  Object.keys(props.options).map((key) => {
    if (key.includes(props.type)) {
      arr.push({
        key,
        value: props.options[key],
      })
    }
  })
  return arr
})
</script>
