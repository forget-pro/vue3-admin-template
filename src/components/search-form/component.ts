import { NInput, NSelect, NDatePicker, NInputNumber, NTimePicker, NCascader, } from 'naive-ui'
import asyncSelect from './async-select.vue'
export type NaiveFieldType =
    | 'input'
    | 'select'
    | 'datePicker'
    | 'number'
    | 'timePicker'
    | 'cascader'
    | 'asyncSelect'

export const naiveComponentMap = {
    input: NInput,
    select: NSelect,
    datePicker: NDatePicker,
    number: NInputNumber,
    timePicker: NTimePicker,
    cascader: NCascader,
    asyncSelect: asyncSelect,
}

interface BaseField {
    key: string
    label: string
    type: NaiveFieldType
    props?: Record<string, any>
}

interface SelectField extends BaseField {
    type: 'asyncSelect'
    props?: {
        options?: Array<{ label: string; value: any }>
        [key: string]: any
    }
    asyncOptions?: () => Promise<Array<{ label: string; value: any }>>
}

export type NaiveSearchField = BaseField | SelectField

export type NaiveSearchSchema = NaiveSearchField[]