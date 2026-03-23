import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
})
  .removeRules(
    'e18e/prefer-static-regex',
    'markdown/heading-increment',
  )
