// note that the apikey.js is not uploaded in the repository, add your personal apikey to try
import { access_key } from './apikey.js';

// https://unsplash.com/documentation#search-photos
const UNSPLASH_SEARCH_API = 'https://api.unsplash.com/search/photos';

// Default query parameters for the Unsplash /search/photos endpoint.
// All params are optional except `query` (passed at call time).
const defaultParams = {
  per_page: 20,           // results per page — max: 30
  order_by: 'relevant',   // "relevant" | "latest"
  content_filter: 'high', // "low" | "high" — filters explicit content
  orientation: 'landscape', // "landscape" | "portrait" | "squarish"
  lang: 'it',

  // Other available params (not set by default):
  // page        : (int)    — page number, default 1
  // color       : (string) — "black_and_white" | "black" | "white" | "yellow" |
  //                          "orange" | "red" | "purple" | "magenta" |
  //                          "green" | "teal" | "blue"
  // collections : (string) — comma-separated collection IDs to narrow results
};

function getUnsplashDataUrl(query, params = {}) {
  const searchParams = new URLSearchParams({
    client_id: access_key,
    query,
    ...defaultParams,
    ...params,
  });
  return `${UNSPLASH_SEARCH_API}?${searchParams}`;
}

async function fetchPhotos(query, params = {}) {
  const url = getUnsplashDataUrl(query, params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
  return res.json(); // { total, total_pages, results: [...] }
}

// ---- State ----

let currentQuery = '';
let currentPage = 1;
const photoCache = new Map();      // photo id -> full photo object for the current page
let allSelectedPhotos = [];        // accumulates confirmed photos across pages / searches

// ---- Dialog ----

function buildDialog() {
  if (document.getElementById('unsplash-dialog')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="unsplash-dialog" style="width:90vw;max-width:1200px;max-height:90dvh;border:none;border-radius:.5rem;padding:0;box-shadow:0 .5rem 2rem rgba(0,0,0,.3);display:flex;flex-direction:column;overflow:hidden">
      <div class="d-flex flex-column" style="flex:1;min-height:0">
        <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h5 class="m-0">Choose a photo from Unsplash</h5>
          <button id="dialog-close" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="overflow-auto p-3 flex-grow-1">
          <div id="unsplash-grid" class="row g-2"></div>
        </div>
        <div class="d-flex align-items-center justify-content-between p-3 border-top gap-3 flex-wrap">
          <div class="d-flex align-items-center gap-2">
            <button id="unsplash-prev" class="btn btn-sm btn-outline-secondary" disabled>&larr; Prev</button>
            <small id="unsplash-count" class="text-muted"></small>
            <button id="unsplash-next" class="btn btn-sm btn-outline-secondary" disabled>Next &rarr;</button>
          </div>
          <div class="d-flex gap-2">
            <button id="unsplash-confirm" class="btn btn-primary" disabled>Confirm selection</button>
            <button id="unsplash-done" class="btn btn-secondary">Done</button>
          </div>
        </div>
      </div>
    </dialog>
  `);

  document.getElementById('dialog-close').addEventListener('click', closeDialog);
  document.getElementById('unsplash-done').addEventListener('click', doneAndClose);
  document.getElementById('unsplash-confirm').addEventListener('click', confirmSelection);
  document.getElementById('unsplash-prev').addEventListener('click', () => loadPage(currentPage - 1));
  document.getElementById('unsplash-next').addEventListener('click', () => loadPage(currentPage + 1));

  // close on backdrop click
  document.getElementById('unsplash-dialog').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDialog();
  });
}

function openDialog() {
  const dialog = document.getElementById('unsplash-dialog');
  dialog.style.display = 'flex'; // restore display overridden by inline style
  dialog.showModal();
}

function closeDialog() {
  const dialog = document.getElementById('unsplash-dialog');
  dialog.close();
  dialog.style.display = 'none'; // inline display:flex would keep it visible after close()
}

function doneAndClose() {
  if (document.querySelectorAll('.unsplash-card.selected').length) confirmSelection();
  closeDialog();
}

function renderPhotos(results) {
  const grid = document.getElementById('unsplash-grid');
  grid.innerHTML = '';
  photoCache.clear();

  if (!results.length) {
    grid.innerHTML = '<p class="text-muted">No results found.</p>';
    return;
  }

  results.forEach(photo => {
    photoCache.set(photo.id, photo);

    const caption  = photo.alt_description || photo.description || '';
    const location = photo.location?.name || photo.location?.city || '';

    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <figure class="m-0 unsplash-card" data-id="${photo.id}"
              style="cursor:pointer;border:3px solid transparent;border-radius:.375rem;overflow:hidden">
        <img src="${photo.urls.small}" alt="${caption}"
             class="w-100" style="object-fit:cover;height:140px;display:block">
        <figcaption class="p-1 bg-white" style="font-size:.75rem">
          <span class="fw-semibold text-truncate d-block">${photo.user.name}</span>
          ${caption  ? `<span class="text-truncate d-block">${caption}</span>` : ''}
          ${location ? `<span class="text-muted text-truncate d-block">${location}</span>` : ''}
        </figcaption>
      </figure>
    `;
    col.querySelector('.unsplash-card').addEventListener('click', toggleSelect);
    grid.appendChild(col);
  });
}

