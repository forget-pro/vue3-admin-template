import { useForm } from '@/hook/useForm'
import { useState } from '@/hook/useState'
import useStore from '@/store'

interface Istate {
  formData: {
    username: string
    password: string
    remember: boolean
    sliderVerify: boolean
  }
  loading: boolean
}

export const useLoginHook = () => {
  const { validateForm } = useForm('formRef')

  const { useRouteStore } = useStore()

  const router = useRouter()

  const route = useRoute()

  const { state } = useState<Istate>({
    formData: {
      username: '',
      password: '',
      remember: false,
      sliderVerify: false,
    },
    loading: false,
  })

  // 登录
  const userLogin = async () => {
    try {
      state.loading = true
      await validateForm()
      // 先获取菜单数据
      // 调用接口 获取权限数据
      await useRouteStore.onRemoteMenus()
      // 初始化路由
      useRouteStore.initAuthRoute()
      // 保存登录凭证
      localStorage.setItem('token', Math.random().toString(36).substring(2))
      // 获取重定向地址
      const redirectUrl = route.query.redirect ? (route.query.redirect as string) : useRouteStore.firstMenuOption.key || '/'
      // 跳转（路由守卫会自动调用 initAuthRoute）
      router.replace({ path: redirectUrl as string })
    } finally {
      state.loading = false
    }
  }

  return { state, userLogin }
}
