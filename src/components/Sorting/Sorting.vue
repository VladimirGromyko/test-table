<script setup lang='ts'>
import { defineEmits, defineProps } from 'vue'
import { HeadingsElement, triangleViewType } from '@/Pages/Journal/index.types'
import { arrow } from '@/assets/constants/tableConstants'


interface Props {
  property: HeadingsElement
}

const props = defineProps<Props>();
const emit = defineEmits(["handleSort"]);

const handleClick = (direction: triangleViewType) => {
  if (direction === props.property.arrow) {
    emit("handleSort", {  sortField: props.property.sortField, arrow: arrow.none})
  } else {
    emit("handleSort", {  sortField: props.property.sortField, arrow: direction})
  }
}
</script>

<template>
  <span v-if="props.property.sortField !== 'none'"
        :class="['sort-wrapper', props.property.arrow !== arrow.none ? 'visible': '']"
  >
    <div class="arrow-block">
      <button
        @click="handleClick(arrow.up)"
        :class="['button', 'arrow-up', props.property.arrow !== arrow.up ? 'translucent': '']">
      </button>
      <button
        @click="handleClick(arrow.down)"
        :class="['button', 'arrow-down', props.property.arrow !== arrow.down ? 'translucent': '']">
      </button>
    </div>
  </span>
</template>

<style scoped lang="scss">
.sort-wrapper {
  display: flex;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}
.arrow-block {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.button{
  border: none;
  background: none;
  padding: 0;
  margin-left: 5px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  cursor: pointer;
}
.arrow-down {
  border-top: 11px solid $neutral900;
}
.arrow-up {
  border-bottom: 11px solid $neutral900;
}
.translucent {
  opacity: 40%;
}
.visible {
  opacity: 1;
}
</style>
