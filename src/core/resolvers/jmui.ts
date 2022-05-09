import type { ComponentResolver } from "../../types";
import { kebabCase } from "../utils";

/**
 * Resolver for JmPlus
 *
 */
export function JmPlusResolver(): ComponentResolver {
  return {
    type: "component",
    resolve: (name: string) => {
      const esComponentsFolder = "jm-plus/es/components";
      const dirName = kebabCase(name.slice(2));
      if (name.match(/^Jm[A-Z]/))
        return {
          name,
          from: "jm-plus/es",
          sideEffects: `${esComponentsFolder}/${dirName}/style/css`,
        };
    },
  };
}
