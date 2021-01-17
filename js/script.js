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

var BACKEND_URL = location.pathname === "\/C:\/Users\/p51\/Developer\/tinder-frontend\/index.html" ? "https://aqueous-harbor-80633.herokuapp.com/";

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
                    sessionStorage.setItem('user_id', data.id);
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
        fetch(BACKEND_URL + "users/setgender", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: allInputs[0],
                gender: allInputs[1],
                preferredgender: allInputs[2],
                id: sessionStorage.getItem('user_id'),
            })
        }).then(resp => {
            fetch("http://localhost:4040/users/users", {
                "credentials": "omit",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
                    "Accept": "application/json",
                    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/json"
                },
                "body": "{\"id\":\"" + Number.parseInt(sessionStorage.getItem('user_id')) +"\"\}",
                "method": "POST",
                "mode": "cors"
            }).then(response => response.json())
            .then(data => {
                sessionStorage.setItem('peopleToLike' , JSON.stringify(data.data))
                show(swipePage);
                setInfo();
            })
        })
    }
});

var currentIndexOfSwipes = 0;
function setInfo() {
    if (currentIndexOfSwipes !== JSON.parse(sessionStorage.getItem("peopleToLike")).length) {
        var currentguy = JSON.parse(sessionStorage.getItem("peopleToLike"))[currentIndexOfSwipes];
        var from= currentguy.birthdate.split('/')
        var birthtimestamp = new Date(from[2], from[1] - 1, from[0]);
        var cur = new Date();
        var diff = cur - birthtimestamp;
        var currentAge = Math.floor(diff/31557600000);
        document.getElementById('currentSwipeName').innerHTML = currentguy.firstname;
        document.getElementById('currentSwipeAge').innerHTML = currentAge;
    }
}

function swipeHandler() {
    if (currentIndexOfSwipes === JSON.parse(sessionStorage.getItem("peopleToLike")).length) {
        fetch("http://localhost:4040/users/liked", {
            "credentials": "omit",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
                "Accept": "application/json",
                "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
                "Content-Type": "application/json"
            },
            "body": "{\"id\":\"" + Number.parseInt(sessionStorage.getItem('user_id')) +"\"\}",
            "method": "POST",
            "mode": "cors"
        }).then(response => response.json())
        .then(data => {
            sessionStorage.setItem('liked' , JSON.stringify(data.data))
        })
        fetch("http://localhost:4040/users/disliked", {
            "credentials": "omit",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
                "Accept": "application/json",
                "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
                "Content-Type": "application/json"
            },
            "body": "{\"id\":\"" + Number.parseInt(sessionStorage.getItem('user_id')) +"\"\}",
            "method": "POST",
            "mode": "cors"
        }).then(response => response.json())
        .then(data => {
            sessionStorage.setItem('disliked' , JSON.stringify(data.data))
        })
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
    if (currentIndexOfSwipes !== JSON.parse(sessionStorage.getItem("peopleToLike")).length) {
        // var currentguy = JSON.parse(sessionStorage.getItem("peopleToLike"))[currentIndexOfSwipes];
        addToList(JSON.parse(sessionStorage.getItem("peopleToLike"))[currentIndexOfSwipes].firstname, "dislikedPeople");
        // dislikedPeople.push(JSON.parse(sessionStorage.getItem("people"))[currentIndexOfSwipes])
    }
    swipeHandler();

});

var like = document.getElementById('swipePageLike');
like.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndexOfSwipes !== JSON.parse(sessionStorage.getItem("peopleToLike")).length) {
        var currentguy = JSON.parse(sessionStorage.getItem("peopleToLike"))[currentIndexOfSwipes];
        addToList(JSON.parse(sessionStorage.getItem("peopleToLike"))[currentIndexOfSwipes].firstname, "likedPeople");
        fetch("http://localhost:4040/users/swipe", {
                "credentials": "omit",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
                    "Accept": "application/json",
                    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
                    "Content-Type": "application/json"
                },
                "body": "{\"id1\":" + Number.parseInt(sessionStorage.getItem('user_id')) +", \"id2\":" + Number.parseInt(currentguy.PersonId) +"\}",
                "method": "POST",
                "mode": "cors"
            }).then(response => response.json())
    }
    swipeHandler();
});


function addToList(elt, likedOrDislikedList) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(elt);
    node.appendChild(textnode);
    document.getElementById(likedOrDislikedList).appendChild(node);
}
