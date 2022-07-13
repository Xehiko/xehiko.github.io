const charactersURL = "https://www.breakingbadapi.com/api/characters";

const charactersCards = document.getElementById('charactersCards')
const paginationList = document.getElementById('paginationList')

const cardsOnPage = 12; // карточек на странице
const totalCharacters = 62; // всего персонажей

let currentPage = 1;  // текущая страница
let isSearch = false;   // поиск по имени не ведется

function getData(method, url) {
  return fetch(url).then(response => {
    return response.json();
  })
}

function postData(method, url, body = null) {
  const headers = {
    'Content-Type': 'application/json'
  }
  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers
  }).then(response => {
    return response.json();
  })
}

async function loadCards(url) {
  if (!isSearch)
    url = url + "?limit="+cardsOnPage+"&offset=" + (currentPage - 1) * cardsOnPage; // limit карт для текущей страницы
  await getData('GET', url)
    .then((data) => {
      removeCards();
      data.forEach((element) => { // создаем карточки
        let column = document.createElement('div'); // расположение карточки
        column.classList.add('col-lg-4', 'col-sm-6');
        let scene = document.createElement('div');
        scene.classList.add('scene', 'scene--card');
        let card = document.createElement('div');
        card.classList.add('card');


        let card__face__front = document.createElement('div');  // передняя часть карточки
        card__face__front.classList.add('card__face', 'card__face--front');
        let img = document.createElement('img');
        img.src = element.img;
        img.classList.add('card-img-top');
        img.alt = "cardPicture";
        img.setAttribute('draggable', 'false');
        let cardTitle = document.createElement('div');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = element.name;
        card__face__front.appendChild(img);
        card__face__front.appendChild(cardTitle);


        let card__face__back = document.createElement('div'); // карточка сзади (информация о персонаже)
        card__face__back.classList.add('card__face', 'card__face--back');
        let card_characterInfo = document.createElement('div');
        card_characterInfo.classList.add('card-characterInfo');

        let card_line_name = document.createElement('div'); // создаем отдельные поля
        card_line_name.classList.add('card-text-line');
        card_line_name.innerText = "Имя: " + element.name + " (" + element.nickname + ")";
        let card_line_birthday = document.createElement('div');
        card_line_birthday.classList.add('card-text-line');
        card_line_birthday.innerText = "Дата рождения: " + element.birthday;
        let card_line_occupation = document.createElement('div');
        card_line_occupation.classList.add('card-text-line');
        card_line_occupation.innerText = "Род занятий: " + element.occupation;
        let card_line_status = document.createElement('div');
        card_line_status.classList.add('card-text-line');
        card_line_status.innerText = "Статус: " + element.status;
        let card_line_appearance = document.createElement('div');
        card_line_appearance.classList.add('card-text-line');
        card_line_appearance.innerText = "Появление в сезонах: " + element.appearance;
        let card_line_portrayed = document.createElement('div');
        card_line_portrayed.classList.add('card-text-line');
        card_line_portrayed.innerText = "Актёр/Актриса: " + element.portrayed;

        // собираем всё в одно целое
        card_characterInfo.appendChild(card_line_name);
        card_characterInfo.appendChild(card_line_birthday);
        card_characterInfo.appendChild(card_line_occupation);
        card_characterInfo.appendChild(card_line_status);
        card_characterInfo.appendChild(card_line_appearance);
        card_characterInfo.appendChild(card_line_portrayed);

        card__face__back.appendChild(card_characterInfo);

        card.appendChild(card__face__front);
        card.appendChild(card__face__back);
        scene.appendChild(card);
        column.appendChild(scene);
        charactersCards.appendChild(column);  // добавили карточку
      })
    })
    .catch(err => console.log(err))

  let cards = document.querySelectorAll('.card'); // обработка события клика для разворота карты
  cards.forEach((card) => {
    card.addEventListener('click', function () {
      card.classList.toggle('is-flipped');
    })
  })
}

