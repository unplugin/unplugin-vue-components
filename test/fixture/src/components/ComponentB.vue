<template>
  <h3>Component B: {{ msg }}</h3>
</template>

<script setup='props' lang='ts'>
import { defineProps } from 'vue'

const props = defineProps({
  msg: String
})
</script>
