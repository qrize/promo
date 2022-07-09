import { Component } from 'React';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.min.css';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';

class PrismCode extends Component {
  componentDidMount() {
    this.hightlight();
  }

  componentDidUpdate() {
    this.hightlight();
  }

  hightlight() {
    Prism.highlightElement(this.domNode);
  }

  render() {
    const { className, children } = this.props;

    return (
      <pre className="normalize-whitespace">
        <code
          ref={(domNode) => {
            this.domNode = domNode;
          }}
          className={className}
        >
          {children}
        </code>
      </pre>
    );
  }
}

export default PrismCode;
