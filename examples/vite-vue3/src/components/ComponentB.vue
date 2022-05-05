<script setup='props' lang='ts'>
import { defineProps } from 'vue'

const props = defineProps({
  msg: String,
})
</script>

<template>
  <h3>Component B: {{ msg }}</h3>
</template>
