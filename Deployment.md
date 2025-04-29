# Deployment Instructions

## Deploying to GitHub Pages

This document outlines the steps to deploy the AI Regulations Matrix website to GitHub Pages.

### Prerequisites

- A GitHub account
- Git installed on your local machine

### Step 1: Create a new GitHub repository

1. Go to [GitHub](https://github.com) and log in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository `ai-regulations-matrix`
4. Choose to make it public
5. Click "Create repository"

### Step 2: Prepare your local repository

1. Initialize a Git repository in your project folder (if not already done):
   ```bash
   git init
   ```

2. Add the GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/yourusername/ai-regulations-matrix.git
   ```

3. Add all files to the staging area:
   ```bash
   git add .
   ```

4. Commit the changes:
   ```bash
   git commit -m "Initial commit"
   ```

5. Push to the main branch:
   ```bash
   git push -u origin main
   ```

### Step 3: Configure GitHub Pages deployment

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. In the left sidebar, click on "Pages"
4. Under "Source", select "GitHub Actions"
5. You'll see a suggestion to use a workflow for static HTML deployment, but our repository already has a workflow file at `.github/workflows/deploy.yml`.

### Step 4: Trigger the deployment

The GitHub Actions workflow will automatically run when you push to the main branch. To manually trigger a deployment:

1. Go to the "Actions" tab on your repository
2. Select the "Build and Deploy" workflow
3. Click on "Run workflow" dropdown
4. Select "Run workflow" to start the deployment process

### Step 5: Access your deployed site

After the workflow completes successfully, your site will be available at:

```
https://yourusername.github.io/ai-regulations-matrix/
```

Replace `yourusername` with your actual GitHub username.

## Notes on GitHub Pages deployment

1. The site is configured to work as a static site on GitHub Pages, falling back to JSON files in the `/data` directory instead of API calls.
2. Form submissions and interactive features are simulated on GitHub Pages with appropriate messages indicating they're demos.
3. The site uses a special routing configuration to handle client-side routing on GitHub Pages.

## Troubleshooting

1. If you encounter a 404 error, make sure the GitHub Pages source is correctly set to the `gh-pages` branch.
2. If styles or scripts aren't loading, check the browser console for path-related errors. You might need to update paths in the config files.
3. If the GitHub Actions workflow fails, check the workflow logs for specific error messages.
