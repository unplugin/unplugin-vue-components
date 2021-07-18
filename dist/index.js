"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = (x) => {
  if (typeof require !== "undefined")
    return require(x);
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/.pnpm/@antfu+utils@0.2.4/node_modules/@antfu/utils/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/@antfu+utils@0.2.4/node_modules/@antfu/utils/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function clamp(n, min, max) {
      return Math.min(max, Math.max(min, n));
    }
    function sum(...args) {
      return flattenArrayable(args).reduce((a, b) => a + b, 0);
    }
    function toArray3(array) {
      array = array || [];
      if (Array.isArray(array))
        return array;
      return [array];
    }
    function flattenArrayable(array) {
      return toArray3(array).flat(1);
    }
    function mergeArrayable(...args) {
      return args.flatMap((i) => toArray3(i));
    }
    function partition(array, filter) {
      const pass = [];
      const fail = [];
      array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
      return [pass, fail];
    }
    function uniq(array) {
      return Array.from(new Set(array));
    }
    function last(array) {
      return at(array, -1);
    }
    function remove(array, value) {
      if (!array)
        return false;
      const index = array.indexOf(value);
      if (index >= 0) {
        array.splice(index, 1);
        return true;
      }
      return false;
    }
    function at(array, index) {
      const len = array.length;
      if (!len)
        return void 0;
      if (index < 0)
        index += len;
      return array[index];
    }
    function range(...args) {
      let start, stop, step;
      if (args.length === 1) {
        start = 0;
        step = 1;
        [stop] = args;
      } else {
        [start, stop, step = 1] = args;
      }
      const arr = [];
      let current = start;
      while (current < stop) {
        arr.push(current);
        current += step || 1;
      }
      return arr;
    }
    function move(arr, from, to) {
      arr.splice(to, 0, arr.splice(from, 1)[0]);
      return arr;
    }
    function clampArrayRange(n, arr) {
      return clamp(n, 0, arr.length - 1);
    }
    var assert = (condition, message) => {
      if (!condition)
        throw new Error(message);
    };
    var toString2 = Object.prototype.toString;
    var noop = () => {
    };
    function notNullish2(v) {
      return v != null;
    }
    function noNull(v) {
      return v !== null;
    }
    function notUndefined(v) {
      return v !== void 0;
    }
    function isTruthy(v) {
      return Boolean(v);
    }
    var isBrowser = typeof window !== "undefined";
    var isDef = (val) => typeof val !== "undefined";
    var isBoolean = (val) => typeof val === "boolean";
    var isFunction = (val) => typeof val === "function";
    var isNumber = (val) => typeof val === "number";
    var isString = (val) => typeof val === "string";
    var isObject = (val) => toString.call(val) === "[object Object]";
    var isWindow = (val) => typeof window !== "undefined" && toString.call(val) === "[object Window]";
    function slash4(str) {
      return str.replace(/\\/g, "/");
    }
    function ensurePrefix(prefix, str) {
      if (!str.startsWith(prefix))
        return prefix + str;
      return str;
    }
    var timestamp = () => +Date.now();
    function batchInvoke(functions) {
      functions.forEach((fn) => fn && fn());
    }
    function invoke(fn) {
      return fn();
    }
    function tap(value, callback) {
      callback(value);
      return value;
    }
    function objectMap(obj, fn) {
      return Object.fromEntries(Object.entries(obj).map(([k, v]) => fn(k, v)).filter(notNullish2));
    }
    function isKeyOf(obj, k) {
      return k in obj;
    }
    function objectKeys(obj) {
      return Object.keys(obj);
    }
    function objectEntries(obj) {
      return Object.entries(obj);
    }
    function deepMerge(target, ...sources) {
      if (!sources.length)
        return target;
      const source = sources.shift();
      if (source === void 0)
        return target;
      if (isMergableObject(target) && isMergableObject(source)) {
        objectKeys(source).forEach((key) => {
          if (isMergableObject(source[key])) {
            if (!target[key])
              target[key] = {};
            deepMerge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        });
      }
      return deepMerge(target, ...sources);
    }
    function isMergableObject(item) {
      return isObject(item) && !Array.isArray(item);
    }
    function objectPick(obj, keys, omitUndefined = false) {
      return keys.reduce((n, k) => {
        if (k in obj) {
          if (!omitUndefined || !obj[k] === void 0)
            n[k] = obj[k];
        }
        return n;
      }, {});
    }
    function clearUndefined(obj) {
      Object.keys(obj).forEach((key) => obj[key] === void 0 ? delete obj[key] : {});
      return obj;
    }
    function hasOwnProperty(obj, v) {
      if (obj == null)
        return false;
      return Object.prototype.hasOwnProperty.call(obj, v);
    }
    function createSingletonPromise(fn) {
      let _promise;
      function wrapper() {
        if (!_promise)
          _promise = fn();
        return _promise;
      }
      wrapper.reset = async () => {
        const _prev = _promise;
        _promise = void 0;
        if (_prev)
          await _prev;
      };
      return wrapper;
    }
    function sleep(ms, callback) {
      return new Promise((resolve3) => setTimeout(async () => {
        await (callback == null ? void 0 : callback());
        resolve3();
      }, ms));
    }
    function throttle2(delay, noTrailing, callback, debounceMode) {
      var timeoutID;
      var cancelled = false;
      var lastExec = 0;
      function clearExistingTimeout() {
        if (timeoutID) {
          clearTimeout(timeoutID);
        }
      }
      function cancel() {
        clearExistingTimeout();
        cancelled = true;
      }
      if (typeof noTrailing !== "boolean") {
        debounceMode = callback;
        callback = noTrailing;
        noTrailing = void 0;
      }
      function wrapper() {
        for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
          arguments_[_key] = arguments[_key];
        }
        var self = this;
        var elapsed = Date.now() - lastExec;
        if (cancelled) {
          return;
        }
        function exec() {
          lastExec = Date.now();
          callback.apply(self, arguments_);
        }
        function clear() {
          timeoutID = void 0;
        }
        if (debounceMode && !timeoutID) {
          exec();
        }
        clearExistingTimeout();
        if (debounceMode === void 0 && elapsed > delay) {
          exec();
        } else if (noTrailing !== true) {
          timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === void 0 ? delay - elapsed : delay);
        }
      }
      wrapper.cancel = cancel;
      return wrapper;
    }
    function debounce(delay, atBegin, callback) {
      return callback === void 0 ? throttle2(delay, atBegin, false) : throttle2(delay, callback, atBegin !== false);
    }
    exports.assert = assert;
    exports.at = at;
    exports.batchInvoke = batchInvoke;
    exports.clamp = clamp;
    exports.clampArrayRange = clampArrayRange;
    exports.clearUndefined = clearUndefined;
    exports.createSingletonPromise = createSingletonPromise;
    exports.debounce = debounce;
    exports.deepMerge = deepMerge;
    exports.ensurePrefix = ensurePrefix;
    exports.flattenArrayable = flattenArrayable;
    exports.hasOwnProperty = hasOwnProperty;
    exports.invoke = invoke;
    exports.isBoolean = isBoolean;
    exports.isBrowser = isBrowser;
    exports.isDef = isDef;
    exports.isFunction = isFunction;
    exports.isKeyOf = isKeyOf;
    exports.isNumber = isNumber;
    exports.isObject = isObject;
    exports.isString = isString;
    exports.isTruthy = isTruthy;
    exports.isWindow = isWindow;
    exports.last = last;
    exports.mergeArrayable = mergeArrayable;
    exports.move = move;
    exports.noNull = noNull;
    exports.noop = noop;
    exports.notNullish = notNullish2;
    exports.notUndefined = notUndefined;
    exports.objectEntries = objectEntries;
    exports.objectKeys = objectKeys;
    exports.objectMap = objectMap;
    exports.objectPick = objectPick;
    exports.partition = partition;
    exports.range = range;
    exports.remove = remove;
    exports.slash = slash4;
    exports.sleep = sleep;
    exports.sum = sum;
    exports.tap = tap;
    exports.throttle = throttle2;
    exports.timestamp = timestamp;
    exports.toArray = toArray3;
    exports.toString = toString2;
    exports.uniq = uniq;
  }
});

