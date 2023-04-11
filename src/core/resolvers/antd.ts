// ref: https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/antdv.ts

import type { ComponentResolverObject } from '../../types';

interface AntdExported {
  local: string;
  exported: string;
  source: string;
  styleDir?: string | null | undefined | void;
}

const antdExportedMap: { [x: string]: AntdExported } = {
  Affix: {
    local: 'default',
    exported: 'Affix',
    source: 'affix/index',
    styleDir: 'affix',
  },
  Anchor: {
    local: 'default',
    exported: 'Anchor',
    source: 'anchor/index',
    styleDir: 'anchor',
  },
  AutoComplete: {
    local: 'default',
    exported: 'AutoComplete',
    source: 'auto-complete/index',
    styleDir: 'auto-complete',
  },
  Alert: {
    local: 'default',
    exported: 'Alert',
    source: 'alert/index',
    styleDir: 'alert',
  },
  Avatar: {
    local: 'default',
    exported: 'Avatar',
    source: 'avatar/index',
    styleDir: 'avatar',
  },
  BackTop: {
    local: 'default',
    exported: 'BackTop',
    source: 'back-top/index',
    styleDir: 'back-top',
  },
  Badge: {
    local: 'default',
    exported: 'Badge',
    source: 'badge/index',
    styleDir: 'badge',
  },
  Base: {
    local: 'default',
    exported: 'Base',
    source: 'base/index',
    styleDir: 'base',
  },
  Breadcrumb: {
    local: 'default',
    exported: 'Breadcrumb',
    source: 'breadcrumb/index',
    styleDir: 'breadcrumb',
  },
  Button: {
    local: 'default',
    exported: 'Button',
    source: 'button/index',
    styleDir: 'button',
  },
  Calendar: {
    local: 'default',
    exported: 'Calendar',
    source: 'calendar/index',
    styleDir: 'calendar',
  },
  Card: {
    local: 'default',
    exported: 'Card',
    source: 'card/index',
    styleDir: 'card',
  },
  Collapse: {
    local: 'default',
    exported: 'Collapse',
    source: 'collapse/index',
    styleDir: 'collapse',
  },
  Carousel: {
    local: 'default',
    exported: 'Carousel',
    source: 'carousel/index',
    styleDir: 'carousel',
  },
  Cascader: {
    local: 'default',
    exported: 'Cascader',
    source: 'cascader/index',
    styleDir: 'cascader',
  },
  Checkbox: {
    local: 'default',
    exported: 'Checkbox',
    source: 'checkbox/index',
    styleDir: 'checkbox',
  },
  Col: {
    local: 'default',
    exported: 'Col',
    source: 'col/index',
    styleDir: 'col',
  },
  DatePicker: {
    local: 'default',
    exported: 'DatePicker',
    source: 'date-picker/index',
    styleDir: 'date-picker',
  },
  Divider: {
    local: 'default',
    exported: 'Divider',
    source: 'divider/index',
    styleDir: 'divider',
  },
  Dropdown: {
    local: 'default',
    exported: 'Dropdown',
    source: 'dropdown/index',
    styleDir: 'dropdown',
  },
  Form: {
    local: 'default',
    exported: 'Form',
    source: 'form/index',
    styleDir: 'form',
  },
  FormModel: {
    local: 'default',
    exported: 'FormModel',
    source: 'form-model/index',
    styleDir: 'form-model',
  },
  Icon: {
    local: 'default',
    exported: 'Icon',
    source: 'icon/index',
    styleDir: 'icon',
  },
  Input: {
    local: 'default',
    exported: 'Input',
    source: 'input/index',
    styleDir: 'input',
  },
  InputNumber: {
    local: 'default',
    exported: 'InputNumber',
    source: 'input-number/index',
    styleDir: 'input-number',
  },
  Layout: {
    local: 'default',
    exported: 'Layout',
    source: 'layout/index',
    styleDir: 'layout',
  },
  List: {
    local: 'default',
    exported: 'List',
    source: 'list/index',
    styleDir: 'list',
  },
  LocaleProvider: {
    local: 'default',
    exported: 'LocaleProvider',
    source: 'locale-provider/index',
    styleDir: 'locale-provider',
  },
  message: {
    local: 'default',
    exported: 'message',
    source: 'message/index',
    styleDir: 'message',
  },
  Menu: {
    local: 'default',
    exported: 'Menu',
    source: 'menu/index',
    styleDir: 'menu',
  },
  Mentions: {
    local: 'default',
    exported: 'Mentions',
    source: 'mentions/index',
    styleDir: 'mentions',
  },
  Modal: {
    local: 'default',
    exported: 'Modal',
    source: 'modal/index',
    styleDir: 'modal',
  },
  notification: {
    local: 'default',
    exported: 'notification',
    source: 'notification/index',
    styleDir: 'notification',
  },
  Pagination: {
    local: 'default',
    exported: 'Pagination',
    source: 'pagination/index',
    styleDir: 'pagination',
  },
  Popconfirm: {
    local: 'default',
    exported: 'Popconfirm',
    source: 'popconfirm/index',
    styleDir: 'popconfirm',
  },
  Popover: {
    local: 'default',
    exported: 'Popover',
    source: 'popover/index',
    styleDir: 'popover',
  },
  Progress: {
    local: 'default',
    exported: 'Progress',
    source: 'progress/index',
    styleDir: 'progress',
  },
  Radio: {
    local: 'default',
    exported: 'Radio',
    source: 'radio/index',
    styleDir: 'radio',
  },
  Rate: {
    local: 'default',
    exported: 'Rate',
    source: 'rate/index',
    styleDir: 'rate',
  },
  Row: {
    local: 'default',
    exported: 'Row',
    source: 'row/index',
    styleDir: 'row',
  },
  Select: {
    local: 'default',
    exported: 'Select',
    source: 'select/index',
    styleDir: 'select',
  },
  Slider: {
    local: 'default',
    exported: 'Slider',
    source: 'slider/index',
    styleDir: 'slider',
  },
  Spin: {
    local: 'default',
    exported: 'Spin',
    source: 'spin/index',
    styleDir: 'spin',
  },
  Statistic: {
    local: 'default',
    exported: 'Statistic',
    source: 'statistic/index',
    styleDir: 'statistic',
  },
  Steps: {
    local: 'default',
    exported: 'Steps',
    source: 'steps/index',
    styleDir: 'steps',
  },
  Switch: {
    local: 'default',
    exported: 'Switch',
    source: 'switch/index',
    styleDir: 'switch',
  },
  Table: {
    local: 'default',
    exported: 'Table',
    source: 'table/index',
    styleDir: 'table',
  },
  Transfer: {
    local: 'default',
    exported: 'Transfer',
    source: 'transfer/index',
    styleDir: 'transfer',
  },
  Tree: {
    local: 'default',
    exported: 'Tree',
    source: 'tree/index',
    styleDir: 'tree',
  },
  TreeSelect: {
    local: 'default',
    exported: 'TreeSelect',
    source: 'tree-select/index',
    styleDir: 'tree-select',
  },
  Tabs: {
    local: 'default',
    exported: 'Tabs',
    source: 'tabs/index',
    styleDir: 'tabs',
  },
  Tag: {
    local: 'default',
    exported: 'Tag',
    source: 'tag/index',
    styleDir: 'tag',
  },
  TimePicker: {
    local: 'default',
    exported: 'TimePicker',
    source: 'time-picker/index',
    styleDir: 'time-picker',
  },
  Timeline: {
    local: 'default',
    exported: 'Timeline',
    source: 'timeline/index',
    styleDir: 'timeline',
  },
  Tooltip: {
    local: 'default',
    exported: 'Tooltip',
    source: 'tooltip/index',
    styleDir: 'tooltip',
  },
  Upload: {
    local: 'default',
    exported: 'Upload',
    source: 'upload/index',
    styleDir: 'upload',
  },
  version: {
    local: 'default',
    exported: 'version',
    source: 'version/index',
    styleDir: 'version',
  },
  Drawer: {
    local: 'default',
    exported: 'Drawer',
    source: 'drawer/index',
    styleDir: 'drawer',
  },
  Skeleton: {
    local: 'default',
    exported: 'Skeleton',
    source: 'skeleton/index',
    styleDir: 'skeleton',
  },
  Comment: {
    local: 'default',
    exported: 'Comment',
    source: 'comment/index',
    styleDir: 'comment',
  },
  ConfigProvider: {
    local: 'default',
    exported: 'ConfigProvider',
    source: 'config-provider/index',
    styleDir: 'config-provider',
  },
  Empty: {
    local: 'default',
    exported: 'Empty',
    source: 'empty/index',
    styleDir: 'empty',
  },
  Result: {
    local: 'default',
    exported: 'Result',
    source: 'result/index',
    styleDir: 'result',
  },
  Descriptions: {
    local: 'default',
    exported: 'Descriptions',
    source: 'descriptions/index',
    styleDir: 'descriptions',
  },
  PageHeader: {
    local: 'default',
    exported: 'PageHeader',
    source: 'page-header/index',
    styleDir: 'page-header',
  },
  Space: {
    local: 'default',
    exported: 'Space',
    source: 'space/index',
    styleDir: 'space',
  },
};

