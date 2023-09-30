const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLink = document.querySelectorAll('.nav-link');
const form = document.querySelector('form');
const input = document.querySelector('.input-field');
const linkContainer = document.querySelector('.links');
const errorText = document.querySelector('.error-text');

const API_URL = 'https://api.shrtco.de/v2/';

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
//SUBMIT FORM
form.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const inputUrlValue = input.value;
    if(inputUrlValue === ""){
        input.classList.add('error');
        errorText.style.display = "block";

    }else{
        input.classList.remove('error');
        errorText.style.display = "none";

        const response = await fetch(`${API_URL}shorten?url=${inputUrlValue}`);
        const json = await response.json();
        const originalLink = json.result.original_link;
        const shortLink = json.result.full_short_link;

        check(shortLink,originalLink);
        createResult(shortLink, originalLink);
        console.log(json);
    }
   
})


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
    console.log(arrayStorage)
}

function check(shortLink, originalLink){
    const linksObject = {shortLink, originalLink};
    // Atualiza o armazenamento local com o novo objeto de links
    sendLinksStorage(linksObject);
}




