'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function OfflinePage() {
  return (
    <div className="bg-surface-variant flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-warning-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <span className="text-3xl">📱</span>
          </div>
          <CardTitle className="text-xl">离线模式</CardTitle>
          <CardDescription>您当前没有网络连接，部分功能可能受限</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-surface-container rounded-lg p-4">
            <h3 className="text-on-surface mb-2 font-medium">离线可用功能：</h3>
            <ul className="text-on-surface-variant space-y-1 text-sm">
              <li>• 查看已缓存的求职信</li>
              <li>• 浏览模板（已缓存）</li>
              <li>• 编辑草稿（本地保存）</li>
              <li>• 查看帮助文档</li>
            </ul>
          </div>

          <div className="bg-warning-50 border-warning-200 rounded-lg border p-4">
            <h3 className="text-warning-800 mb-2 font-medium">需要网络连接：</h3>
            <ul className="text-warning-700 space-y-1 text-sm">
              <li>• 生成新的求职信</li>
              <li>• 保存到云端</li>
              <li>• 导出PDF</li>
              <li>• 同步数据</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button fullWidth onClick={() => window.location.reload()} className="mb-2">
              重新连接
            </Button>
            <Button variant="outline" fullWidth asChild>
              <Link href="/dashboard">返回仪表板</Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-on-surface-variant text-xs">网络恢复后，您的离线更改将自动同步</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
