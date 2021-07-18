import { Plugin } from 'vite';
import { TransformResult } from 'rollup';

interface ImportInfo {
    name?: string;
    importName?: string;
    path: string;
}
interface ComponentInfo extends ImportInfo {
    sideEffects?: (ImportInfo | string)[] | ImportInfo | string;
}
declare type ComponentResolveResult = string | ComponentInfo;
declare type ComponentResolver = (name: string) => ComponentResolveResult | null | undefined | void;
interface UILibraryOptions {
    name: string;
    prefix?: string;
    entries?: string[];
}
declare type Matcher = (id: string) => boolean | null | undefined;
declare type Transformer = (code: string, id: string, path: string, query: Record<string, string>) => null | TransformResult;
/**
 * Plugin options.
 */
interface Options {
    /**
     * Relative paths to the directory to search for components.
     * @default 'src/components'
     */
    dirs?: string | string[];
    /**
     * Valid file extensions for components.
     * @default ['vue']
     */
    extensions?: string | string[];
    /**
     * Search for subdirectories
     * @default true
     */
    deep?: boolean;
    /**
     * Allow subdirectories as namespace prefix for components
     * @default false
     */
    directoryAsNamespace?: boolean;
    /**
     * Subdirectory paths for ignoring namespace prefixes
     * works when `directoryAsNamespace: true`
     * @default "[]"
     */
    globalNamespaces?: string[];
    /**
     * comp libraries to use auto import
     */
    libraries?: (string | UILibraryOptions)[];
    /**
     * Auto-import for custom loader (md, svg, etc.). Returns true to enable for certain files.
     *
     * @default ()=>false
     */
    customLoaderMatcher?: Matcher;
    /**
     * Pass a custom function to resolve the component importing path from the component name.
     *
     * The component names are always in PascalCase
     */
    customComponentResolvers?: ComponentResolver | ComponentResolver[];
    /**
     * Apply custom transform over the path for importing
     */
    importPathTransform?: (path: string) => string | undefined;
    /**
     * Transformer to apply
     *
     * @default 'vue3'
     */
    transformer?: 'vue3' | 'vue2';
    /**
     * Generate TypeScript declaration for global components
     *
     * Accept boolean or a path related to project root
     *
     * @see https://github.com/vuejs/vue-next/pull/3399
     * @see https://github.com/johnsoncodehk/volar#using
     * @default false
     */
    globalComponentsDeclaration?: boolean | string;
    /**
     * Do not emit warning on component overriding
     *
     * @default false
     */
    allowOverrides?: boolean;
}
declare type ResolvedOptions = Omit<Required<Options>, 'customComponentResolvers' | 'libraries' | 'extensions' | 'dirs'> & {
    customComponentResolvers: ComponentResolver[];
    libraries: UILibraryOptions[];
    extensions: string[];
    dirs: string[];
    resolvedDirs: string[];
    globs: string[];
    globalComponentsDeclaration: string | false;
    root: string;
};
declare type ComponentsImportMap = Record<string, string[] | undefined>;

declare function tryLoadVeturTags(name: string): string[] | undefined;
declare function LibraryResolver(options: UILibraryOptions): ComponentResolver;

interface AntDesignVueResolverOptions {
    /**
     * import style along with components
     *
     * @default true
     */
    importStyle?: boolean;
    /**
     * import css along with components
     *
     * @default true
     */
    importCss?: boolean;
    /**
     * import less along with components
     *
     * @default false
     */
    importLess?: boolean;
    /**
     * resolve `ant-design-vue' icons
     *
     * requires package `@ant-design/icons-vue`
     *
     * @default false
     */
    resolveIcons?: boolean;
}
declare const AntDesignVueResolver: (options?: AntDesignVueResolverOptions) => ComponentResolver;

interface ElementPlusResolverOptions {
    /**
     * import style along with components
     *
     * @default true
     */
    importStyle?: boolean;
}
/**
 * Resolver for Element Plus
 *
 * See https://github.com/antfu/vite-plugin-components/pull/28 for more details
 *
 * @author @develar
 * @link https://element-plus.org/#/en-US
 */
declare const ElementPlusResolver: (options?: ElementPlusResolverOptions) => ComponentResolver;

/**
 * Resolver for headlessui
 *
 * @link https://github.com/tailwindlabs/headlessui
 */
declare const HeadlessUiResolver: () => ComponentResolver;

interface VantResolverOptions {
    /**
     * import style along with components
     *
     * @default true
     */
    importStyle?: boolean;
}
/**
 * Resolver for Vant
 *
 * @link https://github.com/youzan/vant
 */
declare const VantResolver: (options?: VantResolverOptions) => ComponentResolver;

/**
 * Resolver for Vuetify
 *
 * @link https://github.com/vuetifyjs/vuetify
 */
declare const VuetifyResolver: () => ComponentResolver;

/**
 * Resolver for VueUse
 *
 * @link https://github.com/vueuse/vueuse
 */
declare const VueUseComponentsResolver: () => ComponentResolver;

/**
 * Resolver for Naive UI
 *
 * @author @antfu
 * @link https://www.naiveui.com/
 */
declare const NaiveUiResolver: () => ComponentResolver;

interface VarletUIResolverOptions {
    /**
     * import css along with components
     *
     * @default true
     */
    importCss?: boolean;
    /**
     * import less along with components
     *
     * @default false
     */
    importLess?: boolean;
}
/**
 * Resolver for VarletUI
 *
 * @link https://github.com/haoziqaq/varlet
 */
declare const VarletUIResolver: (options?: VarletUIResolverOptions) => ComponentResolver;

interface PrimeVueResolverOptions {
    /**
     * import style along with components
     *
     * @default true
     */
    importStyle?: boolean;
    /**
     * import `primeicons' icons
     *
     * requires package `primeicons`
     *
     * @default true
     */
    importIcons?: boolean;
    /**
     * imports a free theme - set theme name here (e.g. saga-blue)
     *
     * @default ''
     */
    importTheme?: string;
}
/**
 * Resolver for PrimeVue
 *
 * @link https://github.com/primefaces/primevue
 */
declare const PrimeVueResolver: (options?: PrimeVueResolverOptions) => ComponentResolver;

declare function pascalCase(str: string): string;
declare function camelCase(str: string): string;
declare function kebabCase(key: string): string;

declare function VitePluginComponents(options?: Options): Plugin;

export default VitePluginComponents;
export { AntDesignVueResolver, AntDesignVueResolverOptions, ComponentInfo, ComponentResolveResult, ComponentResolver, ComponentsImportMap, ElementPlusResolver, ElementPlusResolverOptions, HeadlessUiResolver, ImportInfo, LibraryResolver, Matcher, NaiveUiResolver, Options, PrimeVueResolver, PrimeVueResolverOptions, ResolvedOptions, Transformer, UILibraryOptions, VantResolver, VantResolverOptions, VarletUIResolver, VarletUIResolverOptions, VueUseComponentsResolver, VuetifyResolver, camelCase, kebabCase, pascalCase, tryLoadVeturTags };
