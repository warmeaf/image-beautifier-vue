<template>
  <div
    class="bg-white flex flex-col md:w-[340px] border-l border-l-gray-50 shadow-lg relative z-10 select-none"
  >
    <side-bar-content @show-more="setShowMore" />
    <download-bar />
    <drawer-bar :show-more="showMore" @change="setShowMore" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DrawerBar } from './background'
import { DownloadBar } from './bars'
import SideBarContent from './SideBarContent'

const showMore = ref(false)
const setShowMore = (val) => {
  showMore.value = val
}
</script>
