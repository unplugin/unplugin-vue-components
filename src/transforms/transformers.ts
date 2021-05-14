import { Context } from "../context";
import { Transformer } from "../types"
import { Vue2Transformer } from "./vue2";
import { Vue3Transformer } from "./vue3";
import { Svelte3Transformer } from "./svelte3";

export function getTranformer(ctx: Context): Transformer {
  switch (ctx.options.transformer) {
    case 'svelte3':
      return Svelte3Transformer(ctx)

    case 'vue2':
      return Vue2Transformer(ctx)

    default:
      return Vue3Transformer(ctx)
  }
}
