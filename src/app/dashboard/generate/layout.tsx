import type { Metadata } from 'next';
import { HowToStructuredData } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Generate AI Cover Letter - Professional Cover Letter Generator',
  description:
    'Create professional, ATS-optimized cover letters instantly with our AI Cover Letter Generator. Input your job details and get expert-quality results in minutes.',
  keywords:
    'AI Cover Letter Generator, generate cover letter, cover letter creator, professional cover letter, ATS optimized cover letter',
  robots: {
    index: false, // Dashboard pages should not be indexed
    follow: false,
  },
};

const howToSteps = [
  {
    name: 'Enter Job Details',
    text: 'Input the job title, company name, and job description for the position you are applying to. This helps our AI understand the specific requirements and tailor your cover letter accordingly.',
    url: '/dashboard/generate#job-details',
  },
  {
    name: 'Add Personal Information',
    text: 'Provide your professional background, skills, and experience. Include relevant achievements and qualifications that match the job requirements.',
    url: '/dashboard/generate#personal-info',
  },
  {
    name: 'Choose Cover Letter Template',
    text: 'Select from professional, creative, technical, or executive cover letter templates based on your industry and the role you are applying for.',
    url: '/dashboard/generate#template-selection',
  },
  {
    name: 'Generate AI Cover Letter',
    text: 'Click the generate button and let our AI create a personalized, professional cover letter tailored to your job application in seconds.',
    url: '/dashboard/generate#generate',
  },
  {
    name: 'Review and Download',
    text: 'Review your AI-generated cover letter, make any necessary edits, and download it as a PDF for your job application.',
    url: '/dashboard/generate#review',
  },
];

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HowToStructuredData
        name="How to Generate a Professional Cover Letter with AI"
        description="Step-by-step guide to creating professional, ATS-optimized cover letters using our AI Cover Letter Generator"
        totalTime="PT5M"
        estimatedCost={{
          currency: 'USD',
          value: '0',
        }}
        steps={howToSteps}
      />
      {children}
    </>
  );
}
