import type { FormInst } from 'naive-ui'

export const useForm = (ref: string) => {
    const formRef = useTemplateRef<FormInst | null>(ref)
    // 校验表单
    const validateForm = () => {
        return new Promise((resolve, reject) => {
            formRef.value?.validate((errors) => {
                if (!errors) {
                    resolve(true)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }
    // 重置表单
    const resetForm = () => {
        formRef.value?.restoreValidation()
    }

    return { formRef, validateForm, resetForm }
}
