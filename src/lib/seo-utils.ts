/**
 * SEO utility functions for generating optimized content
 */

/**
 * Generate SEO-optimized alt text for images
 */
export function generateImageAltText(
  imageType: 'logo' | 'template' | 'screenshot' | 'icon' | 'hero' | 'feature',
  context?: string,
  includeKeyword = true
): string {
  const baseKeyword = includeKeyword ? 'AI Cover Letter Generator' : '';
  
  switch (imageType) {
    case 'logo':
      return `${baseKeyword} Logo - Professional AI-Powered Cover Letter Creation Tool`;
    
    case 'template':
      return `${context || 'Professional'} Cover Letter Template - ${baseKeyword} Sample Design`;
    
    case 'screenshot':
      return `${baseKeyword} Interface Screenshot - ${context || 'Dashboard View'} for Creating Professional Cover Letters`;
    
    case 'icon':
      return `${context || 'Feature'} Icon - ${baseKeyword} Interface Element`;
    
    case 'hero':
      return `${baseKeyword} Hero Image - Create Professional ATS-Optimized Cover Letters with AI Technology`;
    
    case 'feature':
      return `${context || 'AI Technology'} Feature Illustration - ${baseKeyword} Capability Showcase`;
    
    default:
      return `${baseKeyword} - ${context || 'Professional Cover Letter Creation Tool'}`;
  }
}

/**
 * Generate SEO-optimized image titles
 */
export function generateImageTitle(
  imageType: 'logo' | 'template' | 'screenshot' | 'icon' | 'hero' | 'feature',
  context?: string
): string {
  switch (imageType) {
    case 'logo':
      return 'AI Cover Letter Generator Logo';
    
    case 'template':
      return `${context || 'Professional'} Cover Letter Template`;
    
    case 'screenshot':
      return `AI Cover Letter Generator ${context || 'Dashboard'}`;
    
    case 'icon':
      return `${context || 'Feature'} Icon`;
    
    case 'hero':
      return 'AI Cover Letter Generator Hero Image';
    
    case 'feature':
      return `${context || 'AI Technology'} Feature`;
    
    default:
      return `AI Cover Letter Generator ${context || 'Image'}`;
  }
}

/**
 * Generate structured data for images
 */
export function generateImageStructuredData(
  imageUrl: string,
  altText: string,
  title: string,
  width?: number,
  height?: number
) {
  return {
    '@type': 'ImageObject',
    url: imageUrl,
    name: title,
    alternateName: altText,
    description: altText,
    ...(width && { width }),
    ...(height && { height }),
    encodingFormat: 'image/webp',
  };
}

/**
 * Template preview alt text generator
 */
export function generateTemplateAltText(templateName: string, templateType: string): string {
  return `${templateName} Cover Letter Template - ${templateType} Design for AI Cover Letter Generator - Professional ATS-Optimized Layout`;
}

/**
 * Feature icon alt text generator
 */
export function generateFeatureIconAltText(featureName: string): string {
  return `${featureName} Feature Icon - AI Cover Letter Generator Capability Illustration`;
}

/**
 * Dashboard screenshot alt text generator
 */
export function generateDashboardAltText(screenName: string): string {
  return `AI Cover Letter Generator ${screenName} Interface - Professional Cover Letter Creation Dashboard Screenshot`;
}

/**
 * Generate meta description with keyword optimization
 */
export function generateMetaDescription(
  pageType: 'home' | 'templates' | 'examples' | 'pricing' | 'about' | 'contact' | 'dashboard',
  customContent?: string
): string {
  const baseKeyword = 'AI Cover Letter Generator';
  
  switch (pageType) {
    case 'home':
      return `Create professional, personalized cover letters instantly with our ${baseKeyword}. Multiple templates, ATS optimization, and expert-quality results to help you land your dream job.`;
    
    case 'templates':
      return `Browse professional cover letter templates from our ${baseKeyword}. Choose from creative, technical, executive, and entry-level designs optimized for ATS systems.`;
    
    case 'examples':
      return `View real cover letter examples created with our ${baseKeyword}. See how AI technology creates compelling, personalized cover letters for different industries.`;
    
    case 'pricing':
      return `Affordable pricing plans for our ${baseKeyword}. Create unlimited professional cover letters with ATS optimization and multiple templates starting from free.`;
    
    case 'about':
      return `Learn about our ${baseKeyword} - the leading AI-powered tool for creating professional, ATS-optimized cover letters that help job seekers land interviews.`;
    
    case 'contact':
      return `Contact the ${baseKeyword} team for support, feedback, or partnership opportunities. Get help with creating professional cover letters using AI technology.`;
    
    case 'dashboard':
      return `${baseKeyword} Dashboard - Manage your AI-generated cover letters, view statistics, and create new professional cover letters with our advanced AI technology.`;
    
    default:
      return customContent || `${baseKeyword} - Create professional, ATS-optimized cover letters with AI technology.`;
  }
}

/**
 * Generate page titles with keyword optimization
 */
export function generatePageTitle(
  pageType: 'home' | 'templates' | 'examples' | 'pricing' | 'about' | 'contact' | 'dashboard',
  customTitle?: string
): string {
  const baseKeyword = 'AI Cover Letter Generator';
  
  switch (pageType) {
    case 'home':
      return `${baseKeyword} - Create Professional Cover Letters with AI`;
    
    case 'templates':
      return `Cover Letter Templates - ${baseKeyword}`;
    
    case 'examples':
      return `Cover Letter Examples - ${baseKeyword}`;
    
    case 'pricing':
      return `Pricing Plans - ${baseKeyword}`;
    
    case 'about':
      return `About Us - ${baseKeyword}`;
    
    case 'contact':
      return `Contact Us - ${baseKeyword}`;
    
    case 'dashboard':
      return `Dashboard - ${baseKeyword}`;
    
    default:
      return customTitle || baseKeyword;
  }
}
