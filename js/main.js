const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLink = document.querySelectorAll('.nav-link');
const form = document.querySelector('form');
const input = document.getElementById('input-field');
const linkContainer = document.querySelector('.links');

const API_URL = 'https://api.shrtco.de/v2/';

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

form.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const inputUrlValue = input.value;
    const result = await fetch(`${API_URL}shorten?url=${inputUrlValue}`);
    // const result = await fetch(`https://api.shrtco.de/v2/shorten?url=${inputUrlValue}`)
    const shortedResult = await result.json();
    console.log(shortedResult);
    linkContainer.innerHTML = 
    `
        <div class="link">
            <p class="title-link-origin">${shortedResult.result.original_link}</p>
            <div class="shorted">
            <p class="title-link-shorted">${shortedResult.result.full_short_link
            }</p>
            <button class="btn-copy">Copy</button>
            </div>
        </div>
    `;
})

