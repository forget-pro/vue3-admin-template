<template>
  <!-- 全屏背景图片 -->
  <div class="flex h-screen w-full items-center">
    <div class="relative h-full flex-2">
      <img src="https://up.shobee.cn/cdn-static/admin-login-background.webp" class="h-full w-full object-cover" alt="" />
    </div>
    <!-- 登录表单卡片 -->
    <div class="login-right-container animate-slide-in-right flex flex-1 items-center justify-center px-12">
      <div class="login-form-wrapper w-full max-w-md">
        <!-- 头部标题 -->
        <div class="mb-12">
          <h2 class="mb-3 text-4xl font-bold text-gray-900">Hi，欢迎回来 🙌</h2>
          <p class="text-base text-gray-500">请登录您的账号以继续使用</p>
        </div>

        <!-- 表单 -->
        <n-form ref="formRef" :model="state.formData" :rules="LoginFormRules" size="large">
          <!-- 用户名输入框 -->
          <n-form-item path="username" :show-label="false" class="form-item-custom">
            <n-input v-model:value="state.formData.username" placeholder="请输入用户名" :input-props="{ autocomplete: 'username' }" class="input-custom">
              <template #prefix>
                <span class="icon-[mdi--account] text-20 text-gray-400"></span>
              </template>
            </n-input>
          </n-form-item>

          <!-- 密码输入框 -->
          <n-form-item path="password" :show-label="false" class="form-item-custom">
            <n-input
              v-model:value="state.formData.password"
              type="password"
              show-password-on="click"
              placeholder="请输入密码"
              :input-props="{ autocomplete: 'current-password' }"
              class="input-custom">
              <template #prefix>
                <span class="icon-[mdi--shield-lock] text-20 text-gray-400"></span>
              </template>
            </n-input>
          </n-form-item>

          <!-- 滑块验证 -->
          <n-form-item path="sliderVerify" :show-label="false" class="form-item-custom">
            <slider-verify v-model="state.formData.sliderVerify" />
          </n-form-item>

          <!-- 记住我 & 忘记密码 -->
          <div class="mb-12 flex items-center justify-between">
            <n-checkbox v-model:checked="state.formData.remember" class="text-sm">
              <span class="text-gray-600">记住我</span>
            </n-checkbox>
            <n-button text type="primary" @click="handleForgetPassword" class="text-sm font-medium"> 忘记密码？ </n-button>
          </div>

          <!-- 登录按钮 -->
          <n-button type="primary" size="large" block :loading="state.loading" @click="userLogin" @keydown.enter="userLogin" class="font-semibold shadow-lg"> 登录 </n-button>

          <!-- 注册提示 -->
          <div class="mt-20 text-center text-sm text-gray-600">
            还没有账号？
            <n-button text type="primary" @click="handleRegister" class="font-semibold"> 立即注册 </n-button>
          </div>
        </n-form>

        <!-- 底部提示 -->
        <div class="mt-12 text-center text-xs text-gray-400">
          登录即表示您同意我们的
          <a href="#" class="text-primary-500 hover:underline">服务条款</a>
          和
          <a href="#" class="text-primary-500 hover:underline">隐私政策</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoginHook } from './hook'
import { LoginFormRules } from './rule'

const message = useMessage()

const { state, userLogin } = useLoginHook()

const handleForgetPassword = () => {
  message.info('忘记密码功能待开发')
}

const handleRegister = () => {
  message.info('注册功能待开发')
}
defineOptions({ name: 'LoginView' })
</script>

<style scoped lang="scss">
// 定义自定义动画关键帧
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(300px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 应用动画
.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out;
}
</style>
