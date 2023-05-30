<script setup lang='ts'>
import { defineProps } from 'vue'

defineProps({
  msg: String,
})
</script>

<template>
  <h3>Component C: {{ msg }}</h3>
</template>
