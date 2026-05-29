/**
 * Simple logger utility for structured test output.
 * Wraps console with step/info/error/warn levels.
 */
export const logger = {
    step: (message: string): void => {
        console.log(`\n  🔷 STEP: ${message}`);
    },

    info: (message: string): void => {
        console.log(`  ℹ️  INFO: ${message}`);
    },

    success: (message: string): void => {
        console.log(`  ✅ PASS: ${message}`);
    },

    warn: (message: string): void => {
        console.warn(`  ⚠️  WARN: ${message}`);
    },

    error: (message: string, error?: unknown): void => {
        console.error(`  ❌ ERROR: ${message}`);
        if (error instanceof Error) {
            console.error(`     Details: ${error.message}`);
        }
    },

    api: (method: string, url: string, status?: number): void => {
        const statusText = status ? ` → ${status}` : '';
        console.log(`  🌐 API: ${method.toUpperCase()} ${url}${statusText}`);
    },

    separator: (): void => {
        console.log('  ' + '─'.repeat(60));
    },
};