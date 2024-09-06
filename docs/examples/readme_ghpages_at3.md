# AT3 Prompt (ChatGPT-4o)
[Compare to One Shot Prompt (ChatGPT-4o)](./readme_ghpages_oneshot.md)

### INPUT/PROMPT
- `context` The project is focused on creating a GitHub Pages site using React, targeted at personas including CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, and Cloud Ops Engineer. The value proposition (content for the site) centers on reducing the need for experienced engineering talent. The customer has already purchased the domain from AWS (Route 53) and requires it to be mapped to the GitHub Pages site. Break down the project into major tasks like development, setup, deployment, and connecting, with a focus on simplicity and clarity. Assume that all necessary tools and accounts are already available.
- `instructions` Develop a static site using React, structured around key personas in the tech industry. Set up the GitHub repository for GitHub Pages, ensuring it's ready for web hosting. Deploy the site, ensuring all React components and static assets are properly configured for GitHub Pages. Connect the custom domain purchased from AWS Route 53 to the GitHub Pages site, including DNS configuration and verification of domain ownership. Return all instructions in Markdown as a single response users can follow step-by-step.

## AT3 Prompt OUTPUT
GitHub Pages Site with React & AWS Route 53 Domain

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

#### 1.01.04 Set up the repository to use GitHub Pages.

##### 1.01.04.02 Install 'gh-pages' package for deployment

- Open your terminal.
- Navigate to the root directory of your React project.
- Run the command `npm install gh-pages --save-dev` to install the 'gh-pages' package.

**Inputs**
- 1 unit of Terminal
- 1 unit of React Project Directory

**Outputs**
- 1 installation of gh-pages package

##### 1.01.04.03 Configure 'package.json' for GitHub Pages

- Open the 'package.json' file in your project root directory.
- Add a 'homepage' field with the URL of your GitHub Pages site, e.g., "https://<username>.github.io/<repository-name>".
- Modify the 'scripts' section to include the following:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
- Save the 'package.json' file.

**Inputs**
- 1 file of package.json

**Outputs**
- 1 file of Configured package.json

##### 1.01.04.04 Deploy the site to GitHub Pages

- Ensure all changes are committed to the repository.
- Run `npm run deploy` to build and deploy the site to GitHub Pages.
- Verify the deployment by visiting the GitHub Pages URL provided in the repository settings.

**Inputs**
- 1 unit of Terminal/Command Line Interface

**Outputs**
- 1 site of Deployed GitHub Pages site

### 1.02 Develop the React static site structured around key personas.

#### 1.02.01 Set up the project structure and install necessary dependencies

##### 1.02.01.02 Set up the project structure

- Open the terminal and navigate to the directory where you want to create the project.
- Run `npx create-react-app tech-personas-site` to initialize a new React project named 'tech-personas-site'.
- Navigate into the project directory using `cd tech-personas-site`.
- Inside the 'src' folder, create subdirectories for components, pages, and assets:
   - `mkdir src/components`
   - `mkdir src/pages`
   - `mkdir src/assets`
- Create a file structure that includes a main App component and placeholder files for each persona page:
   - `touch src/components/Header.js src/components/Footer.js`
   - `touch src/pages/CIO.js src/pages/VPofEngineering.js src/pages/EngineeringManager.js src/pages/PrincipalArchitect.js src/pages/DevOpsEngineer.js src/pages/CloudOpsEngineer.js`
- Update `src/App.js` to include routes for each persona page using React Router.

**Inputs**
- 1 unit of Terminal
- 1 library of React
- 1 unit of File System

**Outputs**
- 1 unit of Project Structure
- 8 files of React Components

###### 1.02.01.02.01 1. Open the terminal and navigate to the directory where you want to create the project.

Open the terminal and navigate to the directory where you want to create the project. This should take approximately 1-2 minutes.



###### 1.02.01.02.02 2. Run `npx create-react-app tech-personas-site` to initialize a new React project named 'tech-personas-site'.

Run `npx create-react-app tech-personas-site` in the terminal to initialize a new React project named 'tech-personas-site'. This should take approximately 2-5 minutes.



###### 1.02.01.02.03 3. Navigate into the project directory using `cd tech-personas-site`.

Navigate into the project directory using the command `cd tech-personas-site`.



###### 1.02.01.02.04 4. Inside the 'src' folder, create subdirectories for components, pages, and assets: - `mkdir src/components` - `mkdir src/pages` - `mkdir src/assets`

