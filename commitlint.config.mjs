export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试
        'chore', // 构建/工具变动
        'revert', // 回滚
        'build', // 构建系统
        'ci', // CI配置
      ],
    ],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题最大长度
    'subject-max-length': [2, 'always', 100],
    // 类型必须小写
    'type-case': [2, 'always', 'lower-case'],
    // 主题不能以句号结尾
    'subject-full-stop': [2, 'never', '.'],
  },
}
