// https://en.wikipedia.org/wiki/Trigonometric_functions#Right-angled_triangle_definitions
// https://it.wikipedia.org/wiki/Triangolo_rettangolo#Propriet%C3%A0_degli_angoli_interni


const sections = 10,
  maxDuration = 1.5, // seconds
  minDuration = .5,

  root_container = document.querySelector('.root'),
  rotation = 15; // degrees

function calcImgScaleRatio() {

  // container size is used to quickly convert this script to a component, if needed
  const root_container_width = root_container.offsetWidth,
    root_container_height = root_container.offsetHeight,

    rotation_rad = rotation * Math.PI / 180,

    image_container_width = root_container_height * Math.sin(rotation_rad) + root_container_width * Math.cos(rotation_rad), // BC + CD
    image_container_height = root_container_height * Math.cos(rotation_rad) + root_container_width * Math.sin(rotation_rad), // AB + DE

    scale_ratio = (image_container_width * image_container_height) / (root_container_width * root_container_height);

  // console.log(root_container_width, root_container_height, root_container_width * root_container_height);
  // console.log(image_container_width, image_container_height, (image_container_width * image_container_height));
  console.log('Calculated scale ratio:', scale_ratio); // eslint-disable-line

  root_container.style.setProperty('--scale', scale_ratio);
  return scale_ratio;
}

const initialScaleRatio = calcImgScaleRatio(); // set initial scale

const image_width = 1400 * initialScaleRatio, // TODO make responsive
  img_url= 'https://images.unsplash.com/photo-1679259429316-a05794b72035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'+
    '&auto=format&fit=crop&q=40&w=' + image_width,
  credits_link = 'https://unsplash.com/@mazz';

const img = new Image();
img.onload = () => {
  root_container.innerHTML = `<div class="outerWrapper"
    style="--items: ${sections};
      --max-duration: ${maxDuration}s;
      --img: url(${img_url});
      --rotation: ${rotation}deg">
    <div class='imgStripesWrapper'>
        ${[...Array(sections)].map((_, idx) => {
          return `<div class="imgStripeItem" style="--idx: ${idx};
              --duration: ${(Math.random() * (maxDuration - minDuration) + minDuration).toFixed(2)}s">
              <div></div></div>`; // additional div needed for proper image placement
        }).join('')}
      </div>
      <div class="credits">
        <span>Photo <a href="${credits_link}?utm_source=github-demo&utm_medium=referral" target="_blank" rel="noopener noreferrer">@mazz / Unsplash</a></span>
        <span>Villa Borghese, Rome, Italy</span>
      </div>
    </div>`;

  calcImgScaleRatio();
};

img.src = img_url;

// recalculate on resize
const observer = new ResizeObserver( () => calcImgScaleRatio());
observer.observe(root_container);


