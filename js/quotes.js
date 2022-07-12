const charactersURL = "https://www.breakingbadapi.com/api/characters";
const allQuotesURL = "https://www.breakingbadapi.com/api/quotes";
const authorQuotesURL = "https://www.breakingbadapi.com/api/quote?author=";

const charactersSelect = document.getElementById('characters')
const blockquotes = document.getElementById('blockquotes')
const characterPicPlace = document.getElementById('characterPic')
const allQuotesButton = document.getElementById('allQuotesButton')

let characterPictureMap = new Map();

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction()
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function goTopFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

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

function getCharactersList() {
  getData('GET', charactersURL)
    .then((data) => {
      data.forEach((element) => {
        characterPictureMap.set(element.name, element.img);
        let option = document.createElement('option');
        option.innerText = element.name + " (" + element.nickname + ")";
        option.value = element.name;
        charactersSelect.appendChild(option);
      })
    })
    .catch(err => console.log(err))
}

function getQuotes(quotesURL) {
  while (blockquotes.firstChild) {
    blockquotes.firstChild.remove();
  }
  getData('GET', quotesURL)
    .then((data) => {
      data.forEach((element) => {
        let blockquote = document.createElement('blockquote');
        blockquote.classList.add('my-1');
        let text = document.createElement('p');
        text.textContent = element.quote;
        let footer = document.createElement('footer');
        let cite = document.createElement('cite');
        cite.textContent = " — " + element.author;
        blockquote.appendChild(text);
        footer.appendChild(cite);
        blockquote.appendChild(footer);
        blockquotes.appendChild(blockquote);
      })
    })
    .catch(err => console.log(err))
}

charactersSelect.addEventListener('change', (event) => {
  let URL = allQuotesURL;
  if (event.target.value !== "0") {
    let namePair = event.target.value.split(' ');
    URL = authorQuotesURL + namePair.join('+');
    characterPicPlace.src = characterPictureMap.get(event.target.value);
  } else {
    characterPicPlace.src = "img/logo.png";
  }
  getQuotes(URL);
})

function getRandomQuote() {
  allQuotesButton.style.display = "block";
  let url
  let fullName = charactersSelect.options[charactersSelect.selectedIndex].value.split(' ');
  if (charactersSelect.options[charactersSelect.selectedIndex].value === '0')
    url = "https://www.breakingbadapi.com/api/quote/random";
  else
    url = "https://www.breakingbadapi.com/api/quote/random?author=" + fullName.join('+');
  getQuotes(url);
}

function displayAllQuotes() {
  allQuotesButton.style.display = "none";
  let url
  let fullName = charactersSelect.options[charactersSelect.selectedIndex].value.split(' ');
  if (charactersSelect.options[charactersSelect.selectedIndex].value === '0')
    url = "https://www.breakingbadapi.com/api/quotes";
  else
    url = authorQuotesURL + fullName.join('+');
  getQuotes(url);
}
