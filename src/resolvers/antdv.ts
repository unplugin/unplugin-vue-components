import { ComponentResolver } from '../types';
import { kebabCase } from '../utils';

/**
 * Resolver for Ant Design Vue
 *
 * Requires ant-design-vue@v2.2.0-beta.6 or later
 *
 * See https://github.com/antfu/vite-plugin-components/issues/26#issuecomment-789767941 for more details
 *
 * @author @yangss3
 * @link https://antdv.com/
 */

interface IMatcher {
  pattern: RegExp;
  styleDir: string;
}

const matchComponents: IMatcher[] = [
  {
    pattern: /^Menu/,
    styleDir: 'menu',
  },
  {
    pattern: /^Layout/,
    styleDir: 'menu',
  },
  {
    pattern: /^Form/,
    styleDir: 'form',
  },
  {
    pattern: /^Table/,
    styleDir: 'table',
  },
  {
    pattern: /^Radio/,
    styleDir: 'radio',
  },
  {
    pattern: /^Dropdown/,
    styleDir: 'dropdown',
  },
  {
    pattern: /^Button/,
    styleDir: 'button',
  },
  {
    pattern: /^Checkbox/,
    styleDir: 'checkbox',
  },
  {
    pattern: /^List/,
    styleDir: 'list',
  },
  {
    pattern: /^Collapse/,
    styleDir: 'collapse',
  },
  {
    pattern: /^Descriptions/,
    styleDir: 'descriptions',
  },
  {
    pattern: /^Tabs/,
    styleDir: 'tabs',
  },
  {
    pattern: /^Mentions/,
    styleDir: 'mentions',
  },
  {
    pattern: /^Select/,
    styleDir: 'select',
  },
  {
    pattern: /^Mentions/,
    styleDir: 'mentions',
  },
  {
    pattern: /^Anchor/,
    styleDir: 'anchor',
  },
  {
    pattern: /^Typography/,
    styleDir: 'typography',
  },
  {
    pattern: /^TreeSelect/,
    styleDir: 'tree-select',
  },
  {
    pattern: /^Tree/,
    styleDir: 'tree',
  },
  {
    pattern: /^Step/,
    styleDir: 'steps',
  },
  {
    pattern: /^RangePicker|^WeekPicker|^MonthPicker/,
    styleDir: 'date-picker',
  },
];

export const AntDesignVueResolver = (): ComponentResolver => (name: string) => {
  if (name.match(/^A[A-Z]/)) {
    //Ant-Design-Vue
    const importName = name.slice(1);
    let styleDir;
    const total = matchComponents.length;
    for (let i = 0; i < total; i++) {
      const matcher = matchComponents[i];
      if (importName.match(matcher.pattern)) {
        styleDir = matcher.styleDir;
        break;
      }
    }

    if (!styleDir) {
      styleDir = kebabCase(importName);
    }

    return {
      importName: importName,
      path: `ant-design-vue/es`,
      sideEffects: `ant-design-vue/es/${styleDir}/style`,
    };
  }
};
