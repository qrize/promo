import TryItContainer from '../components/1__tryit/tryit-container';
import WhyQrizeContainer from '../components/2__why/why-container';
import HowToUseContainer from '../components/3__howto/howto-container';
import GitHubContainer from '../components/4__github/github-container';
import FooterContainer from '../components/5__footer/footer-container';

export default function Home() {
  return (
    <main className="container">
      <TryItContainer />
      <WhyQrizeContainer />
      <HowToUseContainer />
      <GitHubContainer />
      <FooterContainer />
    </main>
  );
}
