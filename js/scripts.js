
var users = []
const fullUsers = []
var dataSet;

class User {
    constructor(firstName, lastName, image, email, city, state, street, postcode, cell, dob) {
        this.image = image;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.city = city;
        this.state = state;
        this.street = street; 
        this.postcode = postcode; 
        this.cell = cell; 
        this.dob = new Date(dob);
    }

    search(searchString){

        if((this.firstName + ' ' + this.lastName).toLowerCase().indexOf(searchString.toLowerCase()) >= 0){
            return true;
        }
        return false;
    }

}

function fetchUsers() {
    fetch('https://randomuser.me/api/?results=12')
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data.results.length; i += 1){
            let result = data.results[i];
            let firstName = result.name.first;
            let lastName = result.name.last;
            let email = result.email;
            let image = result.picture.medium;
            let city = result.location.city;
            let state = result.location.state;
            let street = result.location.street;
            let postcode = result.location.postcode;
            let cell = result.cell;       
            let dob = result.dob.date;     
            console.log(`First name: ${firstName} Last name: ${lastName} image: ${image} email: ${email}`);
            users.push(new User(firstName, lastName, image, email, city, state, street, postcode, cell, dob));
            addUser(users[i]);
            fullUsers.push(users[i]);
        }
        dataSet = data;
        //console.log(users);
    });
}

function clearGallery(){
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = "";
}

function addUser(user){
    const gallery = document.getElementById('gallery');
    const card = document.createElement('div');
    const cardInfoContainer = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${user.image}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.firstName} ${user.lastName}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.city} ${user.state}</p>
        </div>
        `;
    gallery.appendChild(card);
    card.addEventListener('click', () => {addModal(user)});
}

function addSearchContainer() {
    const searchContainer = document.getElementsByClassName('search-container')[0];
    const searchForm = document.createElement('form');
    const searchBox = document.createElement('input');
    const searchButton = document.createElement('input');

    searchForm.action = '#';
    searchForm.method = 'get';

    searchBox.type = 'search';
    searchBox.id = 'search-input';
    searchBox.className = 'search-input';
    searchBox.placeholder = 'Search...';

    searchButton.type = 'submit';
    searchButton.value = 'Search';
    searchButton.id = 'search-submit';
    searchButton.class = 'search-submit';

    searchForm.appendChild(searchBox);
    searchForm.appendChild(searchButton);

    searchContainer.appendChild(searchForm);

    searchButton.addEventListener('click', () => {
        clearGallery();
        let searchString = searchBox.value;
        users = [];
        for (let i = 0; i < fullUsers.length; i += 1){
            let user = fullUsers[i];
            if (user.search(searchString)){
                users.push(user);
                addUser(user);
            }
        }
    });







   /* <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
     </form>*/

}
function addModal(user){
    const endIndex = users.length - 1;
    const currentIndex = users.indexOf(user);
    const oldModal = document.getElementsByClassName('modal-container')[0];
    if(oldModal){
        oldModal.remove();
    }
    const modalContainer = document.createElement('div');
    const modal = document.createElement('div');
    const modalInfoContainer = document.createElement('div');
    const modalButtonContainer = document.createElement('div');
    const nextButton = document.createElement('button');
    const prevButton = document.createElement('button');
    const closeButton = document.createElement('button');
    
    modalContainer.className = 'modal-container';
    modal.className = 'modal';
    modalInfoContainer.className = 'modal-info-container';
    modalButtonContainer.className = 'modal-btn-container';
    closeButton.id = 'modal-close-btn';
    closeButton.className = 'modal-close.btn';
    closeButton.innerHTML = '<strong>X</strong>'
    prevButton.id = 'modal-prev';
    prevButton.class = 'modal-prev btn';
    prevButton.innerText = 'Prev';
    nextButton.id = 'modal-next';
    nextButton.class = 'modal-next btn';
    nextButton.innerText = 'Next';

    
    modalInfoContainer.innerHTML = 
    `<div class="modal-info-container">
        <img class="modal-img" src="${user.image}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${user.firstName} ${user.lastName}</h3>
        <p class="modal-text">${user.email}</p>
        <p class="modal-text cap">${user.city}</p>
        <hr>
        <p class="modal-text">${user.cell}</p>
        <p class="modal-text">${user.street.number} ${user.street.name}, ${user.city} ${user.state}, ${user.postcode}</p>
        <p class="modal-text">Birthday: ${user.dob.toLocaleDateString()}</p>
    </div>`
    console.log(user.street);
    
    modal.appendChild(closeButton);
    modal.appendChild(modalInfoContainer);
    modalContainer.appendChild(modal);
    
    if(currentIndex > 0){
        modalButtonContainer.appendChild(prevButton)
    }
    if(currentIndex < endIndex){
        modalButtonContainer.appendChild(nextButton);
    }
    modalContainer.appendChild(modalButtonContainer);
    document.body.appendChild(modalContainer);
    
    closeButton.addEventListener('click', () => modalContainer.remove());
    nextButton.addEventListener('click', () => addModal(users[currentIndex + 1]));
    prevButton.addEventListener('click', () => addModal(users[currentIndex - 1]));
}
fetchUsers();
addSearchContainer();