'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/generate', label: 'Generate Cover Letter' },
  { href: '/dashboard/templates', label: 'My Templates' },
  { href: '/dashboard/history', label: 'History' },
];

const breadcrumbItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { label: 'Generate Cover Letter' },
];

const templates = [
  {
    id: 'professional',
    name: 'Professional Template',
    description: 'Classic professional template suitable for most positions',
    preview: 'Formal, concise, highlighting professional skills',
  },
  {
    id: 'creative',
    name: 'Creative Template',
    description: 'Suitable for design, marketing and other creative positions',
    preview: 'Creative, personalized expression',
  },
  {
    id: 'technical',
    name: 'Technical Template',
    description: 'Template designed specifically for technical positions',
    preview: 'Highlighting technical skills and project experience',
  },
  {
    id: 'executive',
    name: 'Executive Template',
    description: 'Suitable for management and senior positions',
    preview: 'Emphasizing leadership and strategic thinking',
  },
];

export default function GeneratePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    personalInfo: '',
    jobDescription: '',
    additionalRequirements: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement AI generation logic
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <>
      {/* Navigation */}
      <Navigation
        items={navigationItems}
        actions={
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <Button variant="outline" size="sm">
              Logout
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
            <h1 className="text-on-surface text-3xl font-bold">Generate Cover Letter</h1>
            <p className="text-on-surface-variant mt-2">
              Fill in the relevant information and AI will generate a personalized cover letter for
              you
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="space-y-6 lg:col-span-2">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Template</CardTitle>
                  <CardDescription>
                    Select the cover letter template that best fits your target position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          selectedTemplate === template.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-outline-variant hover:border-primary-300'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <h3 className="text-on-surface font-semibold">{template.name}</h3>
                        <p className="text-on-surface-variant mt-1 text-sm">
                          {template.description}
                        </p>
                        <p className="text-primary-600 mt-2 text-xs">{template.preview}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Job Information */}
              <Card>
                <CardHeader>
                  <CardTitle>职位信息</CardTitle>
                  <CardDescription>提供您申请的职位相关信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="职位名称"
                    placeholder="例如：前端开发工程师"
                    value={formData.jobTitle}
                    onChange={e => handleInputChange('jobTitle', e.target.value)}
                  />
                  <Input
                    label="公司名称"
                    placeholder="例如：阿里巴巴"
                    value={formData.companyName}
                    onChange={e => handleInputChange('companyName', e.target.value)}
                  />
                  <Textarea
                    label="职位描述"
                    placeholder="粘贴职位描述或主要职责要求..."
                    value={formData.jobDescription}
                    onChange={e => handleInputChange('jobDescription', e.target.value)}
                    rows={6}
                  />
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>个人信息</CardTitle>
                  <CardDescription>提供您的背景和相关经验</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    label="个人背景"
                    placeholder="简要描述您的教育背景、工作经验、技能特长等..."
                    value={formData.personalInfo}
                    onChange={e => handleInputChange('personalInfo', e.target.value)}
                    rows={6}
                  />
                  <Textarea
                    label="特殊要求（可选）"
                    placeholder="如有特殊要求或想要强调的内容，请在此说明..."
                    value={formData.additionalRequirements}
                    onChange={e => handleInputChange('additionalRequirements', e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Generate Button */}
              <div className="flex justify-end">
                <Button
                  size="lg"
                  loading={isGenerating}
                  onClick={handleGenerate}
                  disabled={!formData.jobTitle || !formData.companyName || !formData.personalInfo}
                >
                  {isGenerating ? '正在生成...' : '生成求职信'}
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>预览</CardTitle>
                  <CardDescription>实时预览您的求职信效果</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-outline-variant bg-surface rounded-lg border p-6">
                    {isGenerating ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                          <p className="text-on-surface-variant text-sm">AI正在为您生成求职信...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-on-surface font-semibold">
                            {formData.jobTitle || '职位名称'}
                          </h3>
                          <p className="text-on-surface-variant text-sm">
                            {formData.companyName || '公司名称'}
                          </p>
                        </div>
                        <div className="border-outline-variant border-t pt-4">
                          <p className="text-on-surface-variant text-sm">
                            填写完整信息后，AI将在此处生成您的个性化求职信预览
                          </p>
                        </div>
                      </div>
                    )}
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
