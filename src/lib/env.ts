// Environment variable utilities for accessing Vite environment variables

/**
 * Get an environment variable value
 * @param key The environment variable key (without VITE_ prefix)
 * @param defaultValue Default value if the environment variable is not set
 * @returns The environment variable value or default value
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  const fullKey = `VITE_${key}` as keyof ImportMetaEnv
  return (import.meta.env[fullKey] || defaultValue) as string
}

/**
 * Get a boolean environment variable value
 * @param key The environment variable key (without VITE_ prefix)
 * @param defaultValue Default value if the environment variable is not set
 * @returns The environment variable as boolean
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnv(key, defaultValue ? 'true' : 'false')
  return value.toLowerCase() === 'true'
}

// Example usage:
// const apiUrl = getEnv('API_URL', 'http://localhost:3000/api');
// const enableFeature = getEnvBoolean('ENABLE_FEATURE', false);
