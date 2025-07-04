'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';

const navigationItems = [
  { href: '/dashboard', label: '仪表板' },
  { href: '/dashboard/generate', label: '生成求职信' },
  { href: '/dashboard/templates', label: '我的模板' },
  { href: '/dashboard/history', label: '历史记录' },
];

const breadcrumbItems = [
  { href: '/', label: '首页' },
  { href: '/dashboard', label: '仪表板' },
  { label: '生成求职信' },
];

const templates = [
  {
    id: 'professional',
    name: '专业模板',
    description: '适合大多数职位的经典专业模板',
    preview: '正式、简洁、突出专业技能',
  },
  {
    id: 'creative',
    name: '创意模板',
    description: '适合设计、营销等创意类职位',
    preview: '富有创意、个性化表达',
  },
  {
    id: 'technical',
    name: '技术模板',
    description: '专为技术岗位设计的模板',
    preview: '突出技术能力和项目经验',
  },
  {
    id: 'executive',
    name: '高管模板',
    description: '适合管理层和高级职位',
    preview: '强调领导力和战略思维',
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
    // TODO: 实现AI生成逻辑
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
            <h1 className="text-on-surface text-3xl font-bold">生成求职信</h1>
            <p className="text-on-surface-variant mt-2">填写相关信息，AI将为您生成个性化的求职信</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="space-y-6 lg:col-span-2">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>选择模板</CardTitle>
                  <CardDescription>选择最适合您目标职位的求职信模板</CardDescription>
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