Inside the 'src' folder, create subdirectories for components, pages, and assets:
- `mkdir src/components`
- `mkdir src/pages`
- `mkdir src/assets`



###### 1.02.01.02.05 5. Create a file structure that includes a main App component and placeholder files for each persona page: - `touch src/components/Header.js src/components/Footer.js` - `touch src/pages/CIO.js src/pages/VPofEngineering.js src/pages/EngineeringManager.js src/pages/PrincipalArchitect.js src/pages/DevOpsEngineer.js src/pages/CloudOpsEngineer.js`

Create the necessary files for the main App component and placeholder files for each persona page by running the following commands in your terminal:

```
touch src/components/Header.js src/components/Footer.js
touch src/pages/CIO.js src/pages/VPofEngineering.js src/pages/EngineeringManager.js src/pages/PrincipalArchitect.js src/pages/DevOpsEngineer.js src/pages/CloudOpsEngineer.js
```


**Outputs**
- 1 file of Header.js
- 1 file of Footer.js
- 1 file of CIO.js
- 1 file of VPofEngineering.js
- 1 file of EngineeringManager.js
- 1 file of PrincipalArchitect.js
- 1 file of DevOpsEngineer.js
- 1 file of CloudOpsEngineer.js

###### 1.02.01.02.06 6. Update `src/App.js` to include routes for each persona page using React Router.

- Open `src/App.js` in your code editor.
- Import React Router components at the top of the file:
```
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
```
- Import the persona pages:
```
import CIO from './pages/CIO';
import VPofEngineering from './pages/VPofEngineering';
import EngineeringManager from './pages/EngineeringManager';
import PrincipalArchitect from './pages/PrincipalArchitect';
import DevOpsEngineer from './pages/DevOpsEngineer';
import CloudOpsEngineer from './pages/CloudOpsEngineer';
```
- Wrap the main component with the Router and define routes inside the Switch component:
```
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/cio" component={CIO} />
          <Route path="/vp-of-engineering" component={VPofEngineering} />
          <Route path="/engineering-manager" component={EngineeringManager} />
          <Route path="/principal-architect" component={PrincipalArchitect} />
          <Route path="/devops-engineer" component={DevOpsEngineer} />
          <Route path="/cloud-ops-engineer" component={CloudOpsEngineer} />
        </Switch>
      </div>
    </Router>
  );
}
```
- Save the changes to `src/App.js`.



#### 1.02.02 Create React components for each persona

##### 1.02.02.01 Create a React component for the CIO persona

- Create a new file named `CIO.js` in the `src/components` directory.
- Import React and any necessary libraries at the top of the file.
- Define a functional component named `CIO` that returns JSX content tailored to the CIO persona, focusing on the value proposition of reducing the need for experienced engineering talent.
- Style the component using CSS or a styling library of your choice.
- Export the `CIO` component as the default export.
- Import and use the `CIO` component in the main application file (e.g., `App.js`) to ensure it renders correctly.

**Inputs**
- 1 library of React
- 1 tool of Text Editor/IDE

**Outputs**
- 1 file of CIO.js
- 1 component of CIO Component

##### 1.02.02.02 Create a React component for the VP of Engineering persona

- Create a new file named `VPOfEngineering.js` in the `src/components` directory.
- Import React and any necessary dependencies at the top of the file.
- Define a functional component named `VPOfEngineering`.
- Within the component, return JSX that includes content tailored to the VP of Engineering persona, focusing on how the site can reduce the need for experienced engineering talent.
- Style the component as needed using CSS or styled-components.
- Export the `VPOfEngineering` component as the default export.
- Import and use the `VPOfEngineering` component in the main application file (e.g., `App.js`) to ensure it renders correctly.

**Inputs**
- 1 library of React
- 1 syntax of JSX
- 1 library of CSS or styled-components

**Outputs**
- 1 file of VPOfEngineering.js

##### 1.02.02.03 Create a React component for the Engineering Manager persona

- Create a new file named `EngineeringManager.js` in the `src/components` directory.
- Import React and any necessary dependencies at the top of the file.
- Define a functional component named `EngineeringManager`.
- Within the component, return JSX that outlines the key value propositions and content tailored for the Engineering Manager persona.
- Style the component as needed using CSS or styled-components.
- Export the `EngineeringManager` component as the default export.
- Import and use the `EngineeringManager` component in the main application file (e.g., `App.js`) to ensure it renders correctly.

