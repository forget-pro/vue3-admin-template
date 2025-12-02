import type { FormItemRule, FormRules } from 'naive-ui'

export const LoginFormRules: FormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: ['blur', 'input'] },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符之间', trigger: ['blur', 'input'] },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: ['blur', 'input'] },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符之间', trigger: ['blur', 'input'] },
    ],
    sliderVerify: [
        {
            required: true,
            key: 'sliderVerify',
            validator: (_rule: FormItemRule, value: boolean) => {
                if (!value) {
                    return Promise.reject('请完成滑动验证')
                }
                return Promise.resolve()
            },
            trigger: 'change',
        },
    ]
}