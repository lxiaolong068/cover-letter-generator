import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardActions,
} from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Component Showcase - Cover Letter Generator',
  description: 'Showcase of all UI components used in the Cover Letter Generator project',
  robots: 'noindex, nofollow',
};

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-variant to-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold gradient-text">Design System Demo</h1>
          <p className="text-lg text-on-surface-variant">
            Showcasing the new Material Design 3.0 components and color system
          </p>
        </div>

        {/* Button Showcase */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-on-surface">Button Variants</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card variant="elevated" className="animate-slide-up">
              <CardHeader>
                <CardTitle>Primary Buttons</CardTitle>
                <CardDescription>Main action buttons with gradient backgrounds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="primary" size="sm">
                  Small Primary
                </Button>
                <Button variant="primary" size="md">
                  Medium Primary
                </Button>
                <Button variant="primary" size="lg">
                  Large Primary
                </Button>
                <Button variant="primary" size="xl">
                  Extra Large Primary
                </Button>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-up delay-150">
              <CardHeader>
                <CardTitle>Secondary & Accent</CardTitle>
                <CardDescription>Alternative action buttons with modern styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="secondary" size="md">
                  Secondary
                </Button>
                <Button variant="accent" size="md">
                  Accent
                </Button>
                <Button variant="outline" size="md">
                  Outline
                </Button>
                <Button variant="ghost" size="md">
                  Ghost
                </Button>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-up delay-300">
              <CardHeader>
                <CardTitle>Special Variants</CardTitle>
                <CardDescription>Material Design 3.0 specific button styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="filled" size="md">
                  Filled
                </Button>
                <Button variant="filled-tonal" size="md">
                  Filled Tonal
                </Button>
                <Button variant="elevated" size="md">
                  Elevated
                </Button>
                <Button variant="destructive" size="md">
                  Destructive
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Card Showcase */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-on-surface">Card Variants</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="default" className="animate-slide-up">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Standard card with subtle elevation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  This is a default card with standard styling and hover effects.
                </p>
              </CardContent>
              <CardActions>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </CardActions>
            </Card>

            <Card variant="elevated" className="animate-slide-up delay-150">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Card with enhanced elevation and shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  This card has more prominent elevation and enhanced hover effects.
                </p>
              </CardContent>
              <CardActions>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardActions>
            </Card>

            <Card variant="filled" className="animate-slide-up delay-300">
              <CardHeader>
                <CardTitle>Filled Card</CardTitle>
                <CardDescription>Card with filled background container</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  This card uses a filled container background for enhanced visibility.
                </p>
              </CardContent>
              <CardActions>
                <Button variant="secondary" size="sm">
                  Explore
                </Button>
              </CardActions>
            </Card>

            <Card variant="outlined" className="animate-slide-up delay-500">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>Card with prominent border styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  This card emphasizes borders and has clean, minimal styling.
                </p>
              </CardContent>
            </Card>

            <Card variant="tonal" className="animate-slide-up delay-700">
              <CardHeader>
                <CardTitle>Tonal Card</CardTitle>
                <CardDescription>Card with subtle tonal background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  This card uses a tonal background that adapts to the theme.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="animate-slide-up delay-1000">
              <CardHeader>
                <CardTitle>Glass Card</CardTitle>
                <CardDescription>Card with glass morphism effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  This card features a modern glass effect with backdrop blur.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Color System Showcase */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-on-surface">Color System</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card variant="elevated" className="animate-slide-up">
              <CardHeader>
                <CardTitle>Primary Colors</CardTitle>
                <CardDescription>Professional deep blue palette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div
                      key={shade}
                      className={`h-12 w-12 rounded-lg shadow-sm bg-primary-${shade} flex items-center justify-center text-xs font-medium`}
                      style={{ backgroundColor: `var(--color-primary-${shade})` }}
                    >
                      {shade}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-up delay-150">
              <CardHeader>
                <CardTitle>Secondary Colors</CardTitle>
                <CardDescription>Elegant teal accent palette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div
                      key={shade}
                      className={`h-12 w-12 rounded-lg shadow-sm bg-secondary-${shade} flex items-center justify-center text-xs font-medium`}
                      style={{ backgroundColor: `var(--color-secondary-${shade})` }}
                    >
                      {shade}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-up delay-300">
              <CardHeader>
                <CardTitle>Accent Colors</CardTitle>
                <CardDescription>Vibrant orange highlight palette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div
                      key={shade}
                      className={`h-12 w-12 rounded-lg shadow-sm bg-accent-${shade} flex items-center justify-center text-xs font-medium`}
                      style={{ backgroundColor: `var(--color-accent-${shade})` }}
                    >
                      {shade}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-on-surface">Interactive Elements</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card variant="elevated" interactive className="animate-slide-up cursor-pointer">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>This card responds to hover and click</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  Click or hover over this card to see the interactive effects in action.
                </p>
              </CardContent>
            </Card>

            <Card variant="outlined" className="animate-slide-up delay-150">
              <CardHeader>
                <CardTitle>Button Combinations</CardTitle>
                <CardDescription>Various button styles working together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" leftIcon={<span>✨</span>}>
                    Primary
                  </Button>
                  <Button variant="secondary" size="sm" rightIcon={<span>→</span>}>
                    Secondary
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" loading>
                    Loading
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    Disabled
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card variant="glass" className="animate-bounce-in p-12">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Experience the New Design?</CardTitle>
              <CardDescription className="text-lg">
                The new Material Design 3.0 system provides better contrast, modern aesthetics, and
                enhanced user experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button variant="primary" size="lg" className="button-hover-lift">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="button-hover-lift">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