**Inputs**
- 1 library of React
- 1 syntax of JSX
- 1 library of CSS or styled-components

**Outputs**
- 1 file of EngineeringManager.js
- 1 component of EngineeringManager component

##### 1.02.02.04 Create a React component for the Principal Architect persona

- Create a new file named `PrincipalArchitect.js` in the `src/components` directory.
- Import React and any necessary libraries at the top of the file.
- Define a functional component named `PrincipalArchitect`.
- Within the component, return JSX that includes content tailored to the Principal Architect persona, focusing on the value proposition of reducing the need for experienced engineering talent.
- Style the component using CSS or a styling library as per the project's conventions.
- Export the `PrincipalArchitect` component as the default export.
- Import and use the `PrincipalArchitect` component in the main application file (e.g., `App.js`) to ensure it is rendered correctly.

**Inputs**
- 1 package of React library
- 1 package of CSS or styling library

**Outputs**
- 1 file of PrincipalArchitect.js file
- 1 component of Rendered Principal Architect component

##### 1.02.02.05 Create a React component for the DevOps Engineer persona

- Create a new file named `DevOpsEngineer.js` in the `src/components` directory.
- Import React and any necessary dependencies at the top of the file.
- Define a functional component named `DevOpsEngineer`.
- Within the component, return JSX that includes content tailored to the DevOps Engineer persona, focusing on how the site reduces the need for experienced engineering talent.
- Style the component as needed using CSS or styled-components.
- Export the `DevOpsEngineer` component as the default export.
- Import and use the `DevOpsEngineer` component in the main application file (e.g., `App.js`) to ensure it renders correctly.

**Inputs**
- 1 library of React
- 1 syntax of JSX
- 1 styling method of CSS or styled-components

**Outputs**
- 1 file of DevOpsEngineer.js
- 1 functional component of DevOpsEngineer component

##### 1.02.02.06 Create a React component for the Cloud Ops Engineer persona

- Create a new file named `CloudOpsEngineer.js` in the `src/components` directory.
- Import React and any necessary dependencies at the top of the file.
- Define a functional component named `CloudOpsEngineer`.
- Within the component, return JSX that outlines the key information and value propositions for the Cloud Ops Engineer persona.
- Style the component as needed using CSS or styled-components.
- Export the `CloudOpsEngineer` component as the default export.
- Import and use the `CloudOpsEngineer` component in the main application file (e.g., `App.js`) to ensure it renders correctly.

**Inputs**
- 1 library of React
- 1 syntax of JSX
- 1 style of CSS or styled-components

**Outputs**
- 1 file of CloudOpsEngineer.js
- 1 component of CloudOpsEngineer component

#### 1.02.03 Develop the main layout and navigation

##### 1.02.03.01 Set up the main layout structure using a React component

- Create a new file named `MainLayout.js` in the `src/components` directory.
- Import necessary React libraries and any other components that will be part of the main layout.
- Define a functional component named `MainLayout`.
- Inside the `MainLayout` component, create a basic structure using HTML elements such as `<header>`, `<main>`, and `<footer>`.
- Use CSS or a CSS-in-JS solution to style the layout appropriately.
- Export the `MainLayout` component for use in other parts of the application.

**Inputs**
- 1 package of React library
- 1 package of CSS or CSS-in-JS solution

**Outputs**
- 1 file of MainLayout.js file

##### 1.02.03.02 Create a navigation bar component

- Create a new file named `NavBar.js` in the `src/components` directory.
- Import necessary modules: React, Link from 'react-router-dom', and any CSS for styling.
- Define a functional component `NavBar` that returns a navigation bar structure with links to different sections (e.g., Home, About, Services, Contact).
- Export the `NavBar` component as default.
- Ensure the navigation bar is responsive and styled according to the project's design guidelines.

**Inputs**
- 1 library of React
- 1 library of react-router-dom
- 1 file of CSS/SCSS

**Outputs**
- 1 file of NavBar.js

##### 1.02.03.03 Integrate the navigation bar into the main layout

- Open the main layout component file (e.g., MainLayout.js).
- Import the navigation bar component at the top of the file using `import NavBar from './NavBar';`.
- Integrate the NavBar component into the JSX structure of the main layout, typically at the top of the return statement.
- Ensure that the NavBar component is correctly positioned and styled within the main layout.
- Save the changes and test the integration by running the development server to verify the navigation bar appears as expected.

