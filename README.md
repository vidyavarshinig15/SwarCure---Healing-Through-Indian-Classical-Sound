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
# 🎵 SwarCure - Healing Through Indian Classical Sound

> **AI-powered Indian classical music therapy for mental wellness. Experience healing through traditional ragas and sound therapy.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](http://localhost:8080)
[![React](https://img.shields.io/badge/React-18+-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4+-purple)](https://vitejs.dev/)

## ✨ Features

- 🎭 **Smart Mood Analysis** - AI detects emotional state for personalized therapy
- 🎼 **Raga Recommendations** - Specific Indian classical ragas for different therapeutic needs
- 🧘‍♀️ **Guided Meditation** - Classical music-enhanced mindfulness sessions
- 👨‍⚕️ **Expert Consultations** - Connect with certified music therapists
- 📊 **Progress Tracking** - Monitor your wellness journey over time
- 🌍 **Cultural Education** - Learn about Indian classical music traditions
- 📱 **Responsive Design** - Seamless experience across all devices

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/vidyavarshinig15/SwarCure---Healing-Through-Indian-Classical-Sound.git

# Navigate to project directory
cd SwarCure---Healing-Through-Indian-Classical-Sound

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080 in your browser
```

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Modern CSS3 with responsive design
- **Audio**: Web Audio API for high-quality sound
- **Fonts**: Google Fonts with Devanagari support
- **Deployment**: Optimized production builds

## 🎯 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and APIs
└── assets/        # Static assets and media
```

## 🌟 Why SwarCure?

- **Ancient Wisdom + Modern Tech**: 5000+ year old healing tradition powered by AI
- **Scientifically Backed**: Indian ragas have documented therapeutic effects
- **Globally Accessible**: Making traditional healing available worldwide
- **Cultural Preservation**: Respectfully digitizing Indian musical heritage
- **Mental Health Focus**: Addressing the global mental wellness crisis

## 🎵 Therapeutic Ragas

| Raga | Therapeutic Benefit | Best Time |
|------|-------------------|-----------|
| Yaman | Reduces anxiety, promotes peace | Evening |
| Bhairav | Alleviates depression, energizes | Morning |
| Malkauns | Deep meditation, spiritual healing | Night |
| Bilawal | Mental clarity, focus | Anytime |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional Indian classical musicians and therapists
- Open source community for amazing tools and libraries
- Beta testers who provided valuable feedback

---

⭐ **Star this repo if you believe in healing through music!** ⭐

*Made with ❤️ for global mental wellness*