// src/context.ts
var import_utils4 = __toModule(require_dist());
var _path = require('path');
var _debug = require('debug'); var _debug2 = _interopRequireDefault(_debug);

// src/utils.ts
var import_utils2 = __toModule(require_dist());

var _minimatch = require('minimatch'); var _minimatch2 = _interopRequireDefault(_minimatch);

// src/helpers/libraryResolver.ts
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);


var debug = _debug2.default.call(void 0, "vite-plugin-components:helper:library");
function tryLoadVeturTags(name) {
  var _a;
  try {
    const pkgPath = __require.resolve(`${name}/package.json`);
    if (!pkgPath)
      return;
    const pkg = JSON.parse(_fs2.default.readFileSync(pkgPath, "utf-8"));
    const tagsPath = (_a = pkg == null ? void 0 : pkg.vetur) == null ? void 0 : _a.tags;
    if (!tagsPath)
      return;
    const tags = JSON.parse(_fs2.default.readFileSync(_path.join.call(void 0, _path.dirname.call(void 0, pkgPath), tagsPath), "utf-8"));
    return Object.keys(tags).map((i) => camelCase(i));
  } catch (e) {
    console.error(e);
  }
}
function LibraryResolver(options) {
  const {
    name: libraryName,
    entries = tryLoadVeturTags(options.name),
    prefix = ""
  } = options;
  if (!entries) {
    console.warn(`[vite-plugin-components] Failed to load Vetur tags from library "${libraryName}"`);
    return () => {
    };
  }
  debug(entries);
  const prefixKebab = kebabCase(prefix);
  const kebabEntries = entries.map((name) => ({ name, kebab: kebabCase(name) }));
  return (name) => {
    const kebab = kebabCase(name);
    let componentName = kebab;
    if (prefixKebab) {
      if (!kebab.startsWith(`${prefixKebab}-`))
        return;
      componentName = kebab.slice(prefixKebab.length + 1);
    }
    for (const entry of kebabEntries) {
      if (entry.kebab === componentName)
        return { path: libraryName, importName: entry.name };
    }
  };
}