**Inputs**
- 1 file of Main layout component file
- 1 file of Navigation bar component file

**Outputs**
- 1 component of Integrated navigation bar in main layout

##### 1.02.03.04 Ensure responsive design for the main layout and navigation

- Use CSS media queries to ensure the navigation bar and main layout are responsive across different screen sizes (mobile, tablet, desktop). 2. Test the layout on various devices and screen resolutions to confirm responsiveness. 3. Adjust padding, margins, and font sizes as necessary to maintain a consistent and user-friendly design. 4. Utilize React's built-in hooks or third-party libraries like 'react-responsive' if needed for more complex responsive behaviors.



#### 1.02.04 Add content specific to each persona

##### 1.02.04.01 Identify key content areas for each persona (CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, Cloud Ops Engineer)

Identify the key content areas for each persona by focusing on their specific needs and how the value proposition of reducing the need for experienced engineering talent can address those needs. Consider the following aspects for each persona: challenges they face, goals they aim to achieve, and how the solution can benefit them. Allocate approximately 2 hours for this task.


**Outputs**
- 1 list of Key content areas for CIO
- 1 list of Key content areas for VP of Engineering
- 1 list of Key content areas for Engineering Manager
- 1 list of Key content areas for Principal Architect
- 1 list of Key content areas for DevOps Engineer
- 1 list of Key content areas for Cloud Ops Engineer

###### 1.02.04.01.01 1. Identify the key content areas for each persona by focusing on their specific needs and how the value proposition of reducing the need for experienced engineering talent can address those needs.

Identify the key content areas for each persona by focusing on their specific needs and how the value proposition of reducing the need for experienced engineering talent can address those needs. This involves researching and understanding the primary challenges, goals, and pain points of each persona (CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, Cloud Ops Engineer) and mapping these to the benefits provided by the solution.


**Outputs**
- 1 list of Key content areas for CIO
- 1 list of Key content areas for VP of Engineering
- 1 list of Key content areas for Engineering Manager
- 1 list of Key content areas for Principal Architect
- 1 list of Key content areas for DevOps Engineer
- 1 list of Key content areas for Cloud Ops Engineer

###### 1.02.04.01.02 2. Consider the following aspects for each persona: challenges they face, goals they aim to achieve, and how the solution can benefit them.

Consider the following aspects for each persona: challenges they face, goals they aim to achieve, and how the solution can benefit them. Allocate approximately 2 hours for this task.

**Inputs**
- 1 set of Research materials on CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, Cloud Ops Engineer roles
- 1 document of Value proposition details

**Outputs**
- 1 document of Detailed list of challenges, goals, and benefits for each persona

###### 1.02.04.01.03 3. Allocate approximately 2 hours for this task.

Allocate approximately 2 hours to identify key content areas for each persona (CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, Cloud Ops Engineer). Consider the challenges they face, their goals, and how the solution can benefit them. Document these insights clearly for use in content creation.


**Outputs**
- 1 document of Documented key content areas for each persona

##### 1.02.04.02 Draft initial content for each persona focusing on the value proposition

Draft initial content for each persona focusing on the value proposition of reducing the need for experienced engineering talent. Ensure the content is tailored to address the specific concerns and interests of each persona. The content should be concise, clear, and compelling, highlighting how the solution can benefit their role and organization.

**Inputs**
- 1 set of Research materials on each persona's responsibilities and challenges
- 1 document of Value proposition details

**Outputs**
- 1 document of Initial content drafts for CIO
- 1 document of Initial content drafts for VP of Engineering
- 1 document of Initial content drafts for Engineering Manager
- 1 document of Initial content drafts for Principal Architect
- 1 document of Initial content drafts for DevOps Engineer
- 1 document of Initial content drafts for Cloud Ops Engineer

##### 1.02.04.03 Create React components for each persona's content

- Create a new directory named 'components' inside the 'src' folder of your React project.
- Inside the 'components' directory, create separate files for each persona (e.g., CIO.js, VPOfEngineering.js, EngineeringManager.js, PrincipalArchitect.js, DevOpsEngineer.js, CloudOpsEngineer.js).
- In each file, define a functional React component that returns JSX containing the drafted content for the respective persona.
- Ensure each component is properly styled and structured to match the overall design of the site.
- Export each component as the default export from its file.

