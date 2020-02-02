
//This holds the current set of users from either the initial call or the search results
var users = []
//This gets set on the initial fetch and is never altered, it is what gets checked on searches.
const fullUsers = []

// A user Class to hold our users.
class User {
    //Constructor takes all of the user data that will ever be needed
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
        //Date of Birth will be logged as an actual date object so it can display different ways quickly
        this.dob = new Date(dob);
    }

    // This function takes a string and returns true if it matches part of the full name string.
    search(searchString){
        // Check the first name + space + last name all set to lowercase versus the search string, also set to lowercase.
        if((this.firstName + ' ' + this.lastName).toLowerCase().indexOf(searchString.toLowerCase()) >= 0){
            return true;
        }
        return false;
    }

}

// This is the call to fetch all of our users on the initial run
function fetchUsers() {
    fetch('https://randomuser.me/api/?results=12')
    .then(response => response.json())
    .then(data => {
        // Loop through the JSON results, pull the data, and create a user out of it.
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
            // push the user to both the temp and permanent user lists.
            users.push(new User(firstName, lastName, image, email, city, state, street, postcode, cell, dob));
            fullUsers.push(users[i]);
            // Add the user to the page
            addUser(users[i]);
        }
        //console.log(users);
    })
    .catch(error => alert('There was an error loading the API, sorry.  Error: ', error));
}

// Wipe out all the gallery content
function clearGallery(){
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = "";
}

// Add a single user to the gallery
function addUser(user){
    const gallery = document.getElementById('gallery');
    const card = document.createElement('div');
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

    // Add an event listener to create a modal for this user on click and pass in the user object
    card.addEventListener('click', () => {addModal(user)});
}

// Adds the search container to the page and its functionality
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

    //Once you click search, first clear the gallery, then populate the user list based on search results 
    //compared to the master list.  Push these results to the gallery.
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

}

//Function to add the modal and create its buttons.
function addModal(user){
    // Figure out the end index of the user list.
    const endIndex = users.length - 1;
    //Get the current index of the user versus the user list.
    const currentIndex = users.indexOf(user);
    //Clear out the old modal if present.
    const oldModal = document.getElementsByClassName('modal-container')[0];
    if(oldModal){
        oldModal.remove();
    }

    //Create our elements.
    const modalContainer = document.createElement('div');
    const modal = document.createElement('div');
    const modalInfoContainer = document.createElement('div');
    const modalButtonContainer = document.createElement('div');
    const nextButton = document.createElement('button');
    const prevButton = document.createElement('button');
    const closeButton = document.createElement('button');
    
    //Assign classes, id's and inner content
    modalContainer.className = 'modal-container';
    modal.className = 'modal';
    modalInfoContainer.className = 'modal-info-container';
    modalButtonContainer.className = 'modal-btn-container';
    closeButton.id = 'modal-close-btn';
    closeButton.className = 'modal-close-btn';
    closeButton.innerHTML = '<strong>X</strong>'
    prevButton.id = 'modal-prev';
    prevButton.className = 'modal-prev btn';
    prevButton.innerText = '<';
    nextButton.id = 'modal-next';
    nextButton.className = 'modal-next btn';
    nextButton.innerText = '>';

    
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
    
    //Append our children
    modal.appendChild(closeButton);
    modal.appendChild(modalInfoContainer);
    modalContainer.appendChild(modal);
    
    //Only add a prev button if we are not on entry zero
    if(currentIndex > 0){
        modalButtonContainer.appendChild(prevButton)
    }
    //Only add a next button if we are not on the end of the array
    if(currentIndex < endIndex){
        modalButtonContainer.appendChild(nextButton);
    }
    modalContainer.appendChild(modalButtonContainer);
    document.body.appendChild(modalContainer);
    
    //Remove the modal if the close button is clicked.
    closeButton.addEventListener('click', () => modalContainer.remove());
    // Create a new modal with the next user or previous user if the corresponding buttons are clicked.
    nextButton.addEventListener('click', () => addModal(users[currentIndex + 1]));
    prevButton.addEventListener('click', () => addModal(users[currentIndex - 1]));
}

//Fetch the users, add the search container, start the show!
fetchUsers();
addSearchContainer();