// src/constants.ts
var defaultOptions = {
  dirs: "src/components",
  extensions: "vue",
  transformer: "vue3",
  deep: true,
  globalComponentsDeclaration: false,
  directoryAsNamespace: false,
  globalNamespaces: [],
  libraries: [],
  customLoaderMatcher: () => false,
  customComponentResolvers: [],
  importPathTransform: (v) => v,
  allowOverrides: false
};

// src/utils.ts
function pascalCase(str) {
  return capitalize(camelCase(str));
}
function camelCase(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : "");
}
function kebabCase(key) {
  const result = key.replace(/([A-Z])/g, " $1").trim();
  return result.split(" ").join("-").toLowerCase();
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function parseId(id) {
  const index = id.indexOf("?");
  if (index < 0) {
    return { path: id, query: {} };
  } else {
    const query = Object.fromEntries(new URLSearchParams(id.slice(index)));
    return {
      path: id.slice(0, index),
      query
    };
  }
}
function isEmpty(value) {
  if (!value || value === null || value === void 0 || Array.isArray(value) && Object.keys(value).length <= 0)
    return true;
  else
    return false;
}
function matchGlobs(filepath, globs) {
  for (const glob of globs) {
    if (_minimatch2.default.call(void 0, (0, import_utils2.slash)(filepath), glob))
      return true;
  }
  return false;
}
function stringifyImport(info) {
  if (typeof info === "string")
    return `import '${info}'`;
  if (!info.name)
    return `import '${info.path}'`;
  else if (info.importName)
    return `import { ${info.importName} as ${info.name} } from '${info.path}'`;
  else
    return `import ${info.name} from '${info.path}'`;
}
function stringifyComponentImport({ name, path, importName, sideEffects }, ctx) {
  if (ctx.options.importPathTransform) {
    const result = ctx.options.importPathTransform(path);
    if (result != null)
      path = result;
  }
  const imports = [
    stringifyImport({ name, path, importName })
  ];
  if (sideEffects)
    (0, import_utils2.toArray)(sideEffects).forEach((i) => imports.push(stringifyImport(i)));
  return imports.join("\n");
}
function resolveOptions(options, viteConfig) {
  const resolved = Object.assign({}, defaultOptions, options);
  resolved.libraries = (0, import_utils2.toArray)(resolved.libraries).map((i) => typeof i === "string" ? { name: i } : i);
  resolved.customComponentResolvers = (0, import_utils2.toArray)(resolved.customComponentResolvers);
  resolved.customComponentResolvers.push(...resolved.libraries.map((lib) => LibraryResolver(lib)));
  resolved.extensions = (0, import_utils2.toArray)(resolved.extensions);
  const extsGlob = resolved.extensions.length === 1 ? resolved.extensions : `{${resolved.extensions.join(",")}}`;
  resolved.dirs = (0, import_utils2.toArray)(resolved.dirs);
  resolved.resolvedDirs = resolved.dirs.map((i) => (0, import_utils2.slash)(_path.resolve.call(void 0, viteConfig.root, i)));
  resolved.globs = resolved.resolvedDirs.map((i) => resolved.deep ? (0, import_utils2.slash)(_path.join.call(void 0, i, `**/*.${extsGlob}`)) : (0, import_utils2.slash)(_path.join.call(void 0, i, `*.${extsGlob}`)));
  if (!resolved.extensions.length)
    throw new Error("[vite-plugin-components] extensions are required to search for components");
  resolved.globalComponentsDeclaration = !options.globalComponentsDeclaration ? false : _path.resolve.call(void 0, viteConfig.root, typeof options.globalComponentsDeclaration === "string" ? options.globalComponentsDeclaration : "components.d.ts");
  resolved.root = viteConfig.root;
  return resolved;
}
function getNameFromFilePath(filePath, options) {
  const { resolvedDirs, directoryAsNamespace, globalNamespaces } = options;
  const parsedFilePath = _path.parse.call(void 0, (0, import_utils2.slash)(filePath));
  let strippedPath = "";
  for (const dir of resolvedDirs) {
    if (parsedFilePath.dir.startsWith(dir)) {
      strippedPath = parsedFilePath.dir.slice(dir.length);
      break;
    }
  }
  let folders = strippedPath.slice(1).split("/").filter(Boolean);
  let filename = parsedFilePath.name;
  if (filename === "index" && !directoryAsNamespace) {
    filename = `${folders.slice(-1)[0]}`;
    return filename;
  }
  if (directoryAsNamespace) {
    if (globalNamespaces.some((name) => folders.includes(name)))
      folders = folders.filter((f) => !globalNamespaces.includes(f));
    if (filename.toLowerCase() === "index")
      filename = "";
    if (!isEmpty(folders)) {
      filename = [...folders, filename].filter(Boolean).join("-");
    }
    return filename;
  }
  return filename;
}
function resolveAlias(filepath, alias = []) {
  const result = filepath;
  if (Array.isArray(alias)) {
    for (const { find, replacement } of alias)
      result.replace(find, replacement);
  }
  return result;
}

// src/fs/glob.ts
var _fastglob = require('fast-glob'); var _fastglob2 = _interopRequireDefault(_fastglob);

var debug2 = _debug2.default.call(void 0, "vite-plugin-components:glob");
function searchComponents(ctx) {
  var _a;
  debug2(`started with: [${ctx.options.globs.join(", ")}]`);
  const root = ctx.root;
  const files = _fastglob2.default.sync(ctx.options.globs, {
    ignore: ["node_modules"],
    onlyFiles: true,
    cwd: root,
    absolute: true
  });
  if (!files.length && !((_a = ctx.options.customComponentResolvers) == null ? void 0 : _a.length))
    console.warn("[vite-plugin-components] no components found");
  debug2(`${files.length} components found.`);
  ctx.addComponents(files);
}

// src/declaration.ts
var import_utils3 = __toModule(require_dist());


function parseDeclaration(code) {
  return Object.fromEntries(Array.from(code.matchAll(/\s+['"]?(.+?)['"]?:\s(.+?)\n/g)).map((i) => [i[1], i[2]]));
}
async function generateDeclaration(ctx, root, filepath) {
  const imports = Object.fromEntries(Object.values(__spreadValues(__spreadValues({}, ctx.componentNameMap), ctx.componentCustomMap)).map(({ path, name, importName }) => {
    if (!name)
      return void 0;
    const related = (0, import_utils3.slash)(path).startsWith("/") ? `./${_path.relative.call(void 0, _path.dirname.call(void 0, filepath), _path.resolve.call(void 0, root, path.slice(1)))}` : path;
    let entry = `typeof import('${(0, import_utils3.slash)(related)}')`;
    if (importName)
      entry += `['${importName}']`;
    else
      entry += "['default']";
    return [name, entry];
  }).filter(import_utils3.notNullish));
  if (!Object.keys(imports).length)
    return;
  const originalImports = _fs.existsSync.call(void 0, filepath) ? parseDeclaration(await _fs.promises.readFile(filepath, "utf-8")) : {};
  const lines = Object.entries(__spreadValues(__spreadValues({}, originalImports), imports)).sort((a, b) => a[0].localeCompare(b[0])).map(([name, v]) => {
    if (!/^\w+$/.test(name))
      name = `'${name}'`;
    return `${name}: ${v}`;
  });
  const code = `// generated by vite-plugin-components
// read more https://github.com/vuejs/vue-next/pull/3399

declare module 'vue' {
  export interface GlobalComponents {
    ${lines.join("\n    ")}
  }
}

export { }
`;
  await _fs.promises.writeFile(filepath, code, "utf-8");
}

// src/context.ts
var debug3 = {
  components: _debug2.default.call(void 0, "vite-plugin-components:context:components"),
  search: _debug2.default.call(void 0, "vite-plugin-components:context:search"),
  hmr: _debug2.default.call(void 0, "vite-plugin-components:context:hmr"),
  decleration: _debug2.default.call(void 0, "vite-plugin-components:decleration")
};
var Context = class {
  constructor(options, viteConfig) {
    this.viteConfig = viteConfig;
    this._componentPaths = new Set();
    this._componentNameMap = {};
    this._componentUsageMap = {};
    this._componentCustomMap = {};
    this._searched = false;
    this.options = resolveOptions(options, viteConfig);
    this.generateDeclaration = (0, import_utils4.throttle)(500, false, this.generateDeclaration.bind(this));
  }
  get root() {
    return this.viteConfig.root;
  }
  setServer(server) {
    this._server = server;
    const { globs } = this.options;
    server.watcher.on("unlink", (path) => {
      if (!matchGlobs(path, globs))
        return;
      this.removeComponents(path);
      this.onUpdate(path);
    });
    server.watcher.on("add", (path) => {
      if (!matchGlobs(path, globs))
        return;
      this.addComponents(path);
      this.onUpdate(path);
    });
  }
  updateUsageMap(path, paths) {
    if (!this._componentUsageMap[path])
      this._componentUsageMap[path] = new Set();
    paths.forEach((p) => {
      this._componentUsageMap[path].add(p);
    });
  }
  addComponents(paths) {
    debug3.components("add", paths);
    const size = this._componentPaths.size;
    (0, import_utils4.toArray)(paths).forEach((p) => this._componentPaths.add(p));
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap();
      return true;
    }
    return false;
  }
  addCustomComponents(info) {
    if (info.name)
      this._componentCustomMap[info.name] = info;
  }
  removeComponents(paths) {
    debug3.components("remove", paths);
    const size = this._componentPaths.size;
    (0, import_utils4.toArray)(paths).forEach((p) => this._componentPaths.delete(p));
    if (this._componentPaths.size !== size) {
      this.updateComponentNameMap();
      return true;
    }
    return false;
  }
  onUpdate(path) {
    if (!this._server)
      return;
    const payload = {
      type: "update",
      updates: []
    };
    const timestamp = +new Date();
    const name = pascalCase(getNameFromFilePath(path, this.options));
    Object.entries(this._componentUsageMap).forEach(([key, values]) => {
      if (values.has(name)) {
        const r = `/${(0, import_utils4.slash)(_path.relative.call(void 0, this.viteConfig.root, key))}`;
        payload.updates.push({
          acceptedPath: r,
          path: r,
          timestamp,
          type: "js-update"
        });
      }
    });
    if (payload.updates.length)
      this._server.ws.send(payload);
    this.generateDeclaration();
  }
  updateComponentNameMap() {
    this._componentNameMap = {};
    Array.from(this._componentPaths).forEach((path) => {
      const name = pascalCase(getNameFromFilePath(path, this.options));
      if (this._componentNameMap[name] && !this.options.allowOverrides) {
        console.warn(`[vite-plugin-components] component "${name}"(${path}) has naming conflicts with other components, ignored.`);
        return;
      }
      this._componentNameMap[name] = {
        name,
        path: `/${this.relative(path)}`
      };
    });
  }
  findComponent(name, excludePaths = [], rawName) {
    let info = this._componentNameMap[name];
    if (info && !excludePaths.includes(info.path) && !excludePaths.includes(info.path.slice(1)))
      return info;
    for (const resolver of this.options.customComponentResolvers) {
      const result = resolver(name);
      if (result) {
        if (typeof result === "string") {
          info = {
            name,
            path: result
          };
          this.addCustomComponents(info);
          return info;
        } else {
          info = __spreadValues({
            name
          }, result);
          this.addCustomComponents(info);
          return info;
        }
      }
    }
    return void 0;
  }
  findComponents(names, excludePaths = []) {
    return names.map((name) => this.findComponent(name, excludePaths)).filter(Boolean);
  }
  normalizePath(path) {
    var _a, _b, _c;
    return resolveAlias(path, ((_b = (_a = this.viteConfig) == null ? void 0 : _a.resolve) == null ? void 0 : _b.alias) || ((_c = this.viteConfig) == null ? void 0 : _c.alias) || []);
  }
  relative(path) {
    if (path.startsWith("/") && !path.startsWith(this.root))
      return (0, import_utils4.slash)(path.slice(1));
    return (0, import_utils4.slash)(_path.relative.call(void 0, this.root, path));
  }
  searchGlob() {
    if (this._searched)
      return;
    searchComponents(this);
    debug3.search(this._componentNameMap);
    this._searched = true;
  }
  generateDeclaration() {
    if (!this.options.globalComponentsDeclaration)
      return;
    debug3.decleration("generating");
    generateDeclaration(this, this.options.root, this.options.globalComponentsDeclaration);
  }
  get componentNameMap() {
    return this._componentNameMap;
  }
  get componentCustomMap() {
    return this._componentCustomMap;
  }
};

// src/transforms/vue3.ts

var _magicstring = require('magic-string'); var _magicstring2 = _interopRequireDefault(_magicstring);
var debug4 = _debug2.default.call(void 0, "vite-plugin-components:transform:vue3");
function Vue3Transformer(ctx) {
  return (code, id, path, query) => {
    if (!(path.endsWith(".vue") || ctx.options.customLoaderMatcher(id)))
      return null;
    ctx.searchGlob();
    const sfcPath = ctx.normalizePath(path);
    debug4(sfcPath);
    const head = [];
    let no = 0;
    const componentPaths = [];
    const s = new (0, _magicstring2.default)(code);
    for (const match of code.matchAll(/_resolveComponent\("(.+?)"\)/g)) {
      const matchedName = match[1];
      if (match.index != null && matchedName && !matchedName.startsWith("_")) {
        const start = match.index;
        const end = start + match[0].length;
        debug4(`| ${matchedName}`);
        const name = pascalCase(matchedName);
        componentPaths.push(name);
        const component = ctx.findComponent(name, [sfcPath], matchedName);
        if (component) {
          const var_name = `__vite_components_${no}`;
          head.push(stringifyComponentImport(__spreadProps(__spreadValues({}, component), { name: var_name }), ctx));
          no += 1;
          s.overwrite(start, end, var_name);
        }
      }
    }
    debug4(`^ (${no})`);
    ctx.updateUsageMap(sfcPath, componentPaths);
    s.prepend(`${head.join("\n")}
`);
    const result = { code: s.toString() };
    if (ctx.viteConfig.build.sourcemap)
      result.map = s.generateMap({ hires: true });
    return result;
  };
}

// src/transforms/vue2.ts


var debug5 = _debug2.default.call(void 0, "vite-plugin-components:transform:vue2");
function Vue2Transformer(ctx) {
  return (code, id, path, query) => {
    if (!(path.endsWith(".vue") || ctx.options.customLoaderMatcher(id)))
      return null;
    ctx.searchGlob();
    const sfcPath = ctx.normalizePath(path);
    debug5(sfcPath);
    const head = [];
    let no = 0;
    const componentPaths = [];
    const s = new (0, _magicstring2.default)(code);
    for (const match of code.matchAll(/_c\(['"](.+?)["']([,)])/g)) {
      const [full, matchedName, append] = match;
      if (match.index != null && matchedName && !matchedName.startsWith("_")) {
        const start = match.index;
        const end = start + full.length;
        debug5(`| ${matchedName}`);
        const name = pascalCase(matchedName);
        componentPaths.push(name);
        const component = ctx.findComponent(name, [sfcPath], matchedName);
        if (component) {
          const var_name = `__vite_components_${no}`;
          head.push(stringifyComponentImport(__spreadProps(__spreadValues({}, component), { name: var_name }), ctx));
          no += 1;
          s.overwrite(start, end, `_c(${var_name}${append}`);
        }
      }
    }
    debug5(`^ (${no})`);
    ctx.updateUsageMap(sfcPath, componentPaths);
    s.prepend(`${head.join("\n")}
`);
    const result = { code: s.toString() };
    if (ctx.viteConfig.build.sourcemap)
      result.map = s.generateMap({ hires: true });
    return result;
  };
}

// src/resolvers/antdv.ts
var matchComponents = [
  {
    pattern: /^Avatar/,
    styleDir: "avatar"
  },
  {
    pattern: /^AutoComplete/,
    styleDir: "auto-complete"
  },
  {
    pattern: /^Anchor/,
    styleDir: "anchor"
  },
  {
    pattern: /^Badge/,
    styleDir: "badge"
  },
  {
    pattern: /^Breadcrumb/,
    styleDir: "breadcrumb"
  },
  {
    pattern: /^Button/,
    styleDir: "button"
  },
  {
    pattern: /^Checkbox/,
    styleDir: "checkbox"
  },
  {
    pattern: /^Card/,
    styleDir: "card"
  },
  {
    pattern: /^Collapse/,
    styleDir: "collapse"
  },
  {
    pattern: /^Descriptions/,
    styleDir: "descriptions"
  },
  {
    pattern: /^RangePicker|^WeekPicker|^MonthPicker/,
    styleDir: "date-picker"
  },
  {
    pattern: /^Dropdown/,
    styleDir: "dropdown"
  },
  {
    pattern: /^Form/,
    styleDir: "form"
  },
  {
    pattern: /^InputNumber/,
    styleDir: "input-number"
  },
  {
    pattern: /^Input|^Textarea/,
    styleDir: "input"
  },
  {
    pattern: /^Statistic/,
    styleDir: "statistic"
  },
  {
    pattern: /^CheckableTag/,
    styleDir: "tag"
  },
  {
    pattern: /^Layout/,
    styleDir: "layout"
  },
  {
    pattern: /^Menu|^SubMenu/,
    styleDir: "menu"
  },
  {
    pattern: /^Table/,
    styleDir: "table"
  },
  {
    pattern: /^Radio/,
    styleDir: "radio"
  },
  {
    pattern: /^Image/,
    styleDir: "image"
  },
  {
    pattern: /^List/,
    styleDir: "list"
  },
  {
    pattern: /^Tab/,
    styleDir: "tabs"
  },
  {
    pattern: /^Mentions/,
    styleDir: "mentions"
  },
  {
    pattern: /^Step/,
    styleDir: "steps"
  },
  {
    pattern: /^Skeleton/,
    styleDir: "skeleton"
  },
  {
    pattern: /^Select/,
    styleDir: "select"
  },
  {
    pattern: /^TreeSelect/,
    styleDir: "tree-select"
  },
  {
    pattern: /^Tree|^DirectoryTree/,
    styleDir: "tree"
  },
  {
    pattern: /^Typography/,
    styleDir: "typography"
  },
  {
    pattern: /^Timeline/,
    styleDir: "timeline"
  },
  {
    pattern: /^Upload/,
    styleDir: "upload"
  }
];
var getStyleDir = (compName) => {
  let styleDir;
  const total = matchComponents.length;
  for (let i = 0; i < total; i++) {
    const matcher = matchComponents[i];
    if (compName.match(matcher.pattern)) {
      styleDir = matcher.styleDir;
      break;
    }
  }
  if (!styleDir)
    styleDir = kebabCase(compName);
  return styleDir;
};
var getSideEffects = (compName, opts) => {
  const { importStyle = true, importCss = true, importLess = false } = opts;
  if (importStyle) {
    if (importLess) {
      const styleDir = getStyleDir(compName);
      return `ant-design-vue/es/${styleDir}/style`;
    } else if (importCss) {
      const styleDir = getStyleDir(compName);
      return `ant-design-vue/es/${styleDir}/style/css`;
    }
  }
};
var AntDesignVueResolver = (options = {}) => (name) => {
  if (options.resolveIcons && name.match(/(Outlined|Filled|TwoTone)$/)) {
    return {
      importName: name,
      path: "@ant-design/icons-vue"
    };
  }
  if (name.match(/^A[A-Z]/)) {
    const importName = name.slice(1);
    return {
      importName,
      path: "ant-design-vue/es",
      sideEffects: getSideEffects(importName, options)
    };
  }
};

// src/resolvers/element-plus.ts
var ElementPlusResolver = (options = {}) => (name) => {
  const { importStyle = true } = options;
  if (name.startsWith("El")) {
    const partialName = name[2].toLowerCase() + name.substring(3).replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);
    return {
      path: `element-plus/es/el-${partialName}`,
      sideEffects: importStyle ? `element-plus/packages/theme-chalk/src/${partialName}.scss` : void 0
    };
  }
};

// src/resolvers/headless-ui.ts
var components = [
  "Dialog",
  "DialogDescription",
  "DialogOverlay",
  "DialogTitle",
  "Disclosure",
  "DisclosureButton",
  "DisclosurePanel",
  "FocusTrap",
  "Listbox",
  "ListboxButton",
  "ListboxLabel",
  "ListboxOption",
  "ListboxOptions",
  "Menu",
  "MenuButton",
  "MenuItem",
  "MenuItems",
  "Popover",
  "PopoverButton",
  "PopoverGroup",
  "PopoverOverlay",
  "PopoverPanel",
  "Portal",
  "PortalGroup",
  "RadioGroup",
  "RadioGroupDescription",
  "RadioGroupLabel",
  "RadioGroupOption",
  "Switch",
  "SwitchDescription",
  "SwitchGroup",
  "SwitchLabel",
  "TransitionChild",
  "TransitionRoot"
];
var HeadlessUiResolver = () => (name) => {
  if (components.includes(name))
    return { importName: name, path: "@headlessui/vue" };
};

// src/resolvers/vant.ts
var VantResolver = (options = {}) => (name) => {
  const { importStyle = true } = options;
  if (name.startsWith("Van")) {
    const partialName = name.slice(3);
    return {
      importName: partialName,
      path: "vant/es",
      sideEffects: importStyle ? `vant/es/${kebabCase(partialName)}/style` : void 0
    };
  }
};

// src/resolvers/vuetify.ts
var VuetifyResolver = () => (name) => {
  if (name.match(/^V[A-Z]/))
    return { importName: name, path: "vuetify/lib" };
};

// src/resolvers/vueuse.ts
var components2;
var VueUseComponentsResolver = () => (name) => {
  if (!components2) {
    try {
      const indexesJson = __require("@vueuse/core/indexes.json");
      components2 = indexesJson.functions.filter((i) => i.component && i.name).map(({ name: name2 }) => name2[0].toUpperCase() + name2.slice(1));
    } catch (error) {
      components2 = [];
    }
  }
  if (components2 && components2.includes(name))
    return { importName: name, path: "@vueuse/components" };
};

// src/resolvers/naive-ui.ts
var NaiveUiResolver = () => (name) => {
  if (name.match(/^N[A-Z]/))
    return { importName: name, path: "naive-ui" };
};

// src/resolvers/varlet-ui.ts
var VarletUIResolver = (options = {}) => (name) => {
  const {
    importCss = true,
    importLess
  } = options;
  if (name.startsWith("Var")) {
    const partialName = name.slice(3);
    const sideEffects = [];
    importCss && sideEffects.push(`@varlet/ui/es/${kebabCase(partialName)}/style`);
    importLess && sideEffects.push(`@varlet/ui/es/${kebabCase(partialName)}/style/less.js`);
    return {
      importName: `_${partialName}Component`,
      path: "@varlet/ui",
      sideEffects
    };
  }
};

// src/resolvers/prime-vue.ts
var components3 = [
  "AutoComplete",
  "Calendar",
  "CascadeSelect",
  "Checkbox",
  "Chips",
  "ColorPicker",
  "Dropdown",
  "Editor",
  "InputMask",
  "InputNumber",
  "InputSwitch",
  "InputText",
  "Knob",
  "Listbox",
  "MultiSelect",
  "Password",
  "RadioButton",
  "Rating",
  "SelectButton",
  "Slider",
  "Textarea",
  "ToggleButton",
  "TreeSelect",
  "TriStateCheckbox",
  "Button",
  "SplitButton",
  "DataTable",
  "Column",
  "ColumnGroup",
  "DataView",
  "FullCalendar",
  "OrderList",
  "OrganizationChart",
  "Paginator",
  "PickList",
  "Timelist",
  "Tree",
  "TreeTable",
  "Accordion",
  "AccordionTab",
  "Card",
  "DeferredContent",
  "Divider",
  "Fieldset",
  "Panel",
  "Splitter",
  "SplitterPanel",
  "ScrollPanel",
  "TabView",
  "TabPanel",
  "Toolbar",
  "ConfirmDialog",
  "ConfirmPopup",
  "Dialog",
  "OverlayPanel",
  "Sidebar",
  "Tooltip",
  "FileUpload",
  "Breadcrumb",
  "ContextMenu",
  "MegaMenu",
  "Menu",
  "Menubar",
  "PanelMenu",
  "Steps",
  "TabMenu",
  "TieredMenu",
  "Chart",
  "Message",
  "Toast",
  "Carousel",
  "Galleria",
  "Avatar",
  "AvatarGroup",
  "Badge",
  "Chip",
  "BlockUI",
  "Inplace",
  "ScrollTop",
  "Skeleton",
  "ProgressBar",
  "ProgressSpiner",
  "Tag",
  "Terminal",
  "TerminalService"
];
var PrimeVueResolver = (options = {}) => (name) => {
  const sideEffects = [];
  if (options.importStyle) {
    sideEffects.push("primevue/resources/primevue.min.css");
  }
  if (options.importIcons) {
    sideEffects.push("primeicons/primeicons.css");
  }
  if (options.importTheme) {
    sideEffects.push(`primevue/resources/themes/${options.importTheme}/theme.css`);
  }
  if (components3.includes(name)) {
    return {
      importName: name,
      path: `primevue/${name}/${name}.vue`,
      sideEffects
    };
  }
};

// src/index.ts
function VitePluginComponents(options = {}) {
  let ctx;
  let transformer;
  return {
    name: "vite-plugin-components",
    enforce: "post",
    configResolved(config) {
      if (config.plugins.find((i) => i.name === "vite-plugin-vue2"))
        options.transformer = options.transformer || "vue2";
      ctx = new Context(options, config);
      transformer = ctx.options.transformer === "vue2" ? Vue2Transformer(ctx) : Vue3Transformer(ctx);
      if (options.globalComponentsDeclaration) {
        ctx.searchGlob();
        ctx.generateDeclaration();
      }
    },
    configureServer(server) {
      ctx.setServer(server);
    },
    async transform(code, id) {
      const { path, query } = parseId(id);
      const result = await transformer(code, id, path, query);
      ctx.generateDeclaration();
      return result;
    }
  };
}
var src_default = VitePluginComponents;
















exports.AntDesignVueResolver = AntDesignVueResolver; exports.ElementPlusResolver = ElementPlusResolver; exports.HeadlessUiResolver = HeadlessUiResolver; exports.LibraryResolver = LibraryResolver; exports.NaiveUiResolver = NaiveUiResolver; exports.PrimeVueResolver = PrimeVueResolver; exports.VantResolver = VantResolver; exports.VarletUIResolver = VarletUIResolver; exports.VueUseComponentsResolver = VueUseComponentsResolver; exports.VuetifyResolver = VuetifyResolver; exports.camelCase = camelCase; exports.default = src_default; exports.kebabCase = kebabCase; exports.pascalCase = pascalCase; exports.tryLoadVeturTags = tryLoadVeturTags;
