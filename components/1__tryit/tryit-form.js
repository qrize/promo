import { Component } from 'react';
import iconHtml from '../utils/icon';
import QrizeResult from './qrize-result';
import styles from './scss/tryit-form.module.scss';

// See: https://github.com/qrize/qrize/blob/master/src/validators.js
const urlRegExp = {
  shema: /((?:http|ftp)s?:\/\/)/,
  domain: /(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)/,
  ip: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  port: /(?::\d+)/,
  query: /(?:\/?|[/?]\S+)/,
};

urlRegExp.composed = new RegExp(
  `^${urlRegExp.shema.source}?` +
    `(?:${urlRegExp.domain.source}|localhost|${urlRegExp.ip.source})` +
    `${urlRegExp.port.source}?` +
    `${urlRegExp.query.source}$`,
  'i'
);

function isUrlValid(url) {
  return urlRegExp.composed.test(url);
}

class TryItForm extends Component {
  constructor() {
    super();
    this.state = { url: '', input: '', errorMessage: '', hasQR: false };

    this.handleInput = this.handleInput.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(event) {
    this.setState({
      input: event.target.value,
      url: '',
      errorMessage: '',
    });
  }

  handlePaste() {
    // let input event change state first, then get QR code
    setTimeout(() => {
      if (isUrlValid(this.state.input)) {
        this.getQR();
      }
    }, 0);
  }

  handleReset() {
    this.setState({ input: '', url: '', errorMessage: '' });
    this.urlInputEl.focus();
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getQR();
  }

  getQR() {
    if (!this.state.input) {
      this.setState({ errorMessage: 'Please, provide a link' });
      return;
    }
    if (!isUrlValid(this.state.input)) {
      this.setState({
        errorMessage: 'Unable to qrize this link. It is not a valid url',
      });
      return;
    }
    this.setState({ url: this.state.input }); // pass url to TryitResult
  }

  showErrorMessage(errorMessage) {
    this.setState({ errorMessage });
  }

  handleQRStatusUpdate(error) {
    const errorMessage = error ? `API error ${error.errorStatus}: ${error.errorText}` : '';
    this.setState({ errorMessage, hasQR: !error && this.state.url });
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className={`${styles['tryit-form']} ${this.state.hasQR ? styles['has-qr'] : ''}`}
        autoComplete="off"
      >
        <div role="group" className={styles['input-group']}>
          {/* input */}
          <input
            type="text"
            name="url"
            className={styles['url-input']}
            placeholder="Paste a link"
            ref={(input) => {
              this.urlInputEl = input;
            }}
            value={this.state.input}
            onInput={this.handleInput}
            onPaste={this.handlePaste}
            spellCheck="false"
            autoFocus
          />
          {/* reset button */}
          <button
            type="button"
            onClick={this.handleReset}
            className={`${styles['reset-btn']} ${
              this.state.input.length > 0 ? styles['show'] : ''
            }`}
            dangerouslySetInnerHTML={iconHtml('x', { 'stroke-width': 1 })}
            title="Clear input"
            aria-label="Clear input"
          />
          {/* submit button */}
          <button type="submit" className={styles['submit-btn']} disabled={this.state.hasQR}>
            <span className={styles['button-content']}>
              {this.state.hasQR ? (
                <>
                  <span
                    aria-hidden="true"
                    dangerouslySetInnerHTML={iconHtml('check', {
                      'stroke-width': 1,
                    })}
                  />
                  <span>Done</span>
                </>
              ) : (
                'Get QR code'
              )}
            </span>
          </button>
          {/* error message */}
          <div className={`${styles.error} ${this.state.errorMessage && styles.show}`}>
            {this.state.errorMessage}
          </div>
        </div>
        {/* QR code */}
        <QrizeResult url={this.state.url} onQRStatusUpdate={this.handleQRStatusUpdate.bind(this)} />
      </form>
    );
  }
}

export default TryItForm;
