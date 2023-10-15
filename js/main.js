const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLink = document.querySelectorAll('.nav-link');
const modal = document.querySelector('.modal')
const input = document.querySelector('.input-field');
const linkContainer = document.querySelector('.links');
const modalContent = document.querySelector('.modal-content');
const btnSubmit = document.querySelector('.btn-submit')
const errorText = document.querySelector('.error-text');
const btnModal = document.querySelector('.btn-modal');

// const API_URL = 'https://api.shrtco.de/v2/';
// const API_URL = '4ae1a68b796d4986acafc09f191046f2'
const resultsArray = [];
let arrayStorage;

// FUNCTIONS

//MENU SHOW//
//validate if constant exists //
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.toggle('show-menu');
    })
}
// REMOVE MENU MOBILE
// when we click on each nav-link,we remove the show-menu
function linkAction(){
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click',linkAction));
// create results on screen
function createResult(shortLink, originalLink){
    const div = document.createElement('div');
    div.classList.add('link');
    div.innerHTML = 
    `
        <p class="title-link-origin">${originalLink}</p>
        <div class="shorted">
        <p class="title-link-shorted">${shortLink}</p>
        <button class="btn-copy button">Copy</button>
        </div>
    `;
    linkContainer.appendChild(div);
    resultsArray.unshift(originalLink);
    const copyButtonArray = document.querySelectorAll('.btn-copy');
    copyButtonArray.forEach(button => {
        button.addEventListener('click', copyUrl);
    })
}
// copy the shortened url
function copyUrl(){
  const copyButton = document.querySelector('.btn-copy')
  const shortUrl = copyButton.previousElementSibling.innerText;
  navigator.clipboard.writeText(shortUrl);

  copyButton.innerText = 'Copied!';
  copyButton.style.backgroundColor = 'hsl(260, 8%, 14%)';

  setTimeout(() => {
      copyButton.innerText = 'Copy';
      copyButton.style.backgroundColor = 'hsl(180, 66%, 49%)';
  }, 2000)
}

// returns data from local storage, converted back to an array.
// if no data is found in Local Storage, returns an empty array.
const getLocalStorage = () => JSON.parse(localStorage.getItem('links')) ?? [];
// stores an array in local storage, converting it to a JSON string.
const setLocalStorage = () => localStorage.setItem('links', JSON.stringify(arrayStorage));

// function to send a links object to local storage
function sendLinksStorage(linksObject) {
    arrayStorage = getLocalStorage();
    arrayStorage.unshift(linksObject);
    setLocalStorage();
}
// function to delete links from local storage
function deleteLinksStorage(index) {
  arrayStorage = getLocalStorage();
  arrayStorage.splice(index, 1);
  setLocalStorage();
}
// function to get links from local storage
function getLinksStorage() {
    if(window.localStorage.length) {
      arrayStorage = getLocalStorage();
      arrayStorage.forEach((linksObject) => {
        const { shortLink, originalLink } = linksObject;
        createResult(shortLink, originalLink);
      })
    }
}
// function create modal
function createResultModal(){
  modal.classList.add('active');
  btnModal.innerHTML = '<i class="ri-delete-bin-5-line"></i>'; 
}
// remove element modal
function removeElement(){ 
  const removeResult = document.querySelectorAll('.modal-links');
  resultsArray.splice(removeResult, 1);
  deleteLinksStorage(removeResult);
  let no = linkContainer.querySelector(".link");
  if(no.parentNode){
      no.parentNode.removeChild(no);
  }
  btnModal.innerHTML = '<i class="ri-check-fill"></i>';
  closeModalResults();
}
// function close modal
function closeModalResults(){
  setTimeout(() => {
    modal.classList.remove('active');
  }, 2000);
}
// function to check the number of existing results and take appropriate action.
function checkNumbersResults(shortLink, originalLink) {
    if (resultsArray.length === 3) {
      createResultModal()
    } else {
      createResult(shortLink, originalLink);
      const linksObject = {shortLink, originalLink};
      sendLinksStorage(linksObject);
    }
}
// function shortener url
async function urlShortener(event) {
    event.preventDefault();
    const inputUrlValue = input.value;
    if(inputUrlValue === ""){
        input.classList.add('error');
        errorText.style.display = "block";
    }else{
        input.classList.remove('error');
        errorText.style.display = "none";

        // const response = await fetch(`${API_URL}shorten?url=${inputUrlValue}`);
        // const json = await response.json();
        // const originalLink = json.result.original_link;
        // const shortLink = json.result.full_short_link;
         //headers
        let headers = {
              "Content-Type": "application/json",
              "apiKey": "4ae1a68b796d4986acafc09f191046f2" //colocar api key do rebrand.ly
        }

          //dados
        let linkRequest = {
              destination: inputUrlValue,
              domain: { fullName: "rebrand.ly" }
        }

        // const response = await fetch(`${API_URL}shorten?url=${inputUrlValue}`);
        const response = await fetch("https://api.rebrandly.com/v1/links", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(linkRequest)
        });
        const json = await response.json();
        console.log(json)
        // const originalLink = json.result.original_link;
        // const shortLink = json.result.full_short_link;

        const originalLink = json.destination;
        const shortLink = json.shortUrl;

        checkNumbersResults(shortLink,originalLink);
    }
}

//EVENTS

// remove element to modal
btnModal.addEventListener("click",removeElement)
//submit form
btnSubmit.addEventListener("click", urlShortener)
// call the function to check local storage as soon as the page is loaded
window.addEventListener('load', getLinksStorage);




