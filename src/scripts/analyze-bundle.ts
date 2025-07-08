// Bundle analysis script for performance optimization
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { logger } from '@/lib/logging';

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
  recommendations: string[];
}

interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
  type: 'entry' | 'vendor' | 'async' | 'runtime';
}

interface DependencyInfo {
  name: string;
  size: number;
  version: string;
  usage: 'direct' | 'transitive';
  treeshakeable: boolean;
}

class BundleAnalyzer {
  private buildDir = '.next';
  private outputDir = 'bundle-analysis';

  async analyzeBundles(): Promise<BundleAnalysis> {
    logger.info('Starting bundle analysis...');

    // Ensure build exists
    if (!fs.existsSync(this.buildDir)) {
      logger.error('Build directory not found. Run "npm run build" first.');
      throw new Error('Build directory not found');
    }

    // Create output directory
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const chunks = await this.analyzeChunks();
    const dependencies = await this.analyzeDependencies();
    const { totalSize, gzippedSize } = this.calculateTotalSize(chunks);
    const recommendations = this.generateRecommendations(chunks, dependencies);

    const analysis: BundleAnalysis = {
      totalSize,
      gzippedSize,
      chunks,
      dependencies,
      recommendations,
    };

    // Save analysis to file
    const analysisPath = path.join(this.outputDir, 'bundle-analysis.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));

    // Generate HTML report
    await this.generateHtmlReport(analysis);

    logger.info('Bundle analysis completed', {
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      gzippedSize: `${(gzippedSize / 1024).toFixed(2)} KB`,
      chunksCount: chunks.length,
      dependenciesCount: dependencies.length,
    });

    return analysis;
  }

  private async analyzeChunks(): Promise<ChunkInfo[]> {
    const chunks: ChunkInfo[] = [];
    const staticDir = path.join(this.buildDir, 'static');

    if (!fs.existsSync(staticDir)) {
      return chunks;
    }

    // Analyze JavaScript chunks
    const jsDir = path.join(staticDir, 'chunks');
    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));

