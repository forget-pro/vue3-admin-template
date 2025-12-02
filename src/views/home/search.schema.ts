import type { NaiveSearchSchema } from '@/components/search-form/component'
export const searchSchema: NaiveSearchSchema = [
    {
        key: 'name',
        label: '名称',
        type: 'input',
        props: {
            placeholder: '请输入名称',
        },
    },
    {
        key: 'age',
        label: '选项',
        type: 'select',
        props: {
            options: [
                { label: '选项一', value: '1' },
                { label: '选项二', value: '2' },
                { label: '选项三', value: '3' },
            ],
            placeholder: '请输入名称',
        },
    },
    {
        key: 'start_time',
        label: '开始时间 ',
        type: 'datePicker',
        props: {
            placeholder: '请选择开始时间',
        },
    },
    {
        key: 'pay_time',
        label: '支付时间 ',
        type: 'datePicker',
        props: {
            placeholder: '请选择支付时间',
        },
    },
    {
        key: 'amount',
        label: '金额 ',
        type: 'number',
        props: {
            placeholder: '请选择输入金额',
        },
    },
    {
        key: 'create_time',
        label: '创建时间 ',
        type: 'datePicker',
        props: {
            clearable: true,
            type: 'daterange',
            placeholder: '请选择创建时间',
        },
    },
    {
        key: 'dynameic_options',
        label: '异步选项',
        type: 'asyncSelect',
        props: {
            placeholder: '请选择异步选项',
            asyncOptions: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([
                            { label: '异步选项一', value: 'a1' },
                            { label: '异步选项二', value: 'a2' },
                            { label: '异步选项三', value: 'a3' },
                        ])
                    }, 1000)
                })
            }
        },

    },
    {
        key: 'order_time',
        label: '下单时间',
        type: 'datePicker',
        props: {
            clearable: true,
            type: 'datetimerange',
            // placeholder: '请选择下单时间',
            'start-placeholder': '开始时间',
            "end-placeholder": "结束时间",
        },
    },
]