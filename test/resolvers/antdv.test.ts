import type { ComponentResolveResult, ComponentResolverObject } from '../../src'
import { describe, expect, it } from 'vitest'

import { AntDesignVueResolver } from '../../src/resolvers'

describe('antdvResolver', () => {
  it('defaults resolveDateLibrary to dayjs for date components', () => {
    const resolver = AntDesignVueResolver() as ComponentResolverObject

    expect(resolver.resolve('AButton')).toEqual<ComponentResolveResult>({
      name: 'Button',
      from: 'ant-design-vue/es',
      sideEffects: 'ant-design-vue/es/button/style/css',
    })

    expect(resolver.resolve('ADatePicker')).toEqual<ComponentResolveResult>({
      from: 'ant-design-vue/es/date-picker/dayjs',
      sideEffects: 'ant-design-vue/es/date-picker/style/css',
    })

    expect(resolver.resolve('ARangePicker')).toEqual<ComponentResolveResult>({
      name: 'RangePicker',
      from: 'ant-design-vue/es/date-picker/dayjs',
      sideEffects: 'ant-design-vue/es/date-picker/style/css',
    })

    expect(resolver.resolve('ATimePicker')).toEqual<ComponentResolveResult>({
      name: 'TimePicker',
      from: 'ant-design-vue/es/time-picker/dayjs',
      sideEffects: 'ant-design-vue/es/time-picker/style/css',
    })
  })

  it('resolveDateLibrary: date-fns uses calendar and date-picker subpaths', () => {
    const resolver = AntDesignVueResolver({ resolveDateLibrary: 'date-fns' }) as ComponentResolverObject

    expect(resolver.resolve('ADatePicker')).toEqual<ComponentResolveResult>({
      from: 'ant-design-vue/es/date-picker/date-fns',
      sideEffects: 'ant-design-vue/es/date-picker/style/css',
    })

    expect(resolver.resolve('ACalendar')).toEqual<ComponentResolveResult>({
      from: 'ant-design-vue/es/calendar/date-fns',
      sideEffects: 'ant-design-vue/es/calendar/style/css',
    })
  })

  it('resolveDateLibrary with cjs uses lib/ and moment subpath', () => {
    const resolver = AntDesignVueResolver({ resolveDateLibrary: 'moment', cjs: true }) as ComponentResolverObject
    expect(resolver.resolve('ADatePicker')).toEqual<ComponentResolveResult>({
      from: 'ant-design-vue/lib/date-picker/moment',
      sideEffects: 'ant-design-vue/lib/date-picker/style/css',
    })
  })
})
