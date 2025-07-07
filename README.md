# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2497451d-388f-472c-a26f-7f9d7bac9845

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2497451d-388f-472c-a26f-7f9d7bac9845) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory and add any of the following variables:

```
VITE_API_URL=https://api.example.com/v1
VITE_APP_NAME=SwarCure
VITE_APP_VERSION=1.0.0
VITE_ENABLE_SOUND_COLLECTIONS=true
VITE_ENABLE_COMMUNITY_FEATURES=true
VITE_ANALYTICS_ID=UA-XXXXX-Y
```

For development, you can create a `.env.development` file that will override the values in `.env` when running in development mode.

### Using Environment Variables in Code

You can access these environment variables in your code using our helper functions:

```typescript
import { getEnv, getEnvBoolean } from '@/lib/env';

// Get a string value
const apiUrl = getEnv('API_URL', 'default-value');

// Get a boolean value
const enableFeature = getEnvBoolean('ENABLE_FEATURE', false);
```

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2497451d-388f-472c-a26f-7f9d7bac9845) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
# SwarCure---Healing-Through-Indian-Classical-Sound
