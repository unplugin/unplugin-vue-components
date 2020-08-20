<h1 align='center'>vite-plugin-components</h1>

<p align='center'>Vite plugin for components auto importing</p>

<br>

## Usage

Install

```bash
npm i vite-plugin-components -D # yarn add vite-plugin-components -D
```

Add it to `vite.config.js`

```ts
// vite.config.js
import { VitePluginComponents } from 'vite-plugin-components'

export default {
  plugins: [
    VitePluginComponents()
  ]
}
```

Import and install `vite-plugin-components` in your `main.js`

```ts
import { createApp } from 'vue'
import App from './App.vue'

import components from 'vite-plugin-components' // <-- This

const app = createApp(App)

app.use(components) // <-- and this

app.mount('#app')
```

## Configuration

The following show the default values of the configuration

```ts
VitePluginComponents({
  // Relative path to the directory to search for components.
  dirs: ['src/components'],
  // Valid file extensions for components.
  extensions: ['vue'],
  // Search for subdirectories
  deep: true,
})
```

## Example

See the [Vitesse](https://github.com/antfu/vitesse) starter template.

## Thanks

Thanks to [@brattonross](https://github.com/brattonross), this project is heavily inspired by [vite-plugin-voie](https://github.com/vamplate/vite-plugin-voie).

## License

MIT License © 2020 [Anthony Fu](https://github.com/antfu)