function updatePagination(data, page) {
  document.getElementById('unsplash-count').textContent =
    `Page ${page} of ${data.total_pages} · ${data.total.toLocaleString()} results`;
  document.getElementById('unsplash-prev').disabled = page <= 1;
  document.getElementById('unsplash-next').disabled = page >= data.total_pages;
  currentPage = page;
}

function toggleSelect(e) {
  const card = e.currentTarget;
  const selected = card.classList.toggle('selected');
  card.style.borderColor = selected ? 'var(--bs-primary)' : 'transparent';
  const count = document.querySelectorAll('.unsplash-card.selected').length;
  document.getElementById('unsplash-confirm').disabled = count === 0;
}

function confirmSelection() {
  const newlySelected = [...document.querySelectorAll('.unsplash-card.selected')]
    .map(card => photoCache.get(card.dataset.id));

  // merge into accumulator, deduplicate by id
  newlySelected.forEach(photo => {
    if (!allSelectedPhotos.find(p => p.id === photo.id)) {
      allSelectedPhotos.push(photo);
    }
  });

  // deselect current page cards
  document.querySelectorAll('.unsplash-card.selected').forEach(card => {
    card.classList.remove('selected');
    card.style.borderColor = 'transparent';
  });
  document.getElementById('unsplash-confirm').disabled = true;

  console.log('All selected photos:', allSelectedPhotos); // eslint-disable-line no-console
  writeResult(allSelectedPhotos);
}

function writeResult(photos) {
  const result = document.getElementById('result');
  if (!result) return;

  result.innerHTML = photos.map(photo => {
    const caption  = photo.alt_description || photo.description || '';
    const location = photo.location?.name || photo.location?.city || '';

    return `
      <div class="card mb-3 mt-4">
        <div class="row g-0">
          <div class="col-md-2">
            <img src="${photo.urls.small}" class="img-fluid rounded-start h-100"
                 alt="${caption}" style="object-fit:cover">
          </div>
          <div class="col-md-10">
            <div class="card-body py-2">
              <dl class="row mb-0 small">
                <dt class="col-sm-3">Photo URL</dt>
                <dd class="col-sm-9 text-break">
                  <a href="${photo.urls.regular}" target="_blank" rel="noopener">${photo.urls.regular}</a>
                </dd>

                <dt class="col-sm-3">Unsplash page</dt>
                <dd class="col-sm-9 text-break">
                  <a href="${photo.links.html}" target="_blank" rel="noopener">${photo.links.html}</a>
                </dd>

                <dt class="col-sm-3">Author</dt>
                <dd class="col-sm-9">
                  <a href="${photo.user.links.html}" target="_blank" rel="noopener">${photo.user.name}</a>
                </dd>

                ${caption  ? `<dt class="col-sm-3">Description</dt><dd class="col-sm-9">${caption}</dd>` : ''}
                ${location ? `<dt class="col-sm-3">Location</dt><dd class="col-sm-9">${location}</dd>` : ''}
              </dl>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ---- Search / pagination ----

async function loadPage(page) {
  const grid = document.getElementById('unsplash-grid');
  grid.innerHTML = '<p class="text-muted">Loading…</p>';
  document.getElementById('unsplash-confirm').disabled = true;
  document.getElementById('unsplash-prev').disabled = true;
  document.getElementById('unsplash-next').disabled = true;

  try {
    const data = await fetchPhotos(currentQuery, { page });
    console.log('Unsplash JSON:', data); // eslint-disable-line no-console
    renderPhotos(data.results);
    updatePagination(data, page);
  } catch (err) {
    grid.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    console.error(err); // eslint-disable-line no-console
  }
}

async function search() {
  const query = document.getElementById('key').value.trim();
  if (!query) return;

  currentQuery = query;
  allSelectedPhotos = [];
  buildDialog();
  document.querySelector('#unsplash-dialog h5').textContent =
    `Choose a photo from Unsplash (${query})`;
  openDialog();
  await loadPage(1);
}

document.getElementById('search-btn').addEventListener('click', search);
document.getElementById('key').addEventListener('keydown', e => {
  if (e.key === 'Enter') search();
});
