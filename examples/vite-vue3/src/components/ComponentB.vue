<script setup='props' lang='ts'>
import { defineProps } from 'vue'

defineProps({
  msg: String,
})
</script>

<template>
  <h3>Component B: {{ msg }}</h3>
</template>
