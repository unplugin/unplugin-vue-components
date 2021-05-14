import { ResolvedConfig } from "vite";
import { Context } from "../context";
import { Options, Transformer } from "../types"
import { Vue2Transformer } from "./vue2";
import { Vue3Transformer } from "./vue3";
import { Svelte3Transformer } from "./svelte3";

type MatchingTransformerType = (config: ResolvedConfig, options: Options) => {transformer: Transformer, ctx: Context }

export const getMatchingTranformer: MatchingTransformerType = (config, options) => {
  let transformer: Transformer
  if (config.plugins.find(i => i.name === 'vite-plugin-vue2'))
    options.transformer = options.transformer || 'vue2'
  else if (config.plugins.find(i => i.name === 'vite-plugin-svelte'))
    options.transformer = options.transformer || 'svelte3'


  let ctx: Context = new Context(options, config)
  switch (ctx.options.transformer) {
    case 'svelte3':
      transformer = Svelte3Transformer(ctx)
      break;

    case 'vue2':
      transformer = Vue2Transformer(ctx)
      break;

    default:
      transformer = Vue3Transformer(ctx)
      break;
  }

  return {transformer: transformer, ctx: ctx};
}
