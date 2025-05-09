# Vite React App

This is a React application built with Vite, a modern frontend build tool that provides a faster and leaner development experience.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 22+)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

## Getting Started

Follow these steps to set up and run the application:

### 1. Clone the repository

```bash
git clone https://github.com/am-3/wemakebugsonly
cd frontend/campus-plat
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Using Yarn:

```bash
yarn
```

Using pnpm:

```bash
pnpm install
```

### 3. Start the development server

Using npm:

```bash
npm run dev
```

Using Yarn:

```bash
yarn dev
```

Using pnpm:

```bash
pnpm dev
```

This will start the development server, typically at `http://localhost:5173`. Open this URL in your browser to view the application.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `yarn dev` or `pnpm dev`

Runs the app in development mode with hot-reload. The page will reload when you make changes to the code.

### `npm run build` or `yarn build` or `pnpm build`

Builds the app for production to the `dist` folder. The build is minified and optimized for best performance.

### `npm run preview` or `yarn preview` or `pnpm preview`

After building the app, you can preview the production build locally with this command.

## Project Structure

```
/campus-plat
├── public/              # Public assets that will be served directly
├── src/                 # Source files
|   ├── app/             # Application-specific code
│   ├── services/        # Data fetching and state management
│   ├── assets/          # Static assets like images, fonts, etc.
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript types
│   ├── components/      # Reusable React components
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point of the application
│   └── index.css        # Global CSS
├── .gitignore           # Git ignore file
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## Customizing the Application

### Adding dependencies

To add new packages to your project:

```bash
npm install package-name
# or
yarn add package-name
# or
pnpm add package-name
```

### Environment Variables

Create a `.env` file in the root directory (`/campus-plat`) to add environment variables:

```
VITE_API_URL=https://api.example.com
```

Access these variables in your code with `import.meta.env.VITE_API_URL`.

## Deployment

To deploy your application, first build it with:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Then deploy the contents of the `dist` directory to your hosting provider of choice.

## Learn More

To learn more about the technologies used in this project:

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/)

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 5173 is already in use, Vite will automatically try to use the next available port.

2. **Node.js version**: Make sure you're using Node.js version 22+.

3. **Build errors**: Clear the cache by removing the `node_modules/.vite` directory and try building again.

### Getting Help

If you encounter problems not covered here, please check the [Vite GitHub issues](https://github.com/vitejs/vite/issues) or create a new issue in your project repository.
