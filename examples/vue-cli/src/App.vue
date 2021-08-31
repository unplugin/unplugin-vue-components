<template>
  <div id="app">
    <veui-input-group>
      <veui-input />
      <veui-button>OK</veui-button>
    </veui-input-group>

    <veui-select>
      <veui-option value="1">
        Option 1
      </veui-option>
      <veui-option value="2">
        Option 2
      </veui-option>
    </veui-select>

    <veui-date-picker />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
