<script setup lang='ts'>
const props = defineProps({
  msg: String,
})
</script>

<template>
  <h3>Component A: {{ msg }}</h3>
</template>
