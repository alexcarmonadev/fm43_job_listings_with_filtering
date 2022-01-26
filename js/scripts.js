const mainTopCard = document.querySelector('.main__top-card');
const filters = document.querySelector('.filters');
const mainCardsBox = document.querySelector('.main__cards-box');
let filterList = [];

function getData() {
  return new Promise((resolve, reject) => {
    fetch('./data.json')
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function checkFilter(compareList) {
  return filterList.every((e) => compareList.indexOf(e) >= 0);
}

async function mainCardsRender() {
  mainCardsBox.innerHTML = '';
  const data = await getData();
  data.forEach((e) => {
    const elementFilters = [
      e.role,
      e.level,
      ...(e.languages || []),
      ...(e.tools || []),
    ];
    if (filterList.length === 0 || checkFilter(elementFilters)) {
      let filterContent = '';
      elementFilters.forEach((filter) => {
        filterContent += `<div class="filter" onclick="filter(this)" data-value="${filter}">${filter}</div>`;
      });
      const infoNew = e.new ? `<div class="tag tag--green">New!</div>` : '';
      const infoFeatured = e.featured
        ? `<div class="tag tag--black">Featured</div>`
        : '';
      mainCardsBox.innerHTML += `<div class="card">
        <img class="card__img" src="${e.logo}" alt="logo-${e.company}"/>
        <div class="card-container">
          <div class="info">
            <div class="info-header">
              <h2 class="info-company">${e.company}</h2>
              ${infoNew}
              ${infoFeatured}
            </div>
            <h3 class="info-position">${e.position}</h3>
            <div class="info-status">
              <div class="status">${e.postedAt} <span class="dot">·</span>
              </div>
              <div class="status">${e.contract} <span class="dot">·</span>
              </div>
              <div class="status">${e.location}</div>
            </div>
          </div>
          <div class="filters filters--main">${filterContent}</div>
        </div>
      </div>`;
    }
  });
}

function mainTopCardRender() {
  if (filterList.length === 0) {
    mainTopCard.classList.remove('visible');
    mainTopCard.classList.add('hidden');
  } else {
    mainTopCard.classList.remove('hidden');
    mainTopCard.classList.add('visible');
  }
  const mainTopCardContent = filterList.map(
    (filter) =>
      `<div class="filter-btn" data-value="${filter}" onclick="filter(this)"><p>${filter}</p><div><i class="fas fa-times"></i></div></div>`
  );
  filters.innerHTML = '';
  mainTopCardContent.forEach((e) => {
    filters.innerHTML += e;
  });
  mainCardsRender();
}

function filter(e) {
  const filterValue = e.getAttribute('data-value');

  if (filterList.includes(filterValue)) {
    filterList = filterList.filter((filter) => filter !== filterValue);
    mainTopCardRender();
  } else {
    filterList.push(filterValue);
    mainTopCardRender();
  }
}

document.querySelector('.clear').addEventListener('click', () => {
  filterList = [];
  mainTopCardRender();
});

(function () {
  mainCardsRender();
})();