**Inputs**
- 1 project of React project structure
- 6 documents of Drafted content for each persona

**Outputs**
- 6 components of React components for each persona

##### 1.02.04.04 Integrate the persona-specific content into the main layout

- Import the persona-specific components into the main layout component.
- Create a navigation structure in the main layout to allow users to switch between different persona views.
- Integrate each persona component into the main layout, ensuring that the content is displayed correctly when selected from the navigation.
- Test the integration by running the React application locally and navigating through each persona's content to ensure proper rendering and functionality.

**Inputs**
- 6 components of Persona components
- 1 component of Main layout component

**Outputs**
- 1 component of Integrated main layout with persona-specific content

#### 1.02.05 Style the components and layout using CSS or a styling library

##### 1.02.05.01 Choose a CSS framework or styling library (e.g., Bootstrap, Material-UI, Tailwind CSS) or decide to use plain CSS.

Choose a CSS framework or styling library for the React project. Consider factors such as ease of use, community support, and compatibility with React. Popular options include Bootstrap, Material-UI, and Tailwind CSS. Alternatively, you can opt for plain CSS if you prefer more control over the styling. Document your choice and rationale for future reference.


**Outputs**
- 1  of Chosen CSS framework or styling library

##### 1.02.05.02 Set up the chosen styling method in the React project (e.g., install necessary packages for a library).

- Open your terminal and navigate to the root directory of your React project.
- Install the chosen styling library using npm or yarn. For example, if you chose Material-UI, run:
   ```
   npm install @mui/material @emotion/react @emotion/styled
   ```
   If you chose Tailwind CSS, run:
   ```
   npm install -D tailwindcss
   npx tailwindcss init
   ```
- If using plain CSS, ensure you have a `styles` directory in your `src` folder and create a `global.css` file.
- Import the necessary styles or CSS files into your `index.js` or `App.js` file. For example, for Material-UI, you might import a theme provider; for Tailwind CSS, import the generated CSS file in `index.css`.
- Verify the installation by running the development server with `npm start` or `yarn start` and checking that the styles are applied correctly.

**Inputs**
- 1 unit of Terminal
- 1 project of React Project
- 1 package of Styling Library Package

**Outputs**
- 1 project of Styled React Project

##### 1.02.05.03 Create a global stylesheet or theme configuration if using a library.

- Create a new file named `globalStyles.css` in the `src` directory for global styles.
- If using a styling library like Material-UI, create a theme configuration file (e.g., `theme.js`) in the `src` directory.
- In `globalStyles.css`, define global CSS rules for body, headings, and other common elements.
- If using a theme configuration, import necessary components from the library and define the theme settings (e.g., colors, typography).
- Import `globalStyles.css` into the main entry point of the React application (e.g., `index.js`).
- If using a theme configuration, wrap the root component with the theme provider (e.g., `<ThemeProvider>` for Material-UI) in the main entry point.

**Inputs**
- 1 file of globalStyles.css
- 1 file of theme.js

**Outputs**
- 1 file of global stylesheet
- 1 file of theme configuration

##### 1.02.05.04 Style the main layout components (header, footer, navigation).

- Open the main layout component files (e.g., Header.js, Footer.js, Navigation.js).
- Import the global stylesheet or theme configuration at the top of each file.
- Apply class names or styled components to the JSX elements within these files.
- Ensure consistent styling by using predefined CSS classes or theme variables.
- Test the layout components in the browser to verify the styles are applied correctly.

**Inputs**
- 1 file of Header.js
- 1 file of Footer.js
- 1 file of Navigation.js
- 1 file of Global stylesheet or theme configuration

**Outputs**
- 1 component of Styled Header component
- 1 component of Styled Footer component
- 1 component of Styled Navigation component

##### 1.02.05.05 Style individual persona-specific components.

- Identify the key personas (CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, Cloud Ops Engineer) and their specific components within the React project.
- Apply CSS or a styling library (e.g., styled-components, CSS Modules) to each persona-specific component to ensure a professional and cohesive look.
- Ensure that the styles align with the overall design language of the site.
- Test each component individually to verify that the styles are applied correctly and consistently.
- Make adjustments as necessary based on visual inspection and feedback.

**Inputs**
- 1 package of CSS or styling library
- 6 components of React components for each persona

**Outputs**
- 6 components of Styled persona-specific components

##### 1.02.05.06 Ensure responsive design and cross-browser compatibility.

