/**
 * 应用加载动画 - 精致版
 * 在 Vue 应用 mount 之前显示，mount 之后移除
 */

// 创建 loading 样式
const createLoadingStyles = (): HTMLStyleElement => {
  const style = document.createElement('style')
  style.id = 'app-loading-style'
  style.innerHTML = `
    #app-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at center, #ffffff 0%, #f8fafc 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.5s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
    }

    #app-loading.fade-out {
      opacity: 0;
    }

    /* 主容器 */
    .loading-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    /* 旋转器容器 */
    .spinner-container {
      position: relative;
      width: 80px;
      height: 80px;
      filter: drop-shadow(0 12px 32px rgba(22, 119, 255, 0.3));
      animation: spinnerFloat 3s ease-in-out infinite;
    }

    @keyframes spinnerFloat {
      0%, 100% {
        transform: translateY(0px) scale(1);
      }
      50% {
        transform: translateY(-10px) scale(1.05);
      }
    }

    /* 外圈 - 轨道环 */
    .outer-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2.5px solid rgba(22, 119, 255, 0.15);
      border-top-color: #1677ff;
      border-right-color: #4096ff;
      animation: rotate 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      box-shadow: 0 0 15px rgba(22, 119, 255, 0.2);
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    /* 中圈 - 六边形旋转 */
    .middle-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 44px;
      height: 44px;
      margin: -22px 0 0 -22px;
      clip-path: polygon(
        50% 0%,
        90% 25%,
        90% 75%,
        50% 100%,
        10% 75%,
        10% 25%
      );
      background: linear-gradient(135deg, 
        rgba(22, 119, 255, 0.3) 0%,
        rgba(64, 150, 255, 0.5) 50%,
        rgba(22, 119, 255, 0.3) 100%
      );
      animation: hexagonSpin 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      box-shadow: 
        inset 0 0 15px rgba(64, 150, 255, 0.4),
        0 0 20px rgba(22, 119, 255, 0.3);
    }

    @keyframes hexagonSpin {
      0%, 100% {
        transform: rotate(0deg) scale(1);
        opacity: 0.8;
      }
      50% {
        transform: rotate(180deg) scale(1.1);
        opacity: 1;
      }
    }

    /* 内圈 - 脉冲光晕 */
    .inner-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 32px;
      height: 32px;
      margin: -16px 0 0 -16px;
      clip-path: polygon(
        50% 0%,
        90% 25%,
        90% 75%,
        50% 100%,
        10% 75%,
        10% 25%
      );
      background: radial-gradient(
        circle at center,
        rgba(22, 119, 255, 0.4) 0%,
        rgba(64, 150, 255, 0.2) 50%,
        transparent 100%
      );
      animation: hexagonPulse 3s ease-in-out infinite;
    }

    @keyframes hexagonPulse {
      0%, 100% {
        transform: rotate(0deg) scale(0.85);
        opacity: 0.6;
      }
      50% {
        transform: rotate(-180deg) scale(1.15);
        opacity: 1;
      }
    }

    /* 轨道粒子 */
    .orbit-particle {
      position: absolute;
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, #1677ff, #4096ff);
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(22, 119, 255, 0.8);
      animation: orbitRotate 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .orbit-particle:nth-child(4) {
      animation-delay: 0s;
      top: 0;
      left: 50%;
      margin-left: -4px;
    }

    .orbit-particle:nth-child(5) {
      animation-delay: -0.75s;
      top: 50%;
      right: 0;
      margin-top: -4px;
    }

    .orbit-particle:nth-child(6) {
      animation-delay: -1.5s;
      bottom: 0;
      left: 50%;
      margin-left: -4px;
    }

    .orbit-particle:nth-child(7) {
      animation-delay: -2.25s;
      top: 50%;
      left: 0;
      margin-top: -4px;
    }

    @keyframes orbitRotate {
      0% {
        transform: rotate(0deg) translateX(36px) rotate(0deg) scale(1);
        opacity: 1;
        box-shadow: 0 0 12px rgba(22, 119, 255, 0.8);
      }
      25% {
        transform: rotate(90deg) translateX(36px) rotate(-90deg) scale(1.15);
        opacity: 0.9;
        box-shadow: 0 0 16px rgba(64, 150, 255, 0.9);
      }
      50% {
        transform: rotate(180deg) translateX(36px) rotate(-180deg) scale(1);
        opacity: 1;
        box-shadow: 0 0 12px rgba(22, 119, 255, 0.8);
      }
      75% {
        transform: rotate(270deg) translateX(36px) rotate(-270deg) scale(1.15);
        opacity: 0.9;
        box-shadow: 0 0 16px rgba(64, 150, 255, 0.9);
      }
      100% {
        transform: rotate(360deg) translateX(36px) rotate(-360deg) scale(1);
        opacity: 1;
        box-shadow: 0 0 12px rgba(22, 119, 255, 0.8);
      }
    }

    @keyframes glowPulse {
      0%, 100% {
        opacity: 0.6;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
    }

    /* 中心核心点 */
    .core {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 16px;
      margin: -8px 0 0 -8px;
      background: linear-gradient(135deg, #1677ff 0%, #4096ff 50%, #69b1ff 100%);
      border-radius: 50%;
      box-shadow: 
        0 0 20px rgba(22, 119, 255, 0.7),
        0 0 40px rgba(22, 119, 255, 0.4),
        0 0 60px rgba(22, 119, 255, 0.2),
        inset 0 0 8px rgba(255, 255, 255, 0.9);
      animation: corePulse 2s ease-in-out infinite;
    }

    @keyframes corePulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 
          0 0 20px rgba(22, 119, 255, 0.7),
          0 0 40px rgba(22, 119, 255, 0.4),
          0 0 60px rgba(22, 119, 255, 0.2),
          inset 0 0 8px rgba(255, 255, 255, 0.9);
      }
      50% {
        transform: scale(1.2);
        box-shadow: 
          0 0 30px rgba(22, 119, 255, 0.9),
          0 0 60px rgba(22, 119, 255, 0.6),
          0 0 90px rgba(22, 119, 255, 0.3),
          inset 0 0 12px rgba(255, 255, 255, 1);
      }
    }

    /* 高光效果 */
    .core::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      filter: blur(0.5px);
    }

    /* 文字内容 */
    .loading-content {
      text-align: center;
      animation: contentSlideUp 0.8s ease-out 0.2s both;
    }

    @keyframes contentSlideUp {
      0% {
        opacity: 0;
        transform: translateY(16px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* 标题 */
    .loading-title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 12px;
      background: linear-gradient(
        135deg,
        #1677ff 0%,
        #4096ff 40%,
        #1677ff 60%,
        #4096ff 100%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s ease-in-out infinite;
      letter-spacing: 1.5px;
    }

    @keyframes shimmer {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    /* 描述文字 */
    .loading-description {
      font-size: 13px;
      font-weight: 400;
      color: #64748b;
      opacity: 0.85;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    /* 小圆点装饰 */
    .dots-container {
      display: flex;
      gap: 8px;
      margin-top: 20px;
      justify-content: center;
    }

    .dot {
      width: 6px;
      height: 6px;
      background: linear-gradient(135deg, #1677ff, #4096ff);
      border-radius: 50%;
      animation: dotBounce 1.4s ease-in-out infinite;
      box-shadow: 0 0 10px rgba(22, 119, 255, 0.5);
    }

    .dot:nth-child(1) {
      animation-delay: 0s;
    }

    .dot:nth-child(2) {
      animation-delay: 0.14s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.28s;
    }

    .dot:nth-child(4) {
      animation-delay: 0.42s;
    }

    .dot:nth-child(5) {
      animation-delay: 0.56s;
    }

    @keyframes dotBounce {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% {
        transform: scale(1.3);
        opacity: 1;
        box-shadow: 0 0 16px rgba(22, 119, 255, 0.8);
      }
    }
  `
  return style
}