async function createPagination() {
  await loadCards(charactersURL);
  if (!isSearch && charactersCards.childElementCount) {  // если не идёт поиск по имени и карточек не 0
    let previousPageItem = document.createElement('li');  // ячейка "предыдущая"
    previousPageItem.classList.add('page-item');
    if (currentPage === 1) {  // если активна первая страница, кнопка "предыдущая" не активна
      previousPageItem.classList.add('disabled');
    }
    let aPrevious = document.createElement('a');
    aPrevious.classList.add('page-link');
    aPrevious.setAttribute('href', '#');
    aPrevious.setAttribute('tabindex', '-1');
    aPrevious.innerText = "Предыдущая";
    previousPageItem.appendChild(aPrevious);
    paginationList.appendChild(previousPageItem);

    for (let i = 1; i < Math.ceil(totalCharacters / cardsOnPage) + 1; i++) {  // список страниц
      let currentPageItem = document.createElement('li');
      currentPageItem.classList.add('page-item');
      if (currentPage === i)
        currentPageItem.classList.add('active');
      let aCurrent = document.createElement('a');
      aCurrent.classList.add('page-link');
      aCurrent.setAttribute('href', '#');
      aCurrent.innerText = i.toString();
      currentPageItem.appendChild(aCurrent);
      paginationList.appendChild(currentPageItem);

      currentPageItem.addEventListener('click', function (event) {  // обработка клика
        if (currentPage.toString() !== event.target.innerText) {  // если кликнули не на текущую страницу
          currentPage = event.target.innerText;
          if (currentPage === '1') {  // если кликнули на первую страницу
            previousPageItem.classList.add('disabled');
            nextPageItem.classList.remove('disabled')
          } else if (currentPage === Math.ceil(totalCharacters / cardsOnPage).toString()) // если кликнули на последнюю страницу
          {
            nextPageItem.classList.add('disabled');
            previousPageItem.classList.remove('disabled');
          }
          else
          {
            previousPageItem.classList.remove('disabled');
            nextPageItem.classList.remove('disabled');
          }
          updatePagination(); // обновляем пагинацию (выделяем активную страницу)
          loadCards(charactersURL); // загружаем карточки для новой страницы
        }
      })
    }

    let nextPageItem = document.createElement('li');  // пунтк "следующая"
    nextPageItem.classList.add('page-item');
    if (currentPage === Math.ceil(totalCharacters / cardsOnPage).toString()) {  // если последняя страница
      nextPageItem.classList.add('disabled');
    }
    let aNext = document.createElement('a');
    aNext.classList.add('page-link');
    aNext.setAttribute('href', '#');
    aNext.innerText = "Следующая";
    nextPageItem.appendChild(aNext);
    paginationList.appendChild(nextPageItem);

    previousPageItem.addEventListener('click', function () { // обработка клика на "следующая"
      if (currentPage !== 1 && currentPage !== '1') {
        currentPage = currentPage - 1;
        if (currentPage === 1) {
          previousPageItem.classList.add('disabled');
        }
        nextPageItem.classList.remove('disabled');
        updatePagination();
        loadCards(charactersURL);
      }
    })

    nextPageItem.addEventListener('click', function () {
      if (currentPage !== Math.ceil(totalCharacters / cardsOnPage) && currentPage !== Math.ceil(totalCharacters / cardsOnPage).toString()) {
        currentPage = parseInt(currentPage) + 1;
        if (currentPage === Math.ceil(totalCharacters / cardsOnPage)) {
          nextPageItem.classList.add('disabled');
        }
        previousPageItem.classList.remove('disabled');
        updatePagination();
        loadCards(charactersURL);
      }
    })
  }
}

function updatePagination() {
  for (let i = 0; i < paginationList.childElementCount; i++)
  {
    paginationList.children[i].classList.remove('active');
    if (paginationList.children[i].innerText === currentPage.toString()) {  // отмечаем текущую страницу как "active"
      paginationList.children[i].classList.add('active');
    }
  }
}

function removeCards() {
  charactersCards.innerHTML=""  // убираем карточки
}

document.getElementById('findByNameField').addEventListener('input', (event) => { // поиск по имени
  let url;
  if (event.target.value === "") {  // если поле пустое
    isSearch = false;
    url = charactersURL;
    currentPage = 1;
    createPagination();
  } else {
    paginationList.innerHTML = "";
    isSearch = true;
    url = charactersURL + "?name=" + event.target.value;
  }
  loadCards(url);
})
