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
          <CardTitle className="text-xl">Offline Mode</CardTitle>
          <CardDescription>You are currently offline, some features may be limited</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-surface-container rounded-lg p-4">
            <h3 className="text-on-surface mb-2 font-medium">Available Offline:</h3>
            <ul className="text-on-surface-variant space-y-1 text-sm">
              <li>• View cached cover letters</li>
              <li>• Browse templates (cached)</li>
              <li>• Edit drafts (locally saved)</li>
              <li>• View help documentation</li>
            </ul>
          </div>

          <div className="bg-warning-50 border-warning-200 rounded-lg border p-4">
            <h3 className="text-warning-800 mb-2 font-medium">Requires Internet Connection:</h3>
            <ul className="text-warning-700 space-y-1 text-sm">
              <li>• Generate new cover letters</li>
              <li>• Save to cloud</li>
              <li>• Export to PDF</li>
              <li>• Sync data</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button fullWidth onClick={() => window.location.reload()} className="mb-2">
              Reconnect
            </Button>
            <Button variant="outline" fullWidth asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-on-surface-variant text-xs">
              Your offline changes will sync automatically when connection is restored
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
