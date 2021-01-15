// Show an element
var show = function (elem) {
    elem.classList.add('is-visible');
};

// Hide an element
var hide = function (elem) {
    elem.classList.remove('is-visible');
};

// Toggle element visibility
var toggle = function (elem) {
    elem.classList.toggle('is-visible');
};


// HOME PAGE scripts 
var createPageAcccountCreation = document.getElementById('createPageAcccountCreation');
createPageAcccountCreation.addEventListener('click', () => {
    var homepage = document.getElementById("homePage");
    var createPage = document.getElementById("createPage");
    hide(homepage);
    show(createPage);
});

var BACKEND_URL = location.hostname === "localhost" ? "http://localhost:4040" : "https://aqueous-harbor-80633.herokuapp.com/" ; 

// CREATEPAGE scripts 
var registerbutton = document.getElementById('registerbutton');
registerbutton.addEventListener('click', (e) => {
    e.preventDefault();
    var allInputs = [...document.getElementById('tinderFormUser').getElementsByTagName('input')].map(x => x.value);
    // field #2 is a birthdate
    var isBirthdayValid = Object.prototype.toString.call(new Date(allInputs[2])) === "[object Date]";
    var allFieldsHaveInput = allInputs.filter(Boolean).length === 6;
    if (isBirthdayValid && allFieldsHaveInput) {

        fetch(BACKEND_URL + 'users/new', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: allInputs[0],
                    lastname: allInputs[1],
                    birthdate: allInputs[2],
                    city: allInputs[3],
                    country: allInputs[4],
                    email: allInputs[5],
                })
            }).then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    var createPage = document.getElementById("createPage");
                    var helloPage = document.getElementById("helloPage");
                    hide(createPage);
                    show(helloPage);
                } else {

                }
            });
    }
})

// HELLOPAGE scripts
var helloPageButton = document.getElementById('helloPageButton');
helloPageButton.addEventListener('click', (e) => {
    e.preventDefault();
    var allInputs = [...document.getElementById('helloPageForm').getElementsByTagName('input')].map(x => x.value);
    var allFieldsHaveInput = allInputs.filter(Boolean).length === 3;
    var isMaleCorrect = (str) => str === "m" || str === "M";
    var isFemaleCorrect = (str) => str === "f" || str === "F";
    var gendersAreCorrect = (isMaleCorrect(allInputs[1]) || isFemaleCorrect(allInputs[1])) && (isMaleCorrect(allInputs[2]) || isFemaleCorrect(allInputs[2]));
    if (allFieldsHaveInput && gendersAreCorrect) {
        var helloPage = document.getElementById("helloPage");
        var swipePage = document.getElementById("swipePage");
        hide(helloPage);
        show(swipePage);
        sessionStorage.setItem("name", allInputs[0]);
        sessionStorage.setItem("gender", allInputs[1]);
        sessionStorage.setItem("preferredGender", allInputs[2]);
        fetch(BACKEND_URL +"users/users").then(response => response.json()).then(data => {
            sessionStorage.setItem("people", JSON.stringify(data.data.filter(x => x.Gender.toString().toLowerCase() === allInputs[2].toLowerCase())));
            setInfo();
        });
    }
});

var currentIndexOfSwipes = 0;
var likedPeople = [],
    dislikedPeople = [];

function setInfo() {
    if (currentIndexOfSwipes !== JSON.parse(sessionStorage.getItem("people")).length) {
        var currentguy = JSON.parse(sessionStorage.getItem("people"))[currentIndexOfSwipes];
        document.getElementById('currentSwipeName').innerHTML = currentguy.NameOfPeople;
        document.getElementById('currentSwipeAge').innerHTML = currentguy.Age;
    }
}

function swipeHandler() {
    if (currentIndexOfSwipes === JSON.parse(sessionStorage.getItem("people")).length) {
        var helloPresultage = document.getElementById("result");
        var swipePage = document.getElementById("swipePage");
        hide(swipePage);
        show(result);
    } else {

        currentIndexOfSwipes += 1;
        setInfo();
    }
}
var dislike = document.getElementById('swipePageDislike');
dislike.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndexOfSwipes !== JSON.parse(sessionStorage.getItem("people")).length) {
        addToList(JSON.parse(sessionStorage.getItem("people"))[currentIndexOfSwipes].NameOfPeople, "dislikedPeople");
        dislikedPeople.push(JSON.parse(sessionStorage.getItem("people"))[currentIndexOfSwipes])
    }
    swipeHandler();

});

var like = document.getElementById('swipePageLike');
like.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndexOfSwipes !== JSON.parse(sessionStorage.getItem("people")).length) {
        addToList(JSON.parse(sessionStorage.getItem("people"))[currentIndexOfSwipes].NameOfPeople, "likedPeople");
        likedPeople.push(JSON.parse(sessionStorage.getItem("people"))[currentIndexOfSwipes])
    }
    swipeHandler();
});


function addToList(elt, likedOrDislikedList) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(elt);
    node.appendChild(textnode);
    document.getElementById(likedOrDislikedList).appendChild(node);
}