export interface AntdResolverOptions {
  /**
   * @default 'A'
   */
  prefix?: string;

  /**
   * @default 'esm'
   */
  format?: 'esm' | 'cjs';

  /**
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less';

  /**
   * @default false
   */
  specificImport?: boolean;

  /**
   * @default []
   */
  exclude?: string[];
}

/**
 * Resolver for ant-design-vue@1.x
 */
export function AntdResolver(options: AntdResolverOptions = {}): ComponentResolverObject {
  const { prefix = 'A', format = 'esm', importStyle = 'css', specificImport = false, exclude = [] } = options;

  return {
    type: 'component',
    resolve: (name: string) => {
      if (exclude.includes(name)) return;

      if (!name.startsWith(prefix)) return;
      const exportedName = name.slice(prefix.length);
      if (!exportedName) return;

      const exportedInfo = antdExportedMap[exportedName];
      if (!exportedInfo) return;

      const { local, exported, source, styleDir } = exportedInfo;
      const path = `ant-design-vue/${format === 'esm' ? 'es' : 'lib'}`;

      let importPath = path;
      let importName = exported;
      if (specificImport) {
        importPath = `${path}/${source}`;
        importName = local;
      }

      const stylePath = !importStyle
        ? undefined
        : !styleDir
          ? undefined
          : `${path}/${styleDir}/${importStyle === 'less' ? 'style/index' : 'style/css'}`;

      return {
        name: importName,
        from: importPath,
        sideEffects: stylePath,
      };
    },
  };
}
