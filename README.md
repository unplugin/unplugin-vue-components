<h2 align='center'><samp>vite-plugin-components</samp></h2>

<p align='center'>On demand components auto importing for Vite</p>

<p align='center'>
<a href='https://www.npmjs.com/package/vite-plugin-components'>
<img src='https://img.shields.io/npm/v/vite-plugin-components?color=222&style=flat-square'>
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

> ℹ️ **Vite 2 is supported from `v0.6.x`, Vite 1's support is discontinued.**

Install

```bash
npm i vite-plugin-components -D # yarn add vite-plugin-components -D
```

Add it to `vite.config.js`

```ts
// vite.config.js
import Vue from '@vitejs/plugin-vue'
import ViteComponents from 'vite-plugin-components'

export default {
  plugins: [
    Vue(),
    ViteComponents()
  ],
};
```

That's all.

Use components in templates as you would usually do but NO `import` and `component registration` required anymore! It will import components on demand, code splitting is also possible.

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

## TypeScript

To have TypeScript support for auto-imported components, there is [a PR](https://github.com/vuejs/vue-next/pull/3399) to Vue 3 extending the interface of global components. Currently, [Volar](https://github.com/johnsoncodehk/volar) has supported this usage already, if you are using Volar, you can change the config as following to get the support.

```ts
// vite.config.js
import ViteComponents from 'vite-plugin-components'

export default {
  plugins: [
    /* ... */
    ViteComponents({
      globalComponentsDeclaration: true,
    }),
  ],
}
```

Once the setup is done, a `components.d.ts` will be generated and updates automatically with the type definitions. Feel free to commit it into git or not as you want.

## Vue 2 Support

It just works.

```ts
// vite.config.js
import { createVuePlugin } from 'vite-plugin-vue2'
import ViteComponents from 'vite-plugin-components'

export default {
  plugins: [
    createVuePlugin(),
    ViteComponents(),
  ],
}
```

## Importing from UI Libraries

We have several built-in resolvers for popular UI libraries like **Vuetify**, **Ant Design Vue**, and **Element Plus**, where you can enable them by:

Supported Resolvers:

- [Ant Design Vue](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/antdv.ts)
- [Element Plus](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/element-plus.ts)
- [Headless UI](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/headless-ui.ts)
- [Native UI](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/naive-ui.ts)
- [Vant](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/vant.ts)
- [Varlet UI](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/varlet-ui.ts)
- [Vuetify](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/vuetify.ts)
- [VueUse Components](https://github.com/antfu/vite-plugin-components/blob/master/src/resolvers/vueuse.ts)

```ts
// vite.config.js
import ViteComponents, {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
} from 'vite-plugin-components'

export default {
  plugins: [
    /* ... */
    ViteComponents({
      customComponentResolvers: [
        AntDesignVueResolver(),
        ElementPlusResolver(),
        VantResolver(),
      ]
    }),
  ],
}
```

You can also write your own resolver easily:

```ts
// vite.config.js
import ViteComponents from 'vite-plugin-components'

export default {
  plugins: [
    /* ... */
    ViteComponents({
      customComponentResolvers: [
        // example of importing Vant
        (name) => {
          // where `name` is always CapitalCase
          if (name.startsWith('Van'))
            return { importName: name.slice(3), path: 'vant' }
        }
      ]
    }),
  ],
}
```

If you made other UI libraries configured, please feel free to contribute so it can help others using them out-of-box. Thanks!

## Configuration

The following show the default values of the configuration

```ts
ViteComponents({
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
