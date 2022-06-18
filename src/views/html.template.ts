interface Args {
  body: string;
  styles: string;
  title: string;
}

const html = ({ body, styles, title }: Args) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    ${styles}
  </head>
  <body>
    <div id="app">${body}</div>
    <script src="/main.js"></script>
  </body>
</html>
`;

export default html;
