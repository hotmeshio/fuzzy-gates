export const styles = `
<style type="text/css">
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@500;700&display=swap');

  body {
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
  }

  h1, h2, h3, h4 {
    font-family: 'Montserrat', 'Lato', sans-serif;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.2;
  }

  h1 {
    font-size: 2.5em;
    color: #333333;
    border-bottom: 2px solid #333333;
    padding-bottom: 10px;
  }

  h2 {
    font-size: 1.8em;
    color: #483d8b;
    margin-top: 3em;
    margin-bottom: 0;
  }

  h3 {
    font-size: 1.4em;
    color: #6864b0;
    margin-top: 2em;
    margin-bottom: 0;
  }

  h4 {
    color: #7f6e9e;
    margin-top: 1.5em;
    margin-bottom: 0;
    font-style: italic;
  }

  strong {
    display: inline-block;
    margin-top: 1em;
    font-size: 1em;
  }

  p {
    margin-bottom: 0;
    font-size: 1.25em;
    margin-top: .5em;
  }

  ul, ol {
    margin-bottom: 1.2em;
    padding-left: 30px;
  }

  li {
    margin-bottom: 0.5em;
  }

  strong {
    font-weight: 600;
    color: #2c3e50;
  }

  /* Style for the task tree structure */
  .task-tree {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 20px;
  }

  /* Style for input/output lists */
  .io-list {
    background-color: #f1f8ff;
    border-left: 4px solid #3498db;
    padding: 10px 15px;
    margin-bottom: 1em;
  }

  .io-list h4 {
    margin-top: 0;
    color: #3498db;
  }

  .io-list ul {
    margin-bottom: 0;
  }

  /* Add some hover effects for interactivity */
  h2:hover, h3:hover, h4:hover {
    transform: translateX(5px);
    transition: transform 0.3s ease;
  }

  /* Responsive design */
  @media (max-width: 600px) {
    body {
      padding: 10px;
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.2em;
    }

    h4 {
      font-size: 1.1em;
    }
  }
</style>`;
