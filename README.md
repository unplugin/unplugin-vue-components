<h2 align='center'><samp>unplugin-vue-components</samp></h2>

<p align='center'>On-demand components auto importing for Vue.<br><sub>Works for Vite, Webpack, Vue CLI and more, powered by <a href="https://github.com/unjs/unplugin">unplugin</a></sub></p>

<p align='center'>
<a href='https://www.npmjs.com/package/unplugin-vue-components'>
<img src='https://img.shields.io/npm/v/unplugin-vue-components?color=222&style=flat-square'>
</a>
</p>

<br>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

<br>

## Usage

Install

```bash
npm i unplugin-vue-components -D
```

Add it to `vite.config.js`

```ts
// vite.config.js
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [
    Vue(),
    Components()
  ],
};
```

That's all.

Use components in templates as you would usually do, it will import components on demand and there is no `import` and `component registration` required anymore! If you register the parent component asynchronously (or lazy route), the auto-imported components will be code-split along with their parent.

Basically, it will automatically turn this

```html
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

into this

```html
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
import HelloWorld from './src/components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

## Migrate from `vite-plugin-components`

`package.json`

```diff
{
  "devDependencies": {
-   "vite-plugin-components": "*",
+   "unplugin-vue-components": "^0.14.0",
  }
}
```

`vite.config.json`

```diff
- import Components, { ElementPlusResolver } from 'vite-plugin-components'
+ import Components from 'unplugin-vue-components/vite'
+ import ElementPlusResolver from 'unplugin-vie-components/resolvers'

export default {
  plugins: [
    /* ... */
    Components({
      resolvers: [
        ElementPlusResolver(),
      ]
    }),
  ],
}
```

## TypeScript

To have TypeScript support for auto-imported components, there is [a PR](https://github.com/vuejs/vue-next/pull/3399) to Vue 3 extending the interface of global components. Currently, [Volar](https://github.com/johnsoncodehk/volar) has supported this usage already, if you are using Volar, you can change the config as following to get the support.

```ts
Components({
  dts: true, // enabled by default if `typescript is installed
})
```

Once the setup is done, a `components.d.ts` will be generated and updates automatically with the type definitions. Feel free to commit it into git or not as you want.

**Make sure you also add `components.d.ts` to your `tsconfig.json` under `includes`.**

## Vue 2 Support

It just works.

```ts
// vite.config.js
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [
    Vue2(),
    Components(),
  ],
}
```

## Importing from UI Libraries

We have several built-in resolvers for popular UI libraries like **Vuetify**, **Ant Design Vue**, and **Element Plus**, where you can enable them by:

Supported Resolvers:

- [Ant Design Vue](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/antdv.ts)
- [Element Plus](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/element-plus.ts)
- [Headless UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/headless-ui.ts)
- [Naive UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/naive-ui.ts)
- [Prime Vue](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/prime-vue.ts)
- [Vant](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vant.ts)
- [Varlet UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/varlet-ui.ts)
- [Vuetify](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vuetify.ts)
- [VueUse Components](https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/vueuse.ts)
- [View UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/resolvers/view-ui.ts)
- [Element UI](https://github.com/antfu/unplugin-vue-components/blob/main/src/resolvers/element-ui.ts)

```ts
// vite.config.js
import ViteComponents, {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
} from 'unplugin-vue-components/resolvers'

// your plugin installation
Components({
  resolvers: [
    AntDesignVueResolver(),
    ElementPlusResolver(),
    VantResolver(),
  ]
})
```

You can also write your own resolver easily:

```ts
Components({
  resolvers: [
    // example of importing Vant
    (name) => {
      // where `name` is always CapitalCase
      if (name.startsWith('Van'))
        return { importName: name.slice(3), path: 'vant' }
    }
  ]
})
```

If you made other UI libraries configured, please feel free to contribute so it can help others using them out-of-box. Thanks!

## Configuration

The following show the default values of the configuration

```ts
Components({
  // relative paths to the directory to search for components.
  dirs: ['src/components'],

  // valid file extensions for components.
  extensions: ['vue'],
  // search for subdirectories
  deep: true,

  // generate `components.d.ts` global declrations, 
  // also accepts a path for custom filename
  globalComponentsDeclaration: false,

  // Allow subdirectories as namespace prefix for components.
  directoryAsNamespace: false,
  // Subdirectory paths for ignoring namespace prefixes
  // works when `directoryAsNamespace: true`
  globalNamespaces: [],
})
```

## Example

See the [Vitesse](https://github.com/antfu/vitesse) starter template.

## Thanks

Thanks to [@brattonross](https://github.com/brattonross), this project is heavily inspired by [vite-plugin-voie](https://github.com/vamplate/vite-plugin-voie).

## License

MIT License © 2020 [Anthony Fu](https://github.com/antfu)
