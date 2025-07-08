// Database optimization script - adds indexes and optimizations
import { sql, createPool, getPoolStats } from '@/lib/neon';
import { logger } from '@/lib/logging';

interface IndexInfo {
  name: string;
  table: string;
  columns: string[];
  type?: 'btree' | 'hash' | 'gin' | 'gist';
  unique?: boolean;
  partial?: string; // WHERE clause for partial index
  description: string;
}

// Define indexes for optimization
const PERFORMANCE_INDEXES: IndexInfo[] = [
  // User table indexes
  {
    name: 'idx_users_email_unique',
    table: 'users',
    columns: ['email'],
    type: 'btree',
    unique: true,
    description: 'Unique index on email for fast user lookups and authentication'
  },
  {
    name: 'idx_users_tier_subscription',
    table: 'users',
    columns: ['tier', 'subscription_expires_at'],
    type: 'btree',
    description: 'Composite index for tier-based queries and subscription validation'
  },
  {
    name: 'idx_users_monthly_usage_reset',
    table: 'users',
    columns: ['monthly_usage_reset_at'],
    type: 'btree',
    description: 'Index for monthly usage reset queries'
  },
  {
    name: 'idx_users_created_at',
    table: 'users',
    columns: ['created_at'],
    type: 'btree',
    description: 'Index for user registration analytics and sorting'
  },

  // Cover letters table indexes
  {
    name: 'idx_cover_letters_user_created',
    table: 'cover_letters',
    columns: ['user_id', 'created_at'],
    type: 'btree',
    description: 'Composite index for user cover letters ordered by creation date'
  },
  {
    name: 'idx_cover_letters_user_updated',
    table: 'cover_letters',
    columns: ['user_id', 'updated_at'],
    type: 'btree',
    description: 'Composite index for user cover letters ordered by update date'
  },
  {
    name: 'idx_cover_letters_type',
    table: 'cover_letters',
    columns: ['cover_letter_type'],
    type: 'btree',
    description: 'Index for filtering by cover letter type'
  },
  {
    name: 'idx_cover_letters_model',
    table: 'cover_letters',
    columns: ['model_used'],
    type: 'btree',
    description: 'Index for analytics on AI model usage'
  },
  {
    name: 'idx_cover_letters_generation_time',
    table: 'cover_letters',
    columns: ['generation_time'],
    type: 'btree',
    description: 'Index for performance analytics on generation times'
  },
  {
    name: 'idx_cover_letters_title_search',
    table: 'cover_letters',
    columns: ['title'],
    type: 'gin',
    description: 'GIN index for full-text search on cover letter titles'
  },

  // User sessions table indexes
  {
    name: 'idx_user_sessions_token',
    table: 'user_sessions',
    columns: ['session_token'],
    type: 'btree',
    unique: true,
    description: 'Unique index on session token for fast session lookups'
  },
  {
    name: 'idx_user_sessions_user_expires',
    table: 'user_sessions',
    columns: ['user_id', 'expires_at'],
    type: 'btree',
    description: 'Composite index for user session validation'
  },
  {
    name: 'idx_user_sessions_expires_active',
    table: 'user_sessions',
    columns: ['expires_at'],
    type: 'btree',
    partial: 'expires_at > NOW()',
    description: 'Partial index for active sessions cleanup'
  },
];

// Database optimization queries
const OPTIMIZATION_QUERIES = [
  {
    name: 'Update table statistics',
    query: 'ANALYZE;',
    description: 'Update table statistics for better query planning'
  },
  {
    name: 'Vacuum tables',
    query: 'VACUUM;',
    description: 'Reclaim storage and update statistics'
  }
];

class DatabaseOptimizer {
  private pool = createPool();

  async checkIndexExists(indexName: string): Promise<boolean> {
    try {
      const result = await sql`
        SELECT 1 FROM pg_indexes 
        WHERE indexname = ${indexName}
        LIMIT 1
      `;
      return result.length > 0;
    } catch (error) {
      logger.error('Failed to check index existence', { indexName, error });
      return false;
    }
  }

