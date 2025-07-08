// API versioning system with backward compatibility and deprecation management
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logging';
import { multiLevelCache, cacheKeys } from './cache';

// API version configuration
export interface ApiVersion {
  version: string;
  releaseDate: Date;
  deprecationDate?: Date;
  sunsetDate?: Date;
  status: 'current' | 'supported' | 'deprecated' | 'sunset';
  changes: string[];
  breakingChanges: string[];
}

// Version compatibility mapping
export interface VersionCompatibility {
  fromVersion: string;
  toVersion: string;
  transformations: VersionTransformation[];
  warnings: string[];
}

// Data transformation for version compatibility
export interface VersionTransformation {
  type: 'field_rename' | 'field_remove' | 'field_add' | 'field_transform' | 'structure_change';
  path: string;
  oldPath?: string;
  newPath?: string;
  transformer?: (value: any) => any;
  defaultValue?: any;
  description: string;
}

// Deprecation notice
export interface DeprecationNotice {
  version: string;
  feature: string;
  deprecationDate: Date;
  sunsetDate: Date;
  replacement?: string;
  migrationGuide?: string;
  severity: 'info' | 'warning' | 'critical';
}

// API version registry
const API_VERSIONS: ApiVersion[] = [
  {
    version: 'v1.0.0',
    releaseDate: new Date('2024-01-01'),
    deprecationDate: new Date('2024-12-01'),
    sunsetDate: new Date('2025-06-01'),
    status: 'deprecated',
    changes: [
      'Initial API release',
      'Basic cover letter generation',
      'User authentication',
    ],
    breakingChanges: [],
  },
  {
    version: 'v1.1.0',
    releaseDate: new Date('2024-06-01'),
    status: 'supported',
    changes: [
      'Added MFA support',
      'Enhanced error handling',
      'Improved rate limiting',
      'Added audit logging',
    ],
    breakingChanges: [
      'Changed error response format',
      'Updated authentication headers',
    ],
  },
  {
    version: 'v1.2.0',
    releaseDate: new Date('2024-12-01'),
    status: 'current',
    changes: [
      'Added data encryption',
      'Enhanced monitoring',
      'Improved caching',
      'Added API versioning',
    ],
    breakingChanges: [
      'Updated user profile structure',
      'Changed cover letter response format',
    ],
  },
];

// Version compatibility mappings
const VERSION_COMPATIBILITY: VersionCompatibility[] = [
  {
    fromVersion: 'v1.0.0',
    toVersion: 'v1.1.0',
    transformations: [
      {
        type: 'structure_change',
        path: 'error',
        description: 'Updated error response format to include error codes',
        transformer: (error: any) => {
          if (typeof error === 'string') {
            return { message: error, code: 'UNKNOWN_ERROR' };
          }
          return error;
        },
      },
    ],
    warnings: [
      'Error response format has changed',
      'Authentication headers updated',
    ],
  },
  {
    fromVersion: 'v1.1.0',
    toVersion: 'v1.2.0',
    transformations: [
      {
        type: 'field_add',
        path: 'user.mfa_enabled',
        defaultValue: false,
        description: 'Added MFA status to user profile',
      },
      {
        type: 'field_rename',
        path: 'cover_letter.type',
        oldPath: 'cover_letter.style',
        newPath: 'cover_letter.type',
        description: 'Renamed style field to type',
      },
    ],
    warnings: [
      'User profile structure updated',
      'Cover letter response format changed',
    ],
  },
];

class ApiVersioningService {
  private currentVersion: string;
  private supportedVersions: Set<string>;

  constructor() {
    this.currentVersion = this.getCurrentVersion();
    this.supportedVersions = new Set(
      API_VERSIONS
        .filter(v => v.status !== 'sunset')
        .map(v => v.version)
    );

    logger.info('API versioning service initialized', {
      currentVersion: this.currentVersion,
      supportedVersions: Array.from(this.supportedVersions),
    });
  }

