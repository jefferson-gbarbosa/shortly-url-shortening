const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLink = document.querySelectorAll('.nav-link');
const modal = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal-container');
const input = document.querySelector('.input-field');
const linkContainer = document.querySelector('.links');
const btnSubmit = document.querySelector('.btn-submit')
const errorText = document.querySelector('.error-text');
const btnModal = document.querySelector('.btn-modal');

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
async function fetchData() {
  try {
  
      const response = await fetch("https://url-shortener-xve9.onrender.com/urls"); 
      
      if (!response.status) {
          throw new Error('Network response was not ok');
      }
      const res = await response.json();
     
      const data = res.splice(0,3)
      console.log(data)
      createResult(data)   
  } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
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
    
      const response = await fetch("https://url-shortener-xve9.onrender.com/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: inputUrlValue }),
      })

      const data = await response.json();
    
      checkNumbersResults([data]);
      closeModalResults();
  }
}

async function deleteItem(key_url) {
  try {
    const response = await fetch(`https://url-shortener-xve9.onrender.com/url/${key_url}`, {
      method: 'DELETE', 
    });
    if (response.status === 204) {
      console.log('Item excluído com sucesso, sem conteúdo adicional.');
    } else {
      console.log('Resposta inesperada:', response.status);
    }
  } catch (error) {
    console.error('Erro ao excluir item:', error);
  }
}

function createResult(data){
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
 
    const div = document.createElement('div');
    div.classList.add('link');
    div.innerHTML = 
    `
        <p class="title-link-origin">${element.target_url}</p>
        <div class="shorted">
        <p class="title-link-shorted">${element.url}</p>
        <button class="btn-copy button">Copy</button>
        <button class="btn-delete button">Delete</button>
        </div>
    `;
    linkContainer.appendChild(div);
  
    const copyButtonArray = document.querySelectorAll('.btn-copy');
    copyButtonArray.forEach(button => {
        button.addEventListener('click', copyUrl);
    })
    const deleteButtonArray = document.querySelectorAll('.btn-delete');
    deleteButtonArray.forEach(button => {
      button.addEventListener('click', removeElement)
    })
  } 
}
// copy the shortened url
function copyUrl({ target }){
  const copyButton = target
  const shortUrl = copyButton.previousElementSibling.innerText;

  navigator.clipboard.writeText(shortUrl);

  copyButton.innerText = 'Copied!';
  copyButton.style.backgroundColor = 'hsl(260, 8%, 14%)';

  setTimeout(() => {
      copyButton.innerText = 'Copy';
      copyButton.style.backgroundColor = 'hsl(180, 66%, 49%)';
  }, 2000)
}

// remove element modal
function removeElement(){ 
  let no = linkContainer.querySelector(".link");
  let shorted = no.querySelector('.shorted')
  let txtFirstChild = shorted.firstElementChild.textContent

  deleteItem(txtFirstChild)
  
  if(no.parentNode){
      no.parentNode.removeChild(no);
  }
}

// function create modal
function createResultModal(){
  modal.classList.add('active');
}

// function close modal
function closeModalResults(){
  setTimeout(() => {
    modal.classList.remove('active');
  }, 2000);
}
// function to check the number of existing results and take appropriate action.
function checkNumbersResults(data) {
  if (linkContainer.children.length === 3) {
    createResultModal()
  } else {
    createResult(data);
  }
}
//EVENTS
//submit form
btnSubmit.addEventListener("click", urlShortener)
// call the function to check local storage as soon as the page is loaded
window.addEventListener('load', fetchData);