- Use CSS media queries to ensure the site is responsive across different screen sizes (mobile, tablet, desktop).
- Test the site on multiple browsers (Chrome, Firefox, Safari, Edge) to ensure compatibility.
- Utilize browser developer tools to identify and fix any layout issues.
- Implement any necessary polyfills for older browser support.
- Conduct user testing on various devices to confirm responsiveness and compatibility.

**Inputs**
- 1 set of CSS media queries
- 1 set of Browser developer tools
- 1 set of Polyfills
- 3 types of Testing devices

**Outputs**
- 1 site of Responsive design
- 1 site of Cross-browser compatibility

### 1.03 Configure the React app for GitHub Pages deployment.

#### 1.03.02 Update package.json with homepage and scripts

#### 1.03.04 Configure GitHub repository settings for Pages

##### 1.03.04.05 Configure the repository settings for GitHub Pages

- Navigate to your GitHub repository.
- Click on 'Settings' in the repository menu.
- Scroll down to the 'Pages' section in the left sidebar.
- Under 'Source', select the branch you want to use for GitHub Pages (usually 'main' or 'master').
- If necessary, select the folder containing the static site files (e.g., '/root' or '/docs').
- Click 'Save'.
- Wait for GitHub to build and deploy the site. This may take a few minutes.
- Once deployed, note the URL provided by GitHub Pages.



### 1.04 Deploy the React app to GitHub Pages.

#### 1.04.02 Create a new repository on GitHub for the project.

#### 1.04.03 Push the built React app to the `gh-pages` branch of the repository.

#### 1.04.04 Configure the repository settings to use the `gh-pages` branch for GitHub Pages.

Go to the repository settings on GitHub, navigate to the 'Pages' section, and set the source branch to 'gh-pages'.

**Inputs**
- 1 repository of GitHub repository

**Outputs**
- 1 site of GitHub Pages site configured

### 1.05 Connect the custom domain from AWS Route 53 to the GitHub Pages site, including DNS configuration and verification of domain ownership.

#### 1.05.01 Update DNS settings in AWS Route 53 to point to GitHub Pages

##### 1.05.01.01 Log in to AWS Route 53 console

Log in to the AWS Management Console and navigate to the Route 53 service.

**Inputs**
- 1 set of AWS account credentials

**Outputs**
- 1 instance of Access to AWS Route 53 console

##### 1.05.01.02 Navigate to the hosted zone for your domain

In the AWS Route 53 console, navigate to the 'Hosted zones' section and select the hosted zone corresponding to your domain.



##### 1.05.01.03 Create a new record set

In the AWS Route 53 console, within your domain's hosted zone, click on 'Create Record Set'.



##### 1.05.01.04 Set the record type to CNAME

In the AWS Route 53 console, within the hosted zone for your domain, set the record type to 'CNAME' for the new record set you created.



##### 1.05.01.05 Enter the GitHub Pages URL as the value

Enter the GitHub Pages URL (e.g., your-username.github.io) as the value for the CNAME record.

**Inputs**
- 1 string of GitHub Pages URL

**Outputs**
- 1 record of CNAME record with GitHub Pages URL

##### 1.05.01.06 Save the record set

Click the 'Save record set' button to finalize the DNS configuration.



#### 1.05.02 Add custom domain to GitHub Pages settings

Navigate to the repository settings on GitHub, find the 'Pages' section, and enter the custom domain purchased from AWS Route 53 in the 'Custom domain' field. Save the changes.

**Inputs**
- 1 repository of GitHub repository
- 1 domain of Custom domain

**Outputs**
- 1 configuration of Custom domain configured in GitHub Pages

#### 1.05.03 Verify domain ownership through DNS verification

##### 1.05.03.07 Wait for DNS propagation

Wait for DNS propagation, which can take anywhere from a few minutes to 48 hours. During this time, periodically check the DNS status using tools like 'nslookup' or online DNS propagation checkers to confirm that the DNS records have been updated globally.



##### 1.05.03.08 Verify domain ownership on GitHub Pages settings

- Go to your GitHub repository's settings.
- Navigate to the 'Pages' section.
- In the 'Custom domain' field, enter your custom domain purchased from AWS Route 53.
- Click 'Save'.
- GitHub will prompt you to verify domain ownership. Ensure that the DNS records have propagated.
- Once verified, GitHub Pages will display a success message indicating that the custom domain is now linked.

