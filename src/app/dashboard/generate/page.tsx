'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';

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
    name: 'Professional Cover Letter Template',
    description: 'Classic professional cover letter template suitable for most corporate positions and industries',
    preview: 'Formal, ATS-optimized format highlighting professional skills and experience',
  },
  {
    id: 'creative',
    name: 'Creative Cover Letter Template',
    description: 'Dynamic cover letter template perfect for design, marketing, and creative industry positions',
    preview: 'Creative layout with personalized expression and visual appeal',
  },
  {
    id: 'technical',
    name: 'Technical Cover Letter Template',
    description: 'Specialized cover letter template designed for software engineering, IT, and technical roles',
    preview: 'Emphasizes technical skills, programming languages, and project experience',
  },
  {
    id: 'executive',
    name: 'Executive Cover Letter Template',
    description: 'Premium cover letter template tailored for C-level, management, and senior leadership positions',
    preview: 'Executive format emphasizing leadership achievements and strategic thinking',
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
            <h1 className="text-on-surface text-3xl font-bold">Generate Professional Cover Letter with AI</h1>
            <p className="text-on-surface-variant mt-2">
              Fill in your job details and our AI Cover Letter Generator will create a personalized,
              ATS-optimized cover letter tailored to your target position.
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
                  <CardTitle>Job Information</CardTitle>
                  <CardDescription>
                    Provide information about the position you&apos;re applying for
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Job Title"
                    placeholder="e.g., Frontend Developer"
                    value={formData.jobTitle}
                    onChange={e => handleInputChange('jobTitle', e.target.value)}
                  />
                  <Input
                    label="Company Name"
                    placeholder="e.g., Google"
                    value={formData.companyName}
                    onChange={e => handleInputChange('companyName', e.target.value)}
                  />
                  <Textarea
                    label="Job Description"
                    placeholder="Paste the job description or main responsibilities..."
                    value={formData.jobDescription}
                    onChange={e => handleInputChange('jobDescription', e.target.value)}
                    rows={6}
                  />
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Provide your background and relevant experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    label="Personal Background"
                    placeholder="Briefly describe your education, work experience, skills, etc..."
                    value={formData.personalInfo}
                    onChange={e => handleInputChange('personalInfo', e.target.value)}
                    rows={6}
                  />
                  <Textarea
                    label="Additional Requirements (Optional)"
                    placeholder="Any special requirements or content you want to emphasize..."
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
                  {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Real-time preview of your cover letter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-outline-variant bg-surface rounded-lg border p-6">
                    {isGenerating ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="border-primary-500 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                          <p className="text-on-surface-variant text-sm">
                            AI is generating your cover letter...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-on-surface font-semibold">
                            {formData.jobTitle || 'Job Title'}
                          </h3>
                          <p className="text-on-surface-variant text-sm">
                            {formData.companyName || 'Company Name'}
                          </p>
                        </div>
                        <div className="border-outline-variant border-t pt-4">
                          <p className="text-on-surface-variant text-sm">
                            After filling in complete information, AI will generate your
                            personalized cover letter preview here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contextual Navigation */}
          <ContextualNav currentPage="generate" />
        </div>
      </div>
    </>
  );
}
