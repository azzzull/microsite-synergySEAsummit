/**
 * Secure logging utility that prevents sensitive data exposure
 */

const SENSITIVE_FIELDS = [
  'password', 'token', 'secret', 'key', 'auth', 'authorization',
  'client_secret', 'client_id', 'signature', 'credentials', 'cookie',
  'x-api-key', 'bearer', 'database_url', 'postgres_url'
];

function sanitizeForLogging(data: any): any {
  if (!data) return data;
  
  if (typeof data === 'string') {
    // Check if string contains sensitive information
    const lowerData = data.toLowerCase();
    for (const field of SENSITIVE_FIELDS) {
      if (lowerData.includes(field)) {
        return '[SENSITIVE_DATA_REDACTED]';
      }
    }
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForLogging(item));
  }
  
  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_FIELDS.some(field => 
        lowerKey.includes(field) || lowerKey === field
      );
      
      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeForLogging(value);
      }
    }
    return sanitized;
  }
  
  return data;
}

function sanitizeError(error: any): any {
  if (!error) return error;
  
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message.replace(/postgresql:\/\/[^@]+@[^\/]+\/\w+/g, 'postgresql://[CREDENTIALS_REDACTED]/[DB_NAME]'),
      stack: process.env.NODE_ENV === 'development' ? error.stack : '[STACK_REDACTED]'
    };
  }
  
  return sanitizeForLogging(error);
}

export const secureLog = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data ? sanitizeForLogging(data) : '');
    }
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? sanitizeForLogging(data) : '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ? sanitizeError(error) : '');
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_LOGGING === 'true') {
      console.log(`[DEBUG] ${message}`, data ? sanitizeForLogging(data) : '');
    }
  },

  // Production-safe logging (only logs non-sensitive info)
  production: (level: 'info' | 'warn' | 'error', message: string, metadata?: any) => {
    const timestamp = new Date().toISOString();
    const sanitizedMetadata = metadata ? sanitizeForLogging(metadata) : {};
    
    console.log(JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      metadata: sanitizedMetadata,
      environment: process.env.NODE_ENV
    }));
  }
};

// Utility to check if we're in production
export const isProduction = () => process.env.NODE_ENV === 'production';

// Utility to safely log database operations
export const dbLog = {
  success: (operation: string, recordId?: string | number) => {
    secureLog.info(`Database ${operation} successful`, { recordId });
  },
  
  error: (operation: string, error: any) => {
    secureLog.error(`Database ${operation} failed`, error);
  }
};
