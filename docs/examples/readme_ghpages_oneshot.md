# Create GitHub Pages Site using GPT-4o One-Shot
[Compare to GPT-4o T3](./readme_ghpages_at3.md) | [Compare to OpenAI-o1-preview](./readme_ghpages_openaio1.md)


## INPUT/PROMPT
The following One-Shot prompt was sent to the `GPT-4o` model. The prompt includes an example of the expected output along with some contextual tips for the desired level of detail in the final output.

```
- `context` The project is focused on creating a GitHub Pages site using React, targeted at personas including CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, and Cloud Ops Engineer. The value proposition (content for the site) centers on reducing the need for experienced engineering talent. The customer has already purchased the domain from AWS (Route 53) and requires it to be mapped to the GitHub Pages site. Break down the project into major tasks like development, setup, deployment, and connecting, with a focus on simplicity and clarity. Assume that all necessary tools and accounts are already available.
- `instructions` Develop a static site using React, structured around key personas in the tech industry. Set up the GitHub repository for GitHub Pages, ensuring it's ready for web hosting. Deploy the site, ensuring all React components and static assets are properly configured for GitHub Pages. Connect the custom domain purchased from AWS Route 53 to the GitHub Pages site, including DNS configuration and verification of domain ownership. Return all instructions in Markdown as a single response users can follow step-by-step. 
- `output` should be formatted as a detailed  task tree. For example:
### 1.01 Set up the GitHub repository for the project.
#### 1.01.01 Create a new GitHub repository for the project.
Create a new GitHub repository for the project.
**Inputs**
- 1 account of GitHub account
- 1 string of Repository name
**Outputs**
- 1 repository of New GitHub repository
#### 1.01.02 Clone the repository to your local machine.
Clone the repository to your local machine using the command: git clone <repository_url>
**Inputs**
- 1 string of repository_url
**Outputs**
- 1 directory of cloned_repository
#### 1.01.03 Initialize the repository with a README.md file.
Navigate to the cloned repository directory on your local machine and run the command 'echo # Project Title > README.md' to create and initialize the README.md file.
**Inputs**
- 1 instance of Terminal
- 1 directory of Cloned Repository Directory
**Outputs**
- 1 file of README.md
```

## GPT-4o One Shot Prompt OUTPUT
The following was returned from the `GPT-4o` model:

### 1.01 Set up the GitHub repository for the project.

#### 1.01.01 Create a new GitHub repository for the project.

Create a new GitHub repository for the project.

**Inputs**
- 1 GitHub account
- 1 string of Repository name

**Outputs**
- 1 new GitHub repository

#### 1.01.02 Clone the repository to your local machine.

Clone the repository to your local machine using the command:

```bash
git clone <repository_url>
```

**Inputs**
- 1 string of repository_url

**Outputs**
- 1 directory of cloned_repository

#### 1.01.03 Initialize the repository with a README.md file.

Navigate to the cloned repository directory on your local machine and run the command:

```bash
echo "# Project Title" > README.md
```

**Inputs**
- 1 instance of Terminal
- 1 directory of Cloned Repository Directory

**Outputs**
- 1 file of README.md

### 1.02 Develop the React Application.

#### 1.02.01 Set up a new React project.

Create a new React project using Create React App:

```bash
npx create-react-app my-site
cd my-site
```

**Inputs**
- 1 instance of Terminal
- 1 string of project name ("my-site")

**Outputs**
- 1 React project directory

#### 1.02.02 Create personas-based pages and components.

Design and implement components targeting personas (CIO, VP of Engineering, etc.).

**Inputs**
- 1 directory of React project
- 1 set of personas for content structure

**Outputs**
- 1 set of React components/pages

#### 1.02.03 Customize content emphasizing the value proposition.

Develop content focusing on reducing the need for experienced engineering talent.

**Inputs**
- 1 set of React components/pages

**Outputs**
- 1 set of customized content pages

### 1.03 Configure the project for GitHub Pages deployment.

#### 1.03.01 Install GitHub Pages package.

Install the GitHub Pages package as a dev dependency:

```bash
npm install gh-pages --save-dev
```

**Inputs**
- 1 instance of Terminal
- 1 directory of React project

**Outputs**
- 1 updated package.json with gh-pages dependency

#### 1.03.02 Update \`package.json\` for GitHub Pages.

Modify the \`package.json\` to include the following scripts:

```json
"homepage": "https://<username>.github.io/<repository-name>",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

**Inputs**
- 1 file of package.json

**Outputs**
- 1 updated package.json file

## 2. Setup: Prepare GitHub Pages for Web Hosting

### 2.01 Push the initial setup to GitHub.

#### 2.01.01 Add and commit changes.

Run the following commands to add and commit all changes:

```bash
git add .
git commit -m "Initial commit"
```

**Inputs**
- 1 instance of Terminal
- 1 directory of React project

**Outputs**
- 1 committed state of repository

#### 2.01.02 Push changes to GitHub.

Push the changes to the main branch:

```bash
git push origin main
```

**Inputs**
- 1 instance of Terminal
- 1 GitHub repository URL

**Outputs**
- 1 updated GitHub repository

### 2.02 Deploy the React site to GitHub Pages.

#### 2.02.01 Run the deploy script.

Deploy the site to GitHub Pages:

```bash
npm run deploy
```

**Inputs**
- 1 instance of Terminal
- 1 directory of React project

**Outputs**
- 1 live GitHub Pages site

## 3. Deployment: Connect Custom Domain from AWS Route 53

### 3.01 Configure DNS settings in Route 53.

#### 3.01.01 Access AWS Route 53.

Log in to the AWS console and navigate to Route 53.

**Inputs**
- 1 AWS account
- 1 Route 53 console access

**Outputs**
- 1 instance of Route 53 DNS management

#### 3.01.02 Add CNAME record to Route 53.

Add a CNAME record in Route 53 pointing your domain to:

```plaintext
<username>.github.io
```

**Inputs**
- 1 custom domain
- 1 GitHub Pages URL

**Outputs**
- 1 updated Route 53 DNS settings

### 3.02 Configure GitHub Pages with the custom domain.

#### 3.02.01 Set custom domain in GitHub Pages settings.

Go to your GitHub repository settings, navigate to Pages, and set the custom domain.

**Inputs**
- 1 GitHub repository
- 1 string of custom domain

**Outputs**
- 1 configured custom domain for GitHub Pages

#### 3.02.02 Verify domain ownership.

Follow the verification process required by GitHub if prompted.

**Inputs**
- 1 GitHub repository
- 1 AWS Route 53 setup

**Outputs**
- 1 verified custom domain

### 3.03 Test and verify the deployment.

#### 3.03.01 Access the site using the custom domain.

Visit your site using the custom domain URL to ensure it is live and correctly routed.

**Inputs**
- 1 custom domain URL

**Outputs**
- 1 live site accessible via custom domain

#### 3.03.02 Check for any deployment errors or issues.

Ensure that all pages and components render correctly without errors.

**Inputs**
- 1 browser session

**Outputs**
- 1 verified working website

## Completion

Your GitHub Pages site is now live with a custom domain from AWS Route 53, designed around key tech industry personas, and ready to present its value proposition.
