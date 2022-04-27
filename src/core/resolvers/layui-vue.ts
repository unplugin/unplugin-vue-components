import type { ComponentInfo, ComponentResolver, SideEffectsInfo } from '../../types'
import { camelCase } from '../utils'

const matchComponents = [
  {
    pattern: /^LayAvatarList$/,
    styleDir: "avatar",
  },
  {
    pattern: /^LayBreadcrumbItem$/,
    styleDir: "breadcrumb",
  },
  {
    pattern: /^(LayCarouselItem)$/,
    styleDir: "carousel",
  },
  {
    pattern: /^(LayCheckboxGroup)$/,
    styleDir: "checkbox",
  },
  {
    pattern: /^LayCol$/,
    styleDir: "row",
  },
  {
    pattern: /^(LayCollapseItem)$/,
    styleDir: "collapse",
  },
  {
    pattern: /^LayConfigProvider$/,
    styleDir: undefined,
  },
  {
    pattern: /^LayCountUp$/,
    styleDir: undefined,
  },
  {
    pattern: /^(LayDropdownMenu|LayDropdownMenuItem)$/,
    styleDir: "dropdown",
  },
  {
    pattern: /^(LayFormItem)$/,
    styleDir: "form",
  },
  {
    pattern: /^(LayMenuItem|LaySubMenu)$/,
    styleDir: "menu",
  },
  {
    pattern: /^LaySelectOption$/,
    styleDir: "select",
  },
  {
    pattern: /^LaySkeletonItem$/,
    styleDir: "skeleton",
  },
  {
    pattern: /^LaySplitPanelItem$/,
    styleDir: "splitPanel",
  },
  {
    pattern: /^LayStepItem$/,
    styleDir: "step",
  },
  {
    pattern: /^(LayTabItem)$/,
    styleDir: "tab",
  },
  {
    pattern: /^LayTimelineItem$/,
    styleDir: "timeline",
  },
];

export interface LayuiVueResolverOptions {
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | "css";

  /**
   * resolve `@layui/layui-vue' icons
   * requires package `@layui/icons-vue`
   *
   * @default false
   */
  resolveIcons?: boolean;

  /**
   * exclude components that do not require automatic import
   *
   */
  exclude?: Array<string | RegExp>;
}

const layuiRE: RegExp = /^Lay[A-Z]/
const layerRE: RegExp = /^(layer|LayLayer)$/
const iconsRE: RegExp = /^([A-Z][\w]+Icon|LayIcon)$/
let libName: string = '@layui/layui-vue'

function getSideEffects(importName: string, options: LayuiVueResolverOptions): SideEffectsInfo | undefined {
  const { importStyle = "css" } = options
  if (!importStyle) {
    return undefined
  }
  if (libName != '@layui/layui-vue') {
    return `${libName}/lib/index.css`
  }
  let styleDir: string | undefined = camelCase(importName.slice(3)); // LayBackTop -> backTop
  for (const item of matchComponents) {
    if (item.pattern.test(importName)) {
      styleDir = item.styleDir
      break
    }
  }
  if (importStyle === 'css' || importStyle) {
    return styleDir
      ? [`@layui/layui-vue/es/${styleDir}/index.css`, `@layui/layui-vue/es/index/index.css`]
      : undefined
  }
}

function resolveComponent(importName: string, options: LayuiVueResolverOptions): ComponentInfo | undefined  {
  let name: string | undefined = undefined

  if (options.exclude && isExclude(importName, options.exclude)) {
    return undefined
  }
  if (options.resolveIcons && importName.match(iconsRE)) {
    name = importName
    libName = '@layui/icons-vue'
  } else if (importName.match(layerRE)) {
    name = importName
    libName = '@layui/layer-vue'
  } else if (importName.match(layuiRE)) {
    name = importName
    libName = '@layui/layui-vue'
  }
  return name
    ? { name, from: libName, sideEffects: getSideEffects(name, options) }
    : undefined
}

function isExclude(name: string, exclude: Array<string | RegExp>): boolean {
  for (const item of exclude) {
    if (name === item || name.match(item)) {
      return true
    }
  }
  return false
}

/**
 * Resolver for layui-vue
 * 
 * @link http://www.layui-vue.com/ for layui-vue
 *
 */
export function LayuiVueResolver(
  options: LayuiVueResolverOptions = {}
): ComponentResolver {
  return {
    type: "component",
    resolve: (name: string) => {
      return resolveComponent(name, options)
    },
  }
}