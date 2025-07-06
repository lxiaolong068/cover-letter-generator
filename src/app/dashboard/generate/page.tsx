'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Navigation, Breadcrumb } from '@/components/ui/Navigation';
import { ContextualNav } from '@/components/seo/InternalLinks';
import { dashboardNavigation, createBreadcrumbs } from '@/lib/navigation';

const navigationItems = dashboardNavigation;
const breadcrumbItems = createBreadcrumbs('/dashboard/generate');

const templates = [
  {
    id: 'professional',
    name: 'Professional Cover Letter Template',
    description:
      'Classic professional cover letter template suitable for most corporate positions and industries',
    preview: 'Formal, ATS-optimized format highlighting professional skills and experience',
  },
  {
    id: 'creative',
    name: 'Creative Cover Letter Template',
    description:
      'Dynamic cover letter template perfect for design, marketing, and creative industry positions',
    preview: 'Creative layout with personalized expression and visual appeal',
  },
  {
    id: 'technical',
    name: 'Technical Cover Letter Template',
    description:
      'Specialized cover letter template designed for software engineering, IT, and technical roles',
    preview: 'Emphasizes technical skills, programming languages, and project experience',
  },
  {
    id: 'executive',
    name: 'Executive Cover Letter Template',
    description:
      'Premium cover letter template tailored for C-level, management, and senior leadership positions',
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
  const [generatedContent, setGeneratedContent] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: formData.jobDescription,
          userProfile: formData.personalInfo,
          coverLetterType: selectedTemplate,
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          additionalRequirements: formData.additionalRequirements,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let content = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          content += chunk;
          setGeneratedContent(content);
        }
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      // Handle error state
    } finally {
      setIsGenerating(false);
    }
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

      <div className="min-h-screen bg-surface-variant">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} className="mb-8" />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface">
              Generate Professional Cover Letter with AI
            </h1>
            <p className="mt-2 text-on-surface-variant">
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
                        <h3 className="font-semibold text-on-surface">{template.name}</h3>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {template.description}
                        </p>
                        <p className="mt-2 text-xs text-primary-600">{template.preview}</p>
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
                  <div>
                    <label
                      htmlFor="job-title"
                      className="block text-sm font-medium text-on-surface"
                    >
                      Job Title
                    </label>
                    <Input
                      id="job-title"
                      className="mt-1"
                      placeholder="e.g., Frontend Developer"
                      value={formData.jobTitle}
                      onChange={e => handleInputChange('jobTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company-name"
                      className="block text-sm font-medium text-on-surface"
                    >
                      Company Name
                    </label>
                    <Input
                      id="company-name"
                      className="mt-1"
                      placeholder="e.g., Google"
                      value={formData.companyName}
                      onChange={e => handleInputChange('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="job-description"
                      className="block text-sm font-medium text-on-surface"
                    >
                      Job Description
                    </label>
                    <Textarea
                      id="job-description"
                      className="mt-1"
                      placeholder="Paste the job description or main responsibilities..."
                      value={formData.jobDescription}
                      onChange={e => handleInputChange('jobDescription', e.target.value)}
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Provide your background and relevant experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label
                      htmlFor="personal-background"
                      className="block text-sm font-medium text-on-surface"
                    >
                      Personal Background
                    </label>
                    <Textarea
                      id="personal-background"
                      className="mt-1"
                      placeholder="Briefly describe your education, work experience, skills, etc..."
                      value={formData.personalInfo}
                      onChange={e => handleInputChange('personalInfo', e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="additional-requirements"
                      className="block text-sm font-medium text-on-surface"
                    >
                      Additional Requirements (Optional)
                    </label>
                    <Textarea
                      id="additional-requirements"
                      className="mt-1"
                      placeholder="Any special requirements or content you want to emphasize..."
                      value={formData.additionalRequirements}
                      onChange={e => handleInputChange('additionalRequirements', e.target.value)}
                      rows={4}
                    />
                  </div>
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
                  <div className="rounded-lg border border-outline-variant bg-surface p-6">
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-semibold text-on-surface">
                            {formData.jobTitle || 'Job Title'}
                          </h3>
                          <p className="text-sm text-on-surface-variant">
                            {formData.companyName || 'Company Name'}
                          </p>
                        </div>
                        <div className="border-t border-outline-variant pt-4">
                          <div className="flex items-center justify-center py-4">
                            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                          </div>
                          <div className="whitespace-pre-wrap text-sm text-on-surface">
                            {generatedContent || 'AI is generating your cover letter...'}
                          </div>
                        </div>
                      </div>
                    ) : generatedContent ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-semibold text-on-surface">
                            {formData.jobTitle || 'Job Title'}
                          </h3>
                          <p className="text-sm text-on-surface-variant">
                            {formData.companyName || 'Company Name'}
                          </p>
                        </div>
                        <div className="border-t border-outline-variant pt-4">
                          <div className="whitespace-pre-wrap text-sm text-on-surface">
                            {generatedContent}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-semibold text-on-surface">
                            {formData.jobTitle || 'Job Title'}
                          </h3>
                          <p className="text-sm text-on-surface-variant">
                            {formData.companyName || 'Company Name'}
                          </p>
                        </div>
                        <div className="border-t border-outline-variant pt-4">
                          <p className="text-sm text-on-surface-variant">
                            Fill in the form details to see a preview of your cover letter
                            structure. Click &quot;Generate Cover Letter&quot; to create your
                            personalized AI cover letter.
                          </p>
                          {(formData.jobTitle || formData.companyName || formData.personalInfo) && (
                            <div className="mt-4 space-y-2">
                              <div className="text-sm text-on-surface">
                                <strong>Preview Structure:</strong>
                              </div>
                              <div className="text-sm text-on-surface-variant">
                                Dear Hiring Manager,
                                <br />
                                <br />I am writing to express my strong interest in the{' '}
                                <span className="text-primary-600">
                                  {formData.jobTitle || '[Position]'}
                                </span>{' '}
                                position at{' '}
                                <span className="text-primary-600">
                                  {formData.companyName || '[Company]'}
                                </span>
                                .
                                <br />
                                <br />
                                {formData.personalInfo && (
                                  <>
                                    Based on my background:{' '}
                                    {formData.personalInfo.substring(0, 100)}...
                                    <br />
                                    <br />
                                  </>
                                )}
                                I look forward to the opportunity to discuss how I can contribute to
                                your team.
                                <br />
                                <br />
                                Sincerely,
                                <br />
                                [Your Name]
                              </div>
                            </div>
                          )}
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