      for (const file of jsFiles) {
        const filePath = path.join(jsDir, file);
        const stats = fs.statSync(filePath);
        const gzippedSize = await this.getGzippedSize(filePath);

        chunks.push({
          name: file,
          size: stats.size,
          gzippedSize,
          modules: await this.extractModules(filePath),
          type: this.determineChunkType(file),
        });
      }
    }

    // Analyze CSS chunks
    const cssDir = path.join(staticDir, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));

      for (const file of cssFiles) {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        const gzippedSize = await this.getGzippedSize(filePath);

        chunks.push({
          name: file,
          size: stats.size,
          gzippedSize,
          modules: [],
          type: 'entry',
        });
      }
    }

    return chunks.sort((a, b) => b.size - a.size);
  }

  private async analyzeDependencies(): Promise<DependencyInfo[]> {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const dependencies: DependencyInfo[] = [];
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const [name, version] of Object.entries(allDeps)) {
      try {
        const depPath = path.join('node_modules', name);
        const depPackageJson = JSON.parse(
          fs.readFileSync(path.join(depPath, 'package.json'), 'utf-8')
        );

        const size = await this.calculatePackageSize(depPath);
        const treeshakeable = this.isTreeshakeable(depPackageJson);

        dependencies.push({
          name,
          size,
          version: version as string,
          usage: packageJson.dependencies[name] ? 'direct' : 'transitive',
          treeshakeable,
        });
      } catch (error) {
        logger.warn(`Failed to analyze dependency: ${name}`, { error: error as Error });
      }
    }

    return dependencies.sort((a, b) => b.size - a.size);
  }

  private async getGzippedSize(filePath: string): Promise<number> {
    try {
      const result = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' });
      return parseInt(result.trim());
    } catch (error) {
      logger.warn(`Failed to calculate gzipped size for ${filePath}`, { error: error as Error });
      return 0;
    }
  }

  private async extractModules(filePath: string): Promise<string[]> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const moduleRegex = /\/\*\s*webpack\/runtime\/([^*]+)\s*\*\//g;
      const modules: string[] = [];
      let match;

      while ((match = moduleRegex.exec(content)) !== null) {
        modules.push(match[1]);
      }

      return modules;
    } catch (error) {
      return [];
    }
  }

  private determineChunkType(filename: string): ChunkInfo['type'] {
    if (filename.includes('runtime')) return 'runtime';
    if (filename.includes('vendor') || filename.includes('node_modules')) return 'vendor';
    if (filename.includes('async') || filename.includes('lazy')) return 'async';
    return 'entry';
  }

  private async calculatePackageSize(packagePath: string): Promise<number> {
    try {
      const result = execSync(`du -sb "${packagePath}"`, { encoding: 'utf-8' });
      return parseInt(result.split('\t')[0]);
    } catch (error) {
      return 0;
    }
  }

  private isTreeshakeable(packageJson: any): boolean {
    return (
      packageJson.sideEffects === false ||
      Array.isArray(packageJson.sideEffects) ||
      packageJson.module !== undefined
    );
  }

  private calculateTotalSize(chunks: ChunkInfo[]): { totalSize: number; gzippedSize: number } {
    return chunks.reduce(
      (acc, chunk) => ({
        totalSize: acc.totalSize + chunk.size,
        gzippedSize: acc.gzippedSize + chunk.gzippedSize,
      }),
      { totalSize: 0, gzippedSize: 0 }
    );
  }

  private generateRecommendations(chunks: ChunkInfo[], dependencies: DependencyInfo[]): string[] {
    const recommendations: string[] = [];

    // Large chunk recommendations
    const largeChunks = chunks.filter(chunk => chunk.size > 250 * 1024); // > 250KB
    if (largeChunks.length > 0) {
      recommendations.push(
        `Consider splitting large chunks: ${largeChunks.map(c => c.name).join(', ')}`
      );
    }

    // Large dependency recommendations
    const largeDeps = dependencies.filter(dep => dep.size > 100 * 1024); // > 100KB
    if (largeDeps.length > 0) {
      recommendations.push(
        `Consider alternatives for large dependencies: ${largeDeps.map(d => d.name).join(', ')}`
      );
    }

    // Non-treeshakeable dependencies
    const nonTreeshakeable = dependencies.filter(dep => !dep.treeshakeable && dep.size > 50 * 1024);
    if (nonTreeshakeable.length > 0) {
      recommendations.push(
        `Non-tree-shakeable dependencies detected: ${nonTreeshakeable.map(d => d.name).join(', ')}`
      );
    }

    // Bundle size recommendations
    const totalSize = chunks.reduce((acc, chunk) => acc + chunk.size, 0);
    if (totalSize > 1024 * 1024) {
      // > 1MB
      recommendations.push(
        'Total bundle size exceeds 1MB. Consider code splitting and lazy loading.'
      );
    }

    return recommendations;
  }

  private async generateHtmlReport(analysis: BundleAnalysis): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .chart { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .recommendation { background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .size { font-family: monospace; }
    </style>
</head>
<body>
    <h1>Bundle Analysis Report</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Size:</strong> <span class="size">${(analysis.totalSize / 1024).toFixed(2)} KB</span></p>
        <p><strong>Gzipped Size:</strong> <span class="size">${(analysis.gzippedSize / 1024).toFixed(2)} KB</span></p>
        <p><strong>Chunks:</strong> ${analysis.chunks.length}</p>
        <p><strong>Dependencies:</strong> ${analysis.dependencies.length}</p>
    </div>

    <h2>Chunks</h2>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Gzipped</th>
                <th>Compression Ratio</th>
            </tr>
        </thead>
        <tbody>
            ${analysis.chunks
              .map(
                chunk => `
                <tr>
                    <td>${chunk.name}</td>
                    <td>${chunk.type}</td>
                    <td class="size">${(chunk.size / 1024).toFixed(2)} KB</td>
                    <td class="size">${(chunk.gzippedSize / 1024).toFixed(2)} KB</td>
                    <td>${((1 - chunk.gzippedSize / chunk.size) * 100).toFixed(1)}%</td>
                </tr>
            `
              )
              .join('')}
        </tbody>
    </table>

    <h2>Dependencies</h2>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Version</th>
                <th>Size</th>
                <th>Usage</th>
                <th>Tree-shakeable</th>
            </tr>
        </thead>
        <tbody>
            ${analysis.dependencies
              .slice(0, 20)
              .map(
                dep => `
                <tr>
                    <td>${dep.name}</td>
                    <td>${dep.version}</td>
                    <td class="size">${(dep.size / 1024).toFixed(2)} KB</td>
                    <td>${dep.usage}</td>
                    <td>${dep.treeshakeable ? '✅' : '❌'}</td>
                </tr>
            `
              )
              .join('')}
        </tbody>
    </table>

    <h2>Recommendations</h2>
    ${analysis.recommendations
      .map(
        rec => `
        <div class="recommendation">${rec}</div>
    `
      )
      .join('')}

    <p><em>Generated on ${new Date().toISOString()}</em></p>
</body>
</html>
    `;

    const htmlPath = path.join(this.outputDir, 'bundle-report.html');
    fs.writeFileSync(htmlPath, htmlContent);
    logger.info(`HTML report generated: ${htmlPath}`);
  }
}

// CLI execution
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer
    .analyzeBundles()
    .then(analysis => {
      console.log('\n📊 Bundle Analysis Complete!');
      console.log(`📦 Total Size: ${(analysis.totalSize / 1024).toFixed(2)} KB`);
      console.log(`🗜️  Gzipped: ${(analysis.gzippedSize / 1024).toFixed(2)} KB`);
      console.log(`📄 Report: bundle-analysis/bundle-report.html`);

      if (analysis.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        analysis.recommendations.forEach(rec => console.log(`  • ${rec}`));
      }
    })
    .catch(error => {
      console.error('Bundle analysis failed:', error);
      process.exit(1);
    });
}

export { BundleAnalyzer };
