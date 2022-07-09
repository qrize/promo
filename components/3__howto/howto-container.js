import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const HowToUseContainer = () => (
  <section className="section how-to">
    <h2>How to use?</h2>

    <p>First, include qrize in your application. Qrize is available on npm:</p>
    <SyntaxHighlighter language="sh" style={okaidia}>
      {`npm install --save qrize`}
    </SyntaxHighlighter>

    <p>and CDN:</p>
    <SyntaxHighlighter language="html" style={okaidia}>
      {` <script src="https://unpkg.com/qrize/dist/qrize.umd.js"></script>`}
    </SyntaxHighlighter>

    <p>Then include following script somewhere:</p>
    <SyntaxHighlighter language="javascript" style={okaidia}>
      {`import Qrize from "qrize";

const qrize = new Qrize({
  element: document.getElementById("qr-target")
});
qrize.createImg({ url: "http://example.com" });`}
    </SyntaxHighlighter>

    <p>
      {
        'That\'s it. Now an element wih "qr-target" id contains tiny QR code that leads to the url you specified.'
      }
    </p>
  </section>
);

export default HowToUseContainer;