  async createIndex(indexInfo: IndexInfo): Promise<boolean> {
    try {
      const exists = await this.checkIndexExists(indexInfo.name);
      if (exists) {
        logger.info('Index already exists, skipping', { indexName: indexInfo.name });
        return true;
      }

      let query = `CREATE ${indexInfo.unique ? 'UNIQUE ' : ''}INDEX ${indexInfo.name} 
                   ON ${indexInfo.table} 
                   USING ${indexInfo.type || 'btree'} 
                   (${indexInfo.columns.join(', ')})`;

      if (indexInfo.partial) {
        query += ` WHERE ${indexInfo.partial}`;
      }

      await sql.unsafe(query);
      
      logger.info('Index created successfully', {
        indexName: indexInfo.name,
        table: indexInfo.table,
        columns: indexInfo.columns,
        description: indexInfo.description
      });

      return true;
    } catch (error) {
      logger.error('Failed to create index', {
        indexName: indexInfo.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async runOptimizationQuery(query: { name: string; query: string; description: string }): Promise<boolean> {
    try {
      await sql.unsafe(query.query);
      logger.info('Optimization query completed', {
        name: query.name,
        description: query.description
      });
      return true;
    } catch (error) {
      logger.error('Optimization query failed', {
        name: query.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async getTableStats(): Promise<any> {
    try {
      const stats = await sql`
        SELECT 
          schemaname,
          tablename,
          attname as column_name,
          n_distinct,
          correlation,
          most_common_vals,
          most_common_freqs
        FROM pg_stats 
        WHERE schemaname = 'public'
        ORDER BY tablename, attname
      `;
      return stats;
    } catch (error) {
      logger.error('Failed to get table statistics', { error });
      return [];
    }
  }

  async getIndexUsageStats(): Promise<any> {
    try {
      const stats = await sql`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_tup_read,
          idx_tup_fetch,
          idx_scan
        FROM pg_stat_user_indexes
        WHERE schemaname = 'public'
        ORDER BY idx_scan DESC
      `;
      return stats;
    } catch (error) {
      logger.error('Failed to get index usage statistics', { error });
      return [];
    }
  }

  async optimizeDatabase(): Promise<{
    success: boolean;
    indexesCreated: number;
    optimizationsRun: number;
    errors: string[];
  }> {
    const startTime = Date.now();
    const errors: string[] = [];
    let indexesCreated = 0;
    let optimizationsRun = 0;

    logger.info('Starting database optimization', {
      totalIndexes: PERFORMANCE_INDEXES.length,
      totalOptimizations: OPTIMIZATION_QUERIES.length
    });

    // Create performance indexes
    for (const indexInfo of PERFORMANCE_INDEXES) {
      const success = await this.createIndex(indexInfo);
      if (success) {
        indexesCreated++;
      } else {
        errors.push(`Failed to create index: ${indexInfo.name}`);
      }
    }

    // Run optimization queries
    for (const query of OPTIMIZATION_QUERIES) {
      const success = await this.runOptimizationQuery(query);
      if (success) {
        optimizationsRun++;
      } else {
        errors.push(`Failed to run optimization: ${query.name}`);
      }
    }

    const duration = Date.now() - startTime;
    const success = errors.length === 0;

    logger.info('Database optimization completed', {
      success,
      duration,
      indexesCreated,
      optimizationsRun,
      errors: errors.length,
      poolStats: getPoolStats()
    });

    return {
      success,
      indexesCreated,
      optimizationsRun,
      errors
    };
  }

  async generateOptimizationReport(): Promise<{
    tableStats: any[];
    indexUsage: any[];
    poolStats: any;
    recommendations: string[];
  }> {
    const tableStats = await this.getTableStats();
    const indexUsage = await this.getIndexUsageStats();
    const poolStats = getPoolStats();
    
    const recommendations: string[] = [];

    // Analyze index usage and provide recommendations
    const unusedIndexes = indexUsage.filter((idx: any) => idx.idx_scan === 0);
    if (unusedIndexes.length > 0) {
      recommendations.push(`Consider dropping unused indexes: ${unusedIndexes.map((idx: any) => idx.indexname).join(', ')}`);
    }

    // Check for tables without proper indexes
    const tablesWithoutIndexes = tableStats
      .reduce((acc: any[], stat: any) => {
        if (!acc.find(t => t.tablename === stat.tablename)) {
          acc.push({ tablename: stat.tablename });
        }
        return acc;
      }, [])
      .filter((table: any) => !indexUsage.find((idx: any) => idx.tablename === table.tablename));

    if (tablesWithoutIndexes.length > 0) {
      recommendations.push(`Tables without indexes: ${tablesWithoutIndexes.map((t: any) => t.tablename).join(', ')}`);
    }

    return {
      tableStats,
      indexUsage,
      poolStats,
      recommendations
    };
  }
}

// Main execution function
export async function optimizeDatabase() {
  const optimizer = new DatabaseOptimizer();
  return await optimizer.optimizeDatabase();
}

export async function generateDatabaseReport() {
  const optimizer = new DatabaseOptimizer();
  return await optimizer.generateOptimizationReport();
}

// CLI execution
if (require.main === module) {
  optimizeDatabase()
    .then((result) => {
      console.log('Database optimization result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Database optimization failed:', error);
      process.exit(1);
    });
}
