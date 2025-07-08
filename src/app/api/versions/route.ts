// API version information endpoint
import { NextRequest, NextResponse } from 'next/server';
import { 
  getSupportedVersions, 
  getVersionInfo, 
  getVersionChangelog,
  apiVersioningService 
} from '@/lib/api-versioning';
import { basicApiMiddleware } from '@/lib/middleware';

// GET handler - get API version information
async function getVersionInformation(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const specificVersion = url.searchParams.get('version');
    const includeChangelog = url.searchParams.get('changelog') === 'true';

    if (specificVersion) {
      // Return information for specific version
      const versionInfo = getVersionInfo(specificVersion);
      
      if (!versionInfo) {
        return NextResponse.json(
          {
            error: {
              message: `Version ${specificVersion} not found`,
              code: 'VERSION_NOT_FOUND',
            },
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }

      const response: any = {
        version: versionInfo.version,
        status: versionInfo.status,
        releaseDate: versionInfo.releaseDate.toISOString(),
        deprecationDate: versionInfo.deprecationDate?.toISOString(),
        sunsetDate: versionInfo.sunsetDate?.toISOString(),
      };

      if (includeChangelog) {
        const changelog = getVersionChangelog(specificVersion);
        if (changelog) {
          response.changelog = changelog;
        }
      }

      return NextResponse.json(response);
    }

    // Return information for all versions
    const supportedVersions = getSupportedVersions();
    const versions = supportedVersions.map(version => {
      const info = getVersionInfo(version);
      const result: any = {
        version: info?.version,
        status: info?.status,
        releaseDate: info?.releaseDate.toISOString(),
        deprecationDate: info?.deprecationDate?.toISOString(),
        sunsetDate: info?.sunsetDate?.toISOString(),
      };

      if (includeChangelog) {
        const changelog = getVersionChangelog(version);
        if (changelog) {
          result.changelog = changelog;
        }
      }

      return result;
    });

    const currentVersion = supportedVersions[supportedVersions.length - 1];

    return NextResponse.json({
      currentVersion,
      supportedVersions,
      versions,
      versioningInfo: {
        versionHeader: 'API-Version',
        acceptHeader: 'application/vnd.coverletter.v{version}+json',
        queryParameter: 'version',
        defaultBehavior: 'Uses current version when no version specified',
      },
      deprecationPolicy: {
        warningPeriod: '6 months before sunset',
        supportPeriod: '12 months after deprecation',
        notificationMethods: ['API headers', 'Documentation', 'Email notifications'],
      },
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: 'Failed to retrieve version information',
          code: 'VERSION_INFO_ERROR',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST handler - version compatibility check
async function checkVersionCompatibility(req: NextRequest) {
  try {
    const { fromVersion, toVersion, data } = await req.json();

    if (!fromVersion || !toVersion) {
      return NextResponse.json(
        {
          error: {
            message: 'Both fromVersion and toVersion are required',
            code: 'MISSING_VERSIONS',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const supportedVersions = getSupportedVersions();
    
    if (!supportedVersions.includes(fromVersion) || !supportedVersions.includes(toVersion)) {
      return NextResponse.json(
        {
          error: {
            message: 'One or both versions are not supported',
            code: 'UNSUPPORTED_VERSIONS',
            details: {
              fromVersion,
              toVersion,
              supportedVersions,
            },
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Perform transformation if data is provided
    let transformedData = null;
    let transformationWarnings: string[] = [];

    if (data) {
      try {
        transformedData = await apiVersioningService.transformResponse(data, fromVersion, toVersion);
        
        // Check for potential issues in transformation
        const fromInfo = getVersionInfo(fromVersion);
        const toInfo = getVersionInfo(toVersion);
        
        if (fromInfo && toInfo) {
          // Add warnings for breaking changes
          if (toInfo.breakingChanges.length > 0) {
            transformationWarnings.push(
              `Target version ${toVersion} contains breaking changes: ${toInfo.breakingChanges.join(', ')}`
            );
          }
        }
      } catch (transformError) {
        return NextResponse.json(
          {
            error: {
              message: 'Data transformation failed',
              code: 'TRANSFORMATION_ERROR',
              details: {
                fromVersion,
                toVersion,
                error: transformError instanceof Error ? transformError.message : 'Unknown error',
              },
            },
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
      }
    }

    const response: any = {
      compatible: true,
      fromVersion,
      toVersion,
      warnings: transformationWarnings,
    };

    if (transformedData !== null) {
      response.transformedData = transformedData;
    }

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: 'Version compatibility check failed',
          code: 'COMPATIBILITY_CHECK_ERROR',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Create middleware for this endpoint
const middleware = basicApiMiddleware();

export async function GET(req: NextRequest) {
  return middleware.handle(req, async () => getVersionInformation(req));
}

export async function POST(req: NextRequest) {
  return middleware.handle(req, async () => checkVersionCompatibility(req));
}
