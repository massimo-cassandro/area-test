import './App.scss';
import { UnsplashSlideshow } from './unsplash-slideshow/unsplash-slideshow';

function App() {
  return (
    <main className="container main-container">
      <h1>Unsplash Slideshow demo</h1>
      <UnsplashSlideshow />

      <div className="current-brk">
        <span className="d-sm-none">xs</span>
        <span className="d-none d-sm-inline d-md-none">sm</span>
        <span className="d-none d-md-inline d-lg-none">md</span>
        <span className="d-none d-lg-inline d-xl-none">lg</span>
        <span className="d-none d-xl-inline d-xxl-none">xl</span>
        <span className="d-none d-xxl-inline">xxl</span>
      </div>

      <p>A presentation demo based on the Unsplash APIs</p>
      <p><a href="https://github.com/massimo-cassandro/area-test/tree/main/2023-05-unsplash-random-photo-2">Source</a></p>
    </main>
  );
}

export default App;
