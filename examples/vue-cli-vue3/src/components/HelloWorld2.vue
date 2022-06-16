<script>
export default {
  name: 'HelloWorld2',
  props: {
    msg: String,
  },
}
</script>

<template>
  <div>
    <h1>Hello World 2 {{ msg }}</h1>
  </div>
</template>
