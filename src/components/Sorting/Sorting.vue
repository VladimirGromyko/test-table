<script setup lang='ts'>
import { defineProps, ref } from 'vue'
import { HeadingsElement } from '@/Pages/Journal/Table/TableHeader'

interface Props {
  property: HeadingsElement
}

const props = defineProps<Props>();
const transparencyUp = ref(true)
const transparencyDown = ref(true)
const arrow = {
  up: "up",
  down: "down",
  none: "none"
}
const handleClick = (value) => {
  debugger
  if (value.direction === arrow.up) {
    if (transparencyUp.value && !transparencyDown.value) {
      transparencyDown.value = !transparencyDown.value
    }
    transparencyUp.value = !transparencyUp.value
  } else if (value.direction === arrow.down) {
    if (transparencyDown.value && !transparencyUp.value) {
      transparencyUp.value = !transparencyUp.value
    }
    transparencyDown.value = !transparencyDown.value
  }
}
</script>

<template>
  <span class='sort-wrapper'>
    <div v-if="props.property.arrow === arrow.none" class="arrow-block">
      <button
        @click="handleClick({block: arrow.none, direction: arrow.up})"
        :class="['button', 'arrow-up', transparencyUp ? 'translucent': '']">
      </button>
      <button
        @click="handleClick({block: arrow.none, direction: arrow.down})"
        :class="['button', 'arrow-down', transparencyDown ? 'translucent': '']">
      </button>
    </div>
<!--    <div v-else-if="props.property.arrow === arrow.down" class="arrow-block">-->
<!--      <button-->
<!--        @click="handleClick({block: arrow.down, arrow: arrow.down})"-->
<!--        :class="['button', 'triangle', 'arrow-down', transparency ? 'translucent': '']">-->
<!--      </button>-->
<!--      <button-->
<!--        @click="handleClick({block: arrow.down, arrow: arrow.up})"-->
<!--        :class="['button', 'triangle', 'arrow-up', transparency ? 'translucent': '']">-->
<!--      </button>-->
<!--    </div>-->
<!--    <div v-else-if="props.property.arrow === arrow.up" class="arrow-block">-->
<!--      <button-->
<!--        @click="handleClick({block: arrow.up, arrow: arrow.up})"-->
<!--        :class="['button', 'triangle', 'arrow-up', transparency ? 'translucent': '']">-->
<!--      </button>-->
<!--      <button-->
<!--        @click="handleClick({block: arrow.up, arrow: arrow.down})"-->
<!--        :class="['button', 'triangle', 'arrow-down', transparency ? 'translucent': '']">-->
<!--      </button>-->
<!--    </div>-->

<!--    {sort === `0${sorting}`-->
<!--    && <button className={s.button}>-->
<!--    <div className={s.triangle_down}></div>-->
<!--  </button>}-->
<!--    {show !== 'none'-->
<!--    && <button className={s.buttonGrey} onClick={() => handleClick(sorting)}>-->
<!--    {show === 'down'-->
<!--    ? <div className={s.triangle_down}></div>-->
<!--    : <div className={s.triangle_up}></div>-->
<!--    }-->
<!--    </button>-->
<!--    }-->
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
</style>
