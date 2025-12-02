import { NButton } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';

export const tabColumns = (play: any): DataTableColumns<any> => [
    {
        type: 'selection', // 特殊类型，无需 key
    },
    {
        title: 'No',
        key: 'no',
    },
    {
        title: 'Title',
        key: 'title',
    },
    {
        title: 'Length',
        key: 'length',
    },
    {
        title: 'Action',
        key: 'actions',
        render(row: any) {
            return h(
                NButton,
                {
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: () => play(row),
                },
                { default: () => 'Play' }
            );
        },
    },
];