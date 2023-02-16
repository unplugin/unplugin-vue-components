# Pause on New Resolvers

Thank you for your interest in contributing to this project!

Due to the maintenance burden of new resolvers, **⚠️ we no longer accept new resolvers** adding to this repo.

Instead, we suggest UI libraries to maintain and publish their own resolvers, as the resolvers are more coupled to their structure.

We recommend to have it under a submodule, or publish as a separate package.

```ts
import Components from 'unplugin-vue-components'
import MyLibResolver from 'my-lib/auto-import-resolver' // <--

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        MyLibResolver
      ]
    })
  ]
})
```

Even for existing resolvers, we would also recommend to move them to their own packages to have the faster release cycle. Once you have done so, we are happy to accept PR to deprecate and forward the resolver to your package.

Thanks you.
