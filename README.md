# Fuzzy Gates
Fuzzy Gates employs a prompt style known as **Automated Transitive Task Trees (AT3)**.

The initiating prompt includes an **initial query context**—a robust guiding statement, describing the motivation, audience, constraints, etc, and transitive **seed instructions** (e.g., *Make a double cheeseburger*). The AI then generates a detailed task tree, breaking down the seed instructions into a series of transitive subtasks during recursive evaluation.

## Principles

**AT3** is based on the premise that transitive verbs can elicit process intelligence from an LLM. The implementation strategy is derived from literary analysis, where *'be' verbs* are linked with terminal narrative states, whereas *transitive verbs* propel the story forward.

>*BE Verbs* describe terminal states of being or becoming and include verbs such as be, am, is, are, was, were, been, have, has, had, do, does, did, can, could, may, might, shall, should, will, would, must.

## Strategy
Using an evolving context window and a set of recursive, gestalt-oriented strategies, AT3 is a multi-phase process that is entirely automated and iterative. It is designed to be influenced by the user's feedback at any step in the tree; but, it is also designed to be self-correcting and self-improving, leveraging analytics to prune, clarify, and expand the task tree.

- **I. GENERATE** the *Transitive Task Tree*. Recursively **clarify** or **subtask** the instructional seed using an evolving context:
  - **INITIAL CONTEXT**
  - **ANCESTOR TASK LIST**
  - **PREVIOUS SIBLING TASK**
  - **FOLLOWING SIBLING TASK**
- **II. ITERATIVELY IMPROVE** the *Transitive Task Tree*. Use analytics to generate a comprehensive view of the task set to:
  1. **PRUNE TASKS**
  2. **CLARIFY TASKS**
  3. **EXPAND (SUBTASK) TASKS**

## Example 1: Recipe for Classic Chicken Pot Pie

### INPUT/PROMPT
- `context` All units are American. Specify exact quantities and recommend specific varietals that reflect a NorCal/Napa style palette (fresh); recommend Kosher salt, for example, never salt. BE concise! Never overexplain! Explain how to prep and cook, but never more! Recipe book style! Limit to 4 levels of task breakdown. Assume they are already present and gathered.
- `instructions` Make classic chicken pot pie with peas carrots and corn with extra flaky crust.

### One Shot Prompt OUTPUT
*One Shot* generates the following output using OpenAI's ChatGPT-4o model, providing a single, comprehensive response that includes all necessary steps along with ingredients to complete the task. [output](./docs/examples/readme_recipe_oneshot.md)

### AT3 Prompt OUTPUT
*AT3* produced significantly more detailed outpu using the same ChatGPT-4o model, particularly at the task level with detailed inputs and outupts described for every step. [output](./docs/examples/readme_recipe_at3.md)

## Example 2: GitHub Pages Site with React and AWS Route 53

### INPUT/PROMPT
- `context` The project is focused on creating a GitHub Pages site using React, targeted at personas including CIO, VP of Engineering, Engineering Manager, Principal Architect, DevOps Engineer, and Cloud Ops Engineer. The value proposition (content for the site) centers on reducing the need for experienced engineering talent. The customer has already purchased the domain from AWS (Route 53) and requires it to be mapped to the GitHub Pages site. Break down the project into major tasks like development, setup, deployment, and connecting, with a focus on simplicity and clarity. Assume that all necessary tools and accounts are already available.
- `instructions` Develop a static site using React, structured around key personas in the tech industry. Set up the GitHub repository for GitHub Pages, ensuring it's ready for web hosting. Deploy the site, ensuring all React components and static assets are properly configured for GitHub Pages. Connect the custom domain purchased from AWS Route 53 to the GitHub Pages site, including DNS configuration and verification of domain ownership. Return all instructions in Markdown as a single response users can follow step-by-step.

### One Shot Prompt OUTPUT
*One Shot* generates the following output using OpenAI's ChatGPT-4o model, providing a single, comprehensive response that includes all necessary steps to complete the task. [output](./docs/examples/readme_ghpages_oneshot.md)

### AT3 Prompt OUTPUT
*AT3's* iterative back-and-forth produces significantly more detailed output, resulting in a richer and more nuanced task breakdown. [output](./docs/examples/readme_ghpages_at3.md)

## Conclusion

While one-shot strategies can be compared to throwing a perfectly chiseled chunk of marble into a lake and observing the emerging ripples, AT3 is more akin to skipping a stone across the water, letting the water fragment the stone along its journey. This approach is interactive, dynamic, and iterative. The outcome, while not always perfect, is significantly more detailed and extensible.

## Run

Use the POSTMAN files (included in the /docs folder) to call the APIs.