// 创建 loading HTML 结构
const createLoadingElement = (): HTMLDivElement => {
  const loadingDiv = document.createElement('div')
  loadingDiv.id = 'app-loading'
  loadingDiv.innerHTML = `
    <div class="loading-wrapper">
      <div class="spinner-container">
        <div class="outer-ring"></div>
        <div class="middle-ring"></div>
        <div class="inner-glow"></div>
        <div class="orbit-particle"></div>
        <div class="orbit-particle"></div>
        <div class="orbit-particle"></div>
        <div class="orbit-particle"></div>
        <div class="core"></div>
      </div>
      <div class="loading-content">
        <div class="loading-title">Forget中控</div>
        <div class="loading-description">Enterprise Management System</div>
        <div class="dots-container">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  `
  return loadingDiv
}

/**
 * 显示 loading 动画
 */
export const showLoading = (): void => {
  // 创建并插入样式
  const style = createLoadingStyles()
  document.head.appendChild(style)

  // 创建并插入 loading 元素
  const loading = createLoadingElement()
  document.body.appendChild(loading)
}

/**
 * 隐藏 loading 动画
 * @param delay 延迟移除时间（毫秒），默认 300ms
 */
export const hideLoading = (delay: number = 300): void => {
  const loading = document.getElementById('app-loading')
  const style = document.getElementById('app-loading-style')

  if (loading) {
    // 添加淡出效果
    loading.classList.add('fade-out')

    // 延迟移除 DOM
    setTimeout(() => {
      loading.remove()
      style?.remove()
    }, delay + 600) // 等待动画完成
  }
}
