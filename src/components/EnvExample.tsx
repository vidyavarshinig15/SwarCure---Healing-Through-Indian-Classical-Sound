// Example of using environment variables in a component
import { getEnv, getEnvBoolean } from '@/lib/env';

// You can use this in any component where you need environment variables
export function EnvExample() {
  const apiUrl = getEnv('API_URL');
  const appName = getEnv('APP_NAME', 'Swar Wellness');
  const enableSoundCollections = getEnvBoolean('ENABLE_SOUND_COLLECTIONS', true);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="font-bold text-xl">Environment Example</h2>
      <ul className="mt-2 space-y-1">
        <li><strong>API URL:</strong> {apiUrl}</li>
        <li><strong>App Name:</strong> {appName}</li>
        <li>
          <strong>Sound Collections:</strong> 
          {enableSoundCollections ? 'Enabled' : 'Disabled'}
        </li>
      </ul>
    </div>
  );
}
