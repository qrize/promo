import styles from './scss/tryit-container.module.scss';
import TryItForm from './tryit-form';

const TryItContainer = () => (
  <div className={styles['try-it']}>
    <section className="section">
      <header>
        <h1 className={styles['title']}>
          <strong>QR code</strong> and <strong>URL shortener</strong> got married 🎉
        </h1>
        <p className={styles['try-qrize']}>
          Create <strong>tiny QR codes</strong> for your web-pages. Check it out:
        </p>
      </header>
      <TryItForm />
    </section>
  </div>
);

export default TryItContainer;
