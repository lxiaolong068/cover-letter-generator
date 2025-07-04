import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Container, Grid, Flex, Stack } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Component Showcase - Cover Letter Generator',
  description: 'Showcase of all UI components used in the Cover Letter Generator project',
  robots: 'noindex, nofollow',
};

export default function ComponentsPage() {
  return (
    <Container size="xl" padding="lg" className="py-12">
      <div className="mb-12 text-center">
        <h1 className="text-on-surface mb-4 text-4xl font-bold">UI Component Showcase</h1>
        <p className="text-on-surface-variant mx-auto max-w-2xl text-lg">
          This showcases all UI components used in the Cover Letter Generator project, including
          different variants and states.
        </p>
      </div>

      <Stack spacing="2xl">
        {/* Buttons Section */}
        <section>
          <h2 className="text-on-surface mb-6 text-2xl font-bold">Button Components</h2>
          <Grid cols={1} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different styles of button components</CardDescription>
              </CardHeader>
              <CardContent>
                <Flex wrap gap="md">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Button</Button>
                  <Button variant="link">Link Button</Button>
                </Flex>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Button Sizes</CardTitle>
                <CardDescription>Different sizes of buttons</CardDescription>
              </CardHeader>
              <CardContent>
                <Flex align="center" gap="md">
                  <Button size="sm">Small Button</Button>
                  <Button size="md">Medium Button</Button>
                  <Button size="lg">Large Button</Button>
                  <Button size="xl">Extra Large Button</Button>
                </Flex>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Button States</CardTitle>
                <CardDescription>Different states of buttons</CardDescription>
              </CardHeader>
              <CardContent>
                <Flex wrap gap="md">
                  <Button>Normal State</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled State</Button>
                  <Button fullWidth>Full Width Button</Button>
                </Flex>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-on-surface mb-6 text-2xl font-bold">Card Components</h2>
          <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
            <Card variant="default">
              <CardHeader>
                <CardTitle>默认卡片</CardTitle>
                <CardDescription>标准的卡片样式</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  这是一个默认样式的卡片组件，适用于大多数场景。
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>悬浮卡片</CardTitle>
                <CardDescription>带有阴影效果的卡片</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  这是一个悬浮样式的卡片，具有更明显的阴影效果。
                </p>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>轮廓卡片</CardTitle>
                <CardDescription>带有边框的卡片</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  这是一个轮廓样式的卡片，使用边框而不是阴影。
                </p>
              </CardContent>
            </Card>

            <Card variant="filled">
              <CardHeader>
                <CardTitle>填充卡片</CardTitle>
                <CardDescription>带有背景色的卡片</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  这是一个填充样式的卡片，具有不同的背景色。
                </p>
              </CardContent>
            </Card>

            <Card interactive>
              <CardHeader>
                <CardTitle>交互卡片</CardTitle>
                <CardDescription>可点击的卡片</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant">
                  这是一个交互式卡片，鼠标悬停时会有缩放效果。
                </p>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* Form Components Section */}
        <section>
          <h2 className="text-on-surface mb-6 text-2xl font-bold">表单组件</h2>
          <Grid cols={1} responsive={{ lg: 2 }} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle>Input Components</CardTitle>
                <CardDescription>Various styles of input fields</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack spacing="md">
                  <Input label="Default Input" placeholder="Enter content..." />
                  <Input
                    label="Input with Icon"
                    placeholder="Search..."
                    leftIcon={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    }
                  />
                  <Input
                    label="Error State"
                    placeholder="Enter content..."
                    error="This is an error message"
                  />
                  <Input
                    label="With Helper Text"
                    placeholder="Enter content..."
                    helperText="This is helper text to explain input requirements"
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Textarea Components</CardTitle>
                <CardDescription>Multi-line text input</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack spacing="md">
                  <Textarea label="Default Textarea" placeholder="Enter multi-line content..." />
                  <Textarea
                    label="With Character Count"
                    placeholder="Enter content..."
                    maxLength={200}
                    showCount
                  />
                  <Textarea
                    label="Error State"
                    placeholder="Enter content..."
                    error="Content cannot be empty"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </section>

        {/* Layout Components Section */}
        <section>
          <h2 className="text-on-surface mb-6 text-2xl font-bold">Layout Components</h2>
          <Stack spacing="lg">
            <Card>
              <CardHeader>
                <CardTitle>Grid Layout</CardTitle>
                <CardDescription>Responsive grid system</CardDescription>
              </CardHeader>
              <CardContent>
                <Grid cols={1} responsive={{ sm: 2, md: 3, lg: 4 }} gap="md">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-primary-100 text-primary-700 flex h-20 items-center justify-center rounded-lg font-medium"
                    >
                      项目 {i + 1}
                    </div>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>弹性布局</CardTitle>
                <CardDescription>Flexbox布局工具</CardDescription>
              </CardHeader>
              <CardContent>
                <Stack spacing="md">
                  <div>
                    <h4 className="mb-2 font-medium">水平排列</h4>
                    <Flex gap="md">
                      <div className="bg-secondary-100 text-secondary-700 flex h-12 w-20 items-center justify-center rounded text-sm">
                        项目1
                      </div>
                      <div className="bg-secondary-100 text-secondary-700 flex h-12 w-20 items-center justify-center rounded text-sm">
                        项目2
                      </div>
                      <div className="bg-secondary-100 text-secondary-700 flex h-12 w-20 items-center justify-center rounded text-sm">
                        项目3
                      </div>
                    </Flex>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">居中对齐</h4>
                    <Flex
                      justify="center"
                      align="center"
                      className="bg-surface-container h-20 rounded"
                    >
                      <div className="bg-success-100 text-success-700 rounded px-4 py-2">
                        居中内容
                      </div>
                    </Flex>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </section>

        {/* Color Palette Section */}
        <section>
          <h2 className="text-on-surface mb-6 text-2xl font-bold">色彩系统</h2>
          <Grid cols={1} responsive={{ md: 2, lg: 3 }} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle>主色调</CardTitle>
                <CardDescription>Primary Colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div key={shade} className="text-center">
                      <div
                        className={`mb-1 h-12 w-full rounded`}
                        style={{ backgroundColor: `var(--color-primary-${shade})` }}
                      />
                      <span className="text-on-surface-variant text-xs">{shade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>次要色调</CardTitle>
                <CardDescription>Secondary Colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div key={shade} className="text-center">
                      <div
                        className={`mb-1 h-12 w-full rounded`}
                        style={{ backgroundColor: `var(--color-secondary-${shade})` }}
                      />
                      <span className="text-on-surface-variant text-xs">{shade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>中性色调</CardTitle>
                <CardDescription>Neutral Colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div key={shade} className="text-center">
                      <div
                        className={`border-outline-variant mb-1 h-12 w-full rounded border`}
                        style={{ backgroundColor: `var(--color-neutral-${shade})` }}
                      />
                      <span className="text-on-surface-variant text-xs">{shade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </section>
      </Stack>
    </Container>
  );
}
