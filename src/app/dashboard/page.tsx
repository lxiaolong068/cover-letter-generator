import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';

const navigationItems = [
  { href: '/dashboard', label: '仪表板' },
  { href: '/dashboard/generate', label: '生成求职信' },
  { href: '/dashboard/templates', label: '我的模板' },
  { href: '/dashboard/history', label: '历史记录' },
];

const breadcrumbItems = [{ href: '/', label: '首页' }, { label: '仪表板' }];

const quickActions = [
  {
    title: '创建新求职信',
    description: '使用AI快速生成个性化求职信',
    href: '/dashboard/generate',
    icon: '✨',
    color: 'bg-primary-500',
  },
  {
    title: '选择模板',
    description: '从多种专业模板中选择',
    href: '/dashboard/templates',
    icon: '📄',
    color: 'bg-secondary-500',
  },
  {
    title: '查看历史',
    description: '管理已生成的求职信',
    href: '/dashboard/history',
    icon: '📚',
    color: 'bg-success-500',
  },
  {
    title: '个人设置',
    description: '更新个人信息和偏好',
    href: '/dashboard/settings',
    icon: '⚙️',
    color: 'bg-warning-500',
  },
];

const recentCoverLetters = [
  {
    id: 1,
    title: '前端开发工程师 - 阿里巴巴',
    createdAt: '2024-01-15',
    status: '已完成',
  },
  {
    id: 2,
    title: '产品经理 - 腾讯',
    createdAt: '2024-01-14',
    status: '草稿',
  },
  {
    id: 3,
    title: 'UI设计师 - 字节跳动',
    createdAt: '2024-01-13',
    status: '已完成',
  },
];

const stats = [
  {
    label: '总求职信数',
    value: '12',
    change: '+2',
    changeType: 'increase' as const,
  },
  {
    label: '本月生成',
    value: '5',
    change: '+1',
    changeType: 'increase' as const,
  },
  {
    label: '成功投递',
    value: '8',
    change: '+3',
    changeType: 'increase' as const,
  },
  {
    label: '面试邀请',
    value: '3',
    change: '+1',
    changeType: 'increase' as const,
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Navigation */}
      <Navigation
        items={navigationItems}
        actions={
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              帮助
            </Button>
            <Button variant="outline" size="sm">
              退出登录
            </Button>
          </div>
        }
      />

      <div className="bg-surface-variant min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-on-surface text-3xl font-bold">仪表板</h1>
            <p className="text-on-surface-variant mt-2">欢迎回来！管理您的求职信和查看统计数据。</p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-on-surface-variant text-sm font-medium">{stat.label}</p>
                      <p className="text-on-surface text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          stat.changeType === 'increase'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-error-100 text-error-800'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                  <CardDescription>选择下面的操作快速开始您的求职信创建流程</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        href={action.href}
                        className="group border-outline-variant hover:border-primary-300 relative overflow-hidden rounded-lg border p-6 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white`}
                          >
                            <span className="text-xl">{action.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-on-surface group-hover:text-primary-600 font-semibold">
                              {action.title}
                            </h3>
                            <p className="text-on-surface-variant mt-1 text-sm">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Cover Letters */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>最近的求职信</CardTitle>
                  <CardDescription>您最近创建的求职信</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCoverLetters.map(letter => (
                      <div
                        key={letter.id}
                        className="border-outline-variant flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <h4 className="text-on-surface font-medium">{letter.title}</h4>
                          <p className="text-on-surface-variant text-sm">{letter.createdAt}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              letter.status === '已完成'
                                ? 'bg-success-100 text-success-800'
                                : 'bg-warning-100 text-warning-800'
                            }`}
                          >
                            {letter.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" fullWidth asChild>
                      <Link href="/dashboard/history">查看全部</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