  private getCurrentVersion(): string {
    const currentVersions = API_VERSIONS.filter(v => v.status === 'current');
    return currentVersions[0]?.version || 'v1.0.0';
  }

  // Extract version from request
  extractVersion(req: NextRequest): string {
    // Check Accept header first (preferred)
    const acceptHeader = req.headers.get('accept');
    if (acceptHeader) {
      const versionMatch = acceptHeader.match(/application\/vnd\.coverletter\.v(\d+\.\d+\.\d+)\+json/);
      if (versionMatch) {
        return `v${versionMatch[1]}`;
      }
    }

    // Check custom header
    const versionHeader = req.headers.get('api-version') || req.headers.get('x-api-version');
    if (versionHeader) {
      return versionHeader.startsWith('v') ? versionHeader : `v${versionHeader}`;
    }

    // Check query parameter
    const url = new URL(req.url);
    const versionParam = url.searchParams.get('version') || url.searchParams.get('api_version');
    if (versionParam) {
      return versionParam.startsWith('v') ? versionParam : `v${versionParam}`;
    }

    // Default to current version
    return this.currentVersion;
  }

  // Validate version
  isVersionSupported(version: string): boolean {
    return this.supportedVersions.has(version);
  }

  // Get version info
  getVersionInfo(version: string): ApiVersion | null {
    return API_VERSIONS.find(v => v.version === version) || null;
  }

  // Get deprecation notices for version
  getDeprecationNotices(version: string): DeprecationNotice[] {
    const versionInfo = this.getVersionInfo(version);
    if (!versionInfo) return [];

    const notices: DeprecationNotice[] = [];

    if (versionInfo.status === 'deprecated' && versionInfo.deprecationDate && versionInfo.sunsetDate) {
      notices.push({
        version,
        feature: 'API Version',
        deprecationDate: versionInfo.deprecationDate,
        sunsetDate: versionInfo.sunsetDate,
        replacement: this.currentVersion,
        migrationGuide: `/docs/migration/${version}-to-${this.currentVersion}`,
        severity: 'critical',
      });
    }

    return notices;
  }

  // Transform response for version compatibility
  async transformResponse(
    data: any,
    fromVersion: string,
    toVersion: string = this.currentVersion
  ): Promise<any> {
    if (fromVersion === toVersion) {
      return data;
    }

    // Find transformation path
    const transformationPath = this.findTransformationPath(fromVersion, toVersion);
    if (!transformationPath.length) {
      logger.warn('No transformation path found', { fromVersion, toVersion });
      return data;
    }

    let transformedData = data;

    for (const compatibility of transformationPath) {
      transformedData = await this.applyTransformations(
        transformedData,
        compatibility.transformations
      );
    }

    return transformedData;
  }

  // Find transformation path between versions
  private findTransformationPath(fromVersion: string, toVersion: string): VersionCompatibility[] {
    // Simple implementation - assumes linear version progression
    const fromIndex = API_VERSIONS.findIndex(v => v.version === fromVersion);
    const toIndex = API_VERSIONS.findIndex(v => v.version === toVersion);

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
      return [];
    }

    const path: VersionCompatibility[] = [];
    for (let i = fromIndex; i < toIndex; i++) {
      const currentVersion = API_VERSIONS[i].version;
      const nextVersion = API_VERSIONS[i + 1].version;
      
      const compatibility = VERSION_COMPATIBILITY.find(
        c => c.fromVersion === currentVersion && c.toVersion === nextVersion
      );
      
      if (compatibility) {
        path.push(compatibility);
      }
    }

