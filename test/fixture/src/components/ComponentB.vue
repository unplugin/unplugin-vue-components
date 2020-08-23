<template>
  <h3>Component B: {{ msg }}</h3>
</template>

<script setup='props' lang='ts'>
declare const props: {
  msg?: string
}
</script>
