# Lily's Space

A modern, responsive portfolio website built with Next.js, Tailwind CSS, and Notion as a CMS. This project serves as a personal website showcasing work experience, projects, writing, and more.

![Lily's Space Screenshot](public/images/screenshot.png)

## Features

- **Modern Design**: Clean, minimalist design with dark/light mode support
- **Responsive Layout**: Optimized for all device sizes
- **Obsidian-Powered CMS**: Content managed through Obsidian databases
- **Firebase Authentication**: User authentication for interactive features
- **Interactive Components**:
  - Ask Me Anything (AMA) section
  - Article comments with admin replies
  - Article likes
  - Resource sharing
  - App dissection case studies
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Performance Optimized**: Fast loading times and optimized assets

## Tech uses

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Obsidian (as headless CMS)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Deployment**: Vercel

## Project Structure

\`\`\`
portfolio-dashboard/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── writing/            # Blog section
│   ├── ama/                # Ask Me Anything section
│   ├── playground/         # Playground section (app dissections, resources)
│   ├── now/                # Now page
│   ├── uses/              # Tech stack page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                 # UI components (shadcn/ui)
│   ├── sidebar.tsx         # Sidebar navigation
│   └── ...                 # Other components
├── contexts/               # React contexts
│   └── auth-context.tsx    # Authentication context
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and libraries
│   ├── firebase.ts         # Firebase configuration
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
└── ...                     # Configuration files
\`\`\`

## Key Components

### Obsidian Integration

The website uses Obsidian as a headless CMS, with several databases:

- **Articles/Writing**: Blog posts with rich text content
- **Projects**: Portfolio projects
- **Work Experience**: Professional experience
- **Speaking**: Speaking engagements
- **App Dissections**: In-depth analyses of applications
- **Resources**: Useful resources and tools
- **AMA**: Ask Me Anything questions and answers
- **Comments**: Article comments



### Authentication System

Firebase Authentication is used to enable interactive features:

- Google sign-in for users
- Admin authentication for special privileges
- User profiles with avatars

### Interactive Features

1. **Article Interactions**:
   - Like/unlike articles
   - Comment on articles
   - Admin replies to comments

2. **Ask Me Anything (AMA)**:
   - Users can submit questions
   - Admin can answer questions
   - Questions are displayed in a feed

3. **App Dissections**:
   - In-depth analyses of applications
   - Rich media content with images and videos
   - Categorized by type

4. **Resources**:
   - Shared resources with download links
   - Categorized by type
   - External links to resources

### UI Components

The UI is built with a combination of custom components and shadcn/ui:

- **Navigation**: Sidebar for desktop, sheet for mobile
- **Theme Toggle**: Light/dark mode support
- **User Profile**: User information and authentication status
- **Comments Section**: Threaded comments with replies
- **Toast Notifications**: Feedback for user actions

## 🚀 Setup and Installation

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/lilianada/lilyslab.git
   cd portfolio-dashboard
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**:
   Create a `.env.local` file with the following variables:
   \`\`\`
  
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   \`\`\`

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🔑 Environment Variables
### Firebase Configuration

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID

## 📊 Obsidian Database Structure

### Articles Database

| Property   | Type       | Description                       |
|------------|------------|-----------------------------------|
| Title      | Title      | Article title                     |
| Slug       | Rich Text  | URL slug for the article          |
| Date       | Date       | Publication date                  |
| Published  | Checkbox   | Whether the article is published  |
| Excerpt    | Rich Text  | Short description of the article  |
| Cover      | Files      | Cover image for the article       |
| Tags       | Multi-select| Article tags                     |
|                 |


Similar structures exist for other databases (Projects, Work, Speaking, etc.)

## 🔄 Deployment

This project is designed to be deployed on Vercel:

1. **Push to GitHub**:
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Vercel**:
   - Create a new project on Vercel
   - Connect to your GitHub repository
   - Configure environment variables
   - Deploy

3. **Custom Domain** (optional):
   - Add your custom domain in Vercel settings
   - Configure DNS settings

## 🧠 Admin Features

To set up admin access:

1. Sign in with your Google account
2. Add your email to the `admins` collection in Firebase Firestore with the following structure:
   \`\`\`
   {
     isAdmin: true,
     createdAt: [timestamp],
     isLoggedIn: true
   }
   \`\`\`

Admin features include:
- Replying to comments
- Answering AMA questions
- Special admin badge display

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/ask-me-anythingzing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/ask-me-anythingzing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/)
- [Vercel](https://vercel.com/)
- [Lucide Icons](https://lucide.dev/)