    return path;
  }

  // Apply transformations to data
  private async applyTransformations(data: any, transformations: VersionTransformation[]): Promise<any> {
    let result = JSON.parse(JSON.stringify(data)); // Deep clone

    for (const transformation of transformations) {
      try {
        result = this.applyTransformation(result, transformation);
      } catch (error) {
        logger.error('Transformation failed', {
          transformation: transformation.type,
          path: transformation.path,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  // Apply single transformation
  private applyTransformation(data: any, transformation: VersionTransformation): any {
    const { type, path, oldPath, newPath, transformer, defaultValue } = transformation;

    switch (type) {
      case 'field_rename':
        if (oldPath && newPath) {
          const value = this.getNestedValue(data, oldPath);
          if (value !== undefined) {
            this.setNestedValue(data, newPath, value);
            this.deleteNestedValue(data, oldPath);
          }
        }
        break;

      case 'field_remove':
        this.deleteNestedValue(data, path);
        break;

      case 'field_add':
        if (this.getNestedValue(data, path) === undefined) {
          this.setNestedValue(data, path, defaultValue);
        }
        break;

      case 'field_transform':
        if (transformer) {
          const value = this.getNestedValue(data, path);
          if (value !== undefined) {
            this.setNestedValue(data, path, transformer(value));
          }
        }
        break;

      case 'structure_change':
        if (transformer) {
          const value = this.getNestedValue(data, path);
          if (value !== undefined) {
            this.setNestedValue(data, path, transformer(value));
          }
        }
        break;
    }

    return data;
  }

  // Helper methods for nested object manipulation
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!(key in current)) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  private deleteNestedValue(obj: any, path: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => current?.[key], obj);
    if (target) delete target[lastKey];
  }

  // Create version-aware response
  async createVersionedResponse(
    data: any,
    requestedVersion: string,
    req: NextRequest
  ): Promise<NextResponse> {
    const versionInfo = this.getVersionInfo(requestedVersion);
    const deprecationNotices = this.getDeprecationNotices(requestedVersion);

    // Transform data for requested version
    const transformedData = await this.transformResponse(data, this.currentVersion, requestedVersion);

    // Create response headers
    const headers: Record<string, string> = {
      'API-Version': requestedVersion,
      'API-Current-Version': this.currentVersion,
      'API-Supported-Versions': Array.from(this.supportedVersions).join(', '),
    };

    // Add deprecation warnings
    if (deprecationNotices.length > 0) {
      headers['API-Deprecation-Warning'] = deprecationNotices
        .map(notice => `${notice.feature} deprecated on ${notice.deprecationDate.toISOString()}, sunset on ${notice.sunsetDate.toISOString()}`)
        .join('; ');
    }

    // Add sunset header if applicable
    if (versionInfo?.sunsetDate) {
      headers['Sunset'] = versionInfo.sunsetDate.toISOString();
    }

    const response = {
      data: transformedData,
      meta: {
        version: requestedVersion,
        current_version: this.currentVersion,
        deprecation_notices: deprecationNotices,
      },
    };

    return NextResponse.json(response, { headers });
  }

  // Get all supported versions
  getSupportedVersions(): string[] {
    return Array.from(this.supportedVersions);
  }

  // Get version changelog
  getVersionChangelog(version: string): { changes: string[]; breakingChanges: string[] } | null {
    const versionInfo = this.getVersionInfo(version);
    if (!versionInfo) return null;

    return {
      changes: versionInfo.changes,
      breakingChanges: versionInfo.breakingChanges,
    };
  }
}

// Create singleton instance
export const apiVersioningService = new ApiVersioningService();

// Convenience functions
export const extractVersion = (req: NextRequest) => apiVersioningService.extractVersion(req);
export const isVersionSupported = (version: string) => apiVersioningService.isVersionSupported(version);
export const getVersionInfo = (version: string) => apiVersioningService.getVersionInfo(version);
export const transformResponse = (data: any, fromVersion: string, toVersion?: string) => 
  apiVersioningService.transformResponse(data, fromVersion, toVersion);
export const createVersionedResponse = (data: any, requestedVersion: string, req: NextRequest) => 
  apiVersioningService.createVersionedResponse(data, requestedVersion, req);
export const getSupportedVersions = () => apiVersioningService.getSupportedVersions();
export const getVersionChangelog = (version: string) => apiVersioningService.getVersionChangelog(version);
