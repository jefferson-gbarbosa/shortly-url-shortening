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

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.toggle('show-menu');
    })
}
// REMOVE MENU MOBILE
// When we click on each nav-link,we remove the show-menu
function linkAction(){
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click',linkAction));

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
    // Adiciona o link original ao início do array 'resultsArray'
    resultsArray.unshift(originalLink);
    const copyButtonArray = document.querySelectorAll('.btn-copy');
    copyButtonArray.forEach(button => {
        button.addEventListener('click', copyUrl);
    })
}

function copyUrl(){
    const copyButton = document.querySelector('.btn-copy')
    const shortUrl = copyButton.previousElementSibling.innerText;
    console.log(shortUrl)

    // Copia o URL curto para a área de transferência do navegador
    navigator.clipboard.writeText(shortUrl);

    // Altera o texto e o estilo do botão 'Copy' para indicar que a cópia foi realizada com sucesso
    copyButton.innerText = 'Copied!';
    copyButton.style.backgroundColor = 'hsl(260, 8%, 14%)';

    // Define um atraso de 2 segundos antes de restaurar o texto e estilo original do botão
    setTimeout(() => {
        copyButton.innerText = 'Copy';
        copyButton.style.backgroundColor = 'hsl(180, 66%, 49%)';
    }, 2000)
}

// Retorna os dados do armazenamento local, convertidos de volta em um array.
// Se nenhum dado for encontrado na Local Storage, retorna um array vazio.
const getLocalStorage = () => JSON.parse(localStorage.getItem('links')) ?? [];
// Armazena um array no armazenamento local, convertendo-o em uma string JSON.
const setLocalStorage = () => localStorage.setItem('links', JSON.stringify(arrayStorage));

// Função para enviar um objeto de links para o armazenamento local
function sendLinksStorage(linksObject) {
    arrayStorage = getLocalStorage();
    arrayStorage.unshift(linksObject);
    setLocalStorage();
}

// Função para excluir links do armazenamento local
function deleteLinksStorage(index) {
  arrayStorage = getLocalStorage();
  arrayStorage.splice(index, 1);
  setLocalStorage();
  // console.log(arrayStorage)
}

function getLinksStorage() {
    if(window.localStorage.length) {
      arrayStorage = getLocalStorage();
      // Itera sobre cada objeto de links no array
      arrayStorage.forEach((linksObject) => {
        // Extrai as propriedades 'shortLink' e 'originalLink' do objeto
        const { shortLink, originalLink } = linksObject;
        createResult(shortLink, originalLink);
      })
    }
}

function createResultModal(){
  modal.classList.add('active');
  btnModal.innerHTML = '<i class="ri-delete-bin-5-line"></i>'; 
}
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
 
function closeModalResults(){
  setTimeout(() => {
    modal.classList.remove('active');
  }, 2000);
}
// Função para verificar a quantidade de resultados existentes e executar a ação apropriada.
function checkNumbersResults(shortLink, originalLink) {
    if (resultsArray.length === 3) {
      // Se já existem 3 resultados, abre o modal para o usuário
      createResultModal()
    } else {
      // Cria um novo resultado
      createResult(shortLink, originalLink);
      const linksObject = {shortLink, originalLink};
      // Atualiza o armazenamento local com o novo objeto de links
      sendLinksStorage(linksObject);
    }
  }
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
btnModal.addEventListener("click",removeElement)
//SUBMIT FORM
btnSubmit.addEventListener("click", urlShortener)
// Chama a função para verificar o armazenamento local assim que a página é carregada
window.addEventListener('load', getLinksStorage);




