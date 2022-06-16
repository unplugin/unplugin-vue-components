<script>
export default {
  name: 'HelloWorld1',
  props: {
    msg: String,
  },
}
</script>

<template>
  <div>
    <h1>Hello World 1 {{ msg }}</h1>
  </div>
</template>
