<template>
  <h3>Component C: {{ msg }}</h3>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue'

const props = defineProps({
  msg: String
})
</script>
