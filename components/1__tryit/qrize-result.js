import { Component } from 'react';
import Qrize from 'qrize';
import iconHtml from '../utils/icon';
import styles from './scss/qrize-result.module.scss';

const REDIRECTOR_ENDPOINT = 'https://qrize.me/f/p/r/<hash>';

// See: https://blog.qrstuff.com/2011/11/23/qr-code-minimum-size
const QR_CODE_SIZES = [
  { modules: 25, chars: 26 },
  { modules: 30, chars: 49 },
  { modules: 35, chars: 72 },
  { modules: 40, chars: 98 },
  { modules: 45, chars: 125 },
  { modules: 50, chars: 163 },
  { modules: 55, chars: 203 },
  { modules: 60, chars: 249 },
  { modules: 65, chars: 298 },
  { modules: 70, chars: 351 },
  { modules: 75, chars: 407 },
  { modules: 80, chars: 468 },
  { modules: 85, chars: 534 },
  { modules: 90, chars: 601 },
  { modules: 95, chars: 669 },
  { modules: 100, chars: 739 },
];

/**
 * Get a minimal QR code square area
 * @param {Number} chars - url length
 */
function getQRCodeSizeFromUrl({ length }) {
  let edge = QR_CODE_SIZES[QR_CODE_SIZES.length - 1].modules;
  for (let i = 0; i < QR_CODE_SIZES.length; i += 1) {
    const SIZE = QR_CODE_SIZES[i];
    if (length <= SIZE.chars) {
      edge = SIZE.modules;
      break;
    }
  }
  return edge ** 2;
}

class QrizeResult extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      visible: false,
      time: null,
      isPending: false,
      pendingHintVisible: false,
    };
  }

  componentDidMount() {
    this.qrize = new Qrize({
      element: document.getElementById('qr-target'),
      cellSize: 5,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.url === this.props.url) {
      return;
    }
    if (!nextProps.url) {
      this.setState({ visible: false });
      this.props.onQRStatusUpdate(null);
    } else {
      this.getQR(nextProps.url);
    }
  }

  getQR(url) {
    const startTime = performance.now();
    this.setState({ isPending: true });
    const pendingHintTimeout = setTimeout(() => {
      this.setState({ pendingHintVisible: true });
    }, 1000);

    this.qrize.createImg({
      url,
      onSuccess: ({ hash }) => {
        console.debug('QR code has been built');
        const redirectorUrl = REDIRECTOR_ENDPOINT.replace('<hash>', hash);
        const time = Math.round(performance.now() - startTime);
        const minificationRatio =
          getQRCodeSizeFromUrl(this.props.url) / getQRCodeSizeFromUrl(redirectorUrl);

        this.setState({
          visible: true,
          redirectorUrl,
          time,
          minificationRatio,
          isPending: false,
          pendingHintVisible: false,
        });
        clearTimeout(pendingHintTimeout);
        this.props.onQRStatusUpdate(null);
      },
      onFailure: (errorStatus, errorText) => {
        this.props.onQRStatusUpdate({ errorStatus, errorText });
        this.setState({ isPending: false, pendingHintVisible: false });
        clearTimeout(pendingHintTimeout);
      },
    });
  }

  render() {
    return (
      <>
        {this.state.isPending ? (
          <div className={styles['loaderWrap']}>
            <div
              className={styles['loader']}
              dangerouslySetInnerHTML={iconHtml('loader', {
                width: 32,
                height: 32,
              })}
            ></div>

            <span
              className={`${styles['hint']} ${
                this.state.pendingHintVisible ? styles['visible'] : ''
              }`}
            >
              <span>...serverless cold start 😅</span>
            </span>
          </div>
        ) : null}

        <div
          className={`${styles['qr-holder']} ${this.state.visible ? '' : styles['hide']}`}
          tabIndex="0"
        >
          <figure>
            <div id="qr-target" />
            <figcaption className={styles['details']}>
              {/* short link */}
              <dl className={styles['details-group']}>
                <dt>
                  <span
                    className={styles['glyph']}
                    aria-label="Short link"
                    dangerouslySetInnerHTML={iconHtml('link-2', {
                      width: 16,
                      height: 16,
                    })}
                  />
                </dt>
                <dd title="Short link that leads to the original url">
                  <a href={this.state.redirectorUrl} target="_blank" rel="noopener noreferrer">
                    {this.state.redirectorUrl}
                  </a>
                </dd>
              </dl>
              {/* time taken */}
              <dl className={styles['details-group']}>
                <dt>
                  <span
                    className={styles['glyph']}
                    aria-label="Time taken"
                    dangerouslySetInnerHTML={iconHtml('zap', {
                      width: 18,
                      height: 18,
                    })}
                  />
                </dt>
                <dd title={`It took ${this.state.time}ms to shorten a link and render a QR code`}>
                  Rendered in {this.state.time}ms
                </dd>
              </dl>
              {/* times smaller */}
              <dl className={styles['details-group']}>
                <dt>
                  <span
                    className={styles['glyph']}
                    aria-label="Times smaller"
                    dangerouslySetInnerHTML={iconHtml('minimize-2', {
                      width: 18,
                      height: 18,
                    })}
                  />
                </dt>
                <dd
                  title={
                    this.state.minificationRatio > 1
                      ? `Qrized QR code is ${this.state.minificationRatio} times smaller than regular`
                      : 'The size of a minified QR code is the same as of regular'
                  }
                >
                  {this.state.minificationRatio}x smaller
                  {this.state.minificationRatio > 1 ? '' : ' (try longer url)'}
                </dd>
              </dl>
            </figcaption>
          </figure>
          <span className={styles['hint']}>
            <span
              dangerouslySetInnerHTML={iconHtml('corner-left-up', {
                width: 18,
                height: 18,
              })}
            />
            <span>Hover to see details</span>
          </span>
        </div>
      </>
    );
  }
}

export default QrizeResult;
