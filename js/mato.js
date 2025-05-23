let moveUp;                                                         //Ohjauksessa käytettävät muuttujat.
let moveDown;
let moveLeft;
let moveRight = true;
let direction = "right";

let turnCount = 0;                                                  //Käännösten määrää lasketaan ääniefektin toistamiseksi
let turnTimer = null;
   
let difficultyOption = {                                            //Vaikeustason vaihtoehdot. Arvo vastaa näytön päivitystaajuutta.
1: 17,  
2: 15,
3: 13,
4: 11,
5: 9,
6: 7,
7: 5,
8: 3,
9: 1
};
let difficulty = parseInt(localStorage.getItem("difficulty"));      //vaikeustaso localstoragesta.
let speed = difficultyOption[difficulty];                           //nopeuden määritys

let wormLength = 40;                                                //Madon pituus
let wormX = 70;                                                     //Madon aloituskoordinaatit
let wormY = 194;
let wormSegments = [];                                              //Listat madon sijainnille ja käännöksille
let turnPoints = [];

let appleX;                                                         //Omenan koordinaatit
let appleY;

let points = 0;                                                     //Pisteiden muuttujat ja lataus localStoragesta, mikäli olemassa
let playerName;
const savedHiScore = localStorage.getItem("hiScore");
let hiScore = savedHiScore ? parseInt(savedHiScore) : 0;
const savedHiScoreHolder = localStorage.getItem("playerName");
let hiScoreHolder = savedHiScoreHolder ? savedHiScoreHolder.toString() : "";

let gameStop = false;




window.onload = function() {                //Alkulataukset
    generateAppleCoordinates();
    loadScripts(function() {
        startPoints();
        starthiScore();
    });
    startGame();
}




function loadScripts(callback) {                //Ladataan apuscriptit, eli pisteiden sekä ennätyksen näytöt, jotka
    let scriptsToLoad = 2;                      //molemmat tulostuvat pelialueen ulkopuolisille canvas-elementeille.
    let scriptsLoaded = 0;

    function scriptLoaded() {
        scriptsLoaded++;
        if (scriptsLoaded === scriptsToLoad) {
            callback();
        }
    }

    let pointsScript = document.createElement("script");
    pointsScript.src = "js/matoPoints.js";
    pointsScript.type = "text/javascript";
    pointsScript.onload = scriptLoaded;
    document.body.appendChild(pointsScript);

    let hiScoreScript = document.createElement("script");
    hiScoreScript.src = "js/hiScore.js";
    hiScoreScript.type = "text/javascript";
    hiScoreScript.onload = scriptLoaded;
    document.body.appendChild(hiScoreScript);
}




function playSound(sound) {                                         //Toistetaan ääni valitun asetuksen perusteella.
    let audioElement;
    if (sound === "start") {
        audioElement = document.getElementById("startSound");
    } else if (sound === "apple") {
        audioElement = document.getElementById("appleSound");
    } else if (sound === "kumitvinkuu") {
        audioElement = document.getElementById("kumitvinkuu");
    } else if (sound === "gameover") {
        audioElement = document.getElementById("gameOverSound");
    }

    if (audioElement) {                             //Lisätty äänen toistamiseksi alusta, mikäli uusi tuplakäännös tapahtuu. -ST
        if (sound === "kumitvinkuu") {
            audioElement.currentTime = 0;
        }
        audioElement.play().catch(error => {
            console.error("VIRHE ÄÄNENTOISTOSSA:", error);
        });
    }
}





function startGame() {                                              //Käynnistää canvasin ja päivittää näytön tapahtumia
    let countdown = 3;                                              //Pelin alkamisen yhteydessä olevan timerin asetus sekunteina
    const timerModal = new bootstrap.Modal(document.getElementById("timerModal"));
    const timerElement = document.getElementById("timer");

    timerModal.show();
    timerElement.src = "img/" + countdown + ".png";

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            timerModal.hide();

    playSound("start");                                             //soitetaan start-ääni
    myGameArea.start();
    gameArea = new drawGameArea(0, 0, 800, 400);                    //Kutsutaan funktiota luomaan canvas
    worm = new generateWorm(wormX, wormY);                          //Kutsutaan funktiota piirtämään mato

    document.addEventListener("keydown", function(event) {          //Tapahtumakuuntelu nuolinäppäimien painallukselle
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.key) > -1) {
            event.preventDefault();                                 //Estetään oletustoiminto eli tässä tapauksessa sivun vieritys
        }
        if (event.key === "ArrowUp" && direction !== "down") {      //Asetetaan uusi suunta vain, jos se ei ole vastakkainen
            setMoveDirection("up");                                 //nykyiselle suunnalle. Kutsuttavalle funktiolle annetaan
        }                                                           //uusi suunta parametrina.
        if (event.key === "ArrowDown" && direction !== "up") {
            setMoveDirection("down");
        }
        if (event.key === "ArrowLeft" && direction !== "right") {
            setMoveDirection("left");
        }
        if (event.key === "ArrowRight" && direction !== "left") {
            setMoveDirection("right");
        }
    }); 
} else {
    timerElement.src = "img/" + countdown + ".png";
}
}, 1000);
}

let myGameArea = {                                                              //Luodaan canvas
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        let gameAreaDiv = document.getElementById("gameArea");
        gameAreaDiv.appendChild(this.canvas);                                   //Asetetaan canvas div-elementtiin html-sivulla
        this.interval = setInterval(updateGameArea, speed);                     //Päivitetään näyttö, eli pelitilanne vaikeustason mukaisesti
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);    //Näytön tyhjennys. Estää edellisen piirron jäämisen
    },                                                                          //näytölle.
    stop: function() {                                                          //Nollaa ajastuksen, eli pysäyttää ohjelman suorituksen
        clearInterval(this.interval);                                           //pysäyttämällä näytön.
    }
}




function setMoveDirection(newDirection) {
    if (newDirection !== direction) {                                           //Tallennetaan nykyinen ja uusi sijainti
        turnPoints.push({x: wormSegments[0].x, y: wormSegments[0].y, newDirection: newDirection});
        turnCount += 1;

        if (turnTimer !== null) {                   //Tarkkaillaan, onko tapahtunut kaksi peräkkäistä käännöstä
            clearTimeout(turnTimer);                //annetun aikarajan puitteissa
        }
        turnTimer = setTimeout(function() {
            turnCount = 0;
            turnTimer = null;
        }, 200);

        if (turnCount === 2) {                      //Äänitehoste toistetaan, mikäli täyskäännös on tapahtunut.
            playSound("kumitvinkuu");
            turnCount = 0;
            clearTimeout(turnTimer);
            turnTimer = null;
        }
    }

    moveUp = moveDown = moveLeft = moveRight = false;                           //Kaikki suuntamuuttujat asetetaan arvoon false,
    direction = newDirection;                                                   //ennen kuin uusi suunta määrätään.

    if (newDirection === "up") {
        moveUp = true;
    } else if (newDirection === "down") {
        moveDown = true;
    } else if (newDirection === "left") {
        moveLeft = true;
    } else if (newDirection === "right") {
        moveRight = true;
    }
}




function drawGameArea(startX, startY, width, height) {                          //Piirtää reunat canvasiin
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.beginPath();
        ctx.roundRect(startX, startY, width, height, [20]);                     //Canvasin koordinaatit ja koko, sekä kulmien pyöristys
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
    }
}




function generateWorm(x, y) {
    this.wormX = x;
    this.wormY = y;
    for (let i = 0; i < wormLength; i++) {
        wormSegments.push({ x: x - i * 2, y: y });                  //Tallennetaan madon piirtämiseen käytettävät koordinaatit listaan
    }
    this.update = function() {                                      //Päivitetään madon pään sijainti
        if (moveUp) {
            this.wormY -= 2;
        }
        if (moveDown) {
            this.wormY += 2;
        }
        if (moveLeft) {
            this.wormX -= 2;
        }
        if (moveRight) {
            this.wormX += 2;
        }
        wormSegments.unshift({ x: this.wormX, y: this.wormY });     //Tallennetaan pään uusi sijainti

        if (wormSegments.length > wormLength) {                     //Lyhennetään matoa peräpäästä
            wormSegments.pop();
        }
        if (turnPoints.length > 0) {                                //Pidetään kirjaa käännöksistä
            let currentTurn = turnPoints[0];
            if (this.wormX === currentTurn.x && this.wormY === currentTurn.y) {
                direction = currentTurn.newDirection;
                turnPoints.shift();
            }
        }
        drawWorm();
    };
}




function drawWorm() {                                               //Piirtää madon tallennettujen koordinaattien mukaisesti
    let ctx = myGameArea.context;
    ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    for (let i = 0; i < wormSegments.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(wormSegments[i].x, wormSegments[i].y);
        ctx.lineTo(wormSegments[i + 1].x, wormSegments[i + 1].y);
        ctx.lineWidth = 12;
        ctx.strokeStyle = "pink";
        ctx.lineCap = "round";
        ctx.stroke();
    }

    let head = wormSegments[0];                                     //Piirtää madolle silmät
    ctx.beginPath();
    ctx.arc(head.x - 2, head.y - 3, 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "darkbrown";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(head.x - 2, head.y + 3, 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "darkbrown";
    ctx.fill();

    generateApple();
    checkCollision();
}




function generateAppleCoordinates() {                               //Tarkistetaan madon sijainti ja arvotaan omenalle koordinaatit siten,
    let validApplePosition = false;                                 //ettei omena asetu madon päälle
    while (!validApplePosition) {
        appleX = Math.floor(Math.random() * 385) * 2 + 10;
        appleY = Math.floor(Math.random() * 185) * 2 + 10;
        validApplePosition = true;
        for (let i = 0; i < wormSegments.length; i++) {
            if (Math.abs(wormSegments[i].x - appleX) < 24 && Math.abs(wormSegments[i].y - appleY) < 24) {
                validApplePosition = false;
                break;
            }
        }
    }
}




function generateApple() {                                          //Asettaa omenan canvasille
    if (appleX >= 385 * 2) {                                        //Varmistetaan, ettei kuva tulostu canvasin ulkopuolelle
        appleX -= 20;
    }
    if (appleY >= 185 * 2) {
        appleY -= 25;
    }
    let ctx = myGameArea.context;
    let appleImg = document.getElementById("appleImg");
    ctx.drawImage(appleImg, appleX, appleY, 20, 25);
    checkCollision(appleX, appleY);
}




function checkCollision(appleX, appleY) {
    let head = wormSegments[0];

    if (head.x <= 8 || head.x >= 794 || head.y <= 8 || head.y >= 394) {                           //Tarkistetaan osuma alueen reunoihin
        playSound("gameover");                                                                      //soitetaan gameover-ääni
        gameOver();
    }

    for (let i = 1; i < wormSegments.length; i++) {
        if (head.x === wormSegments[i].x && head.y === wormSegments[i].y) {                         //Tarkistetaan madon osuma itseensä
            playSound("gameover");                                                                  //soitetaan gameover-ääni
            gameOver();
        }
    }

    if (Math.abs((head.x -8) - appleX) <= 12 && Math.abs((head.y -10) - appleY) <= 12) {            //Tarkistetaan omenan syönti
        playSound("apple");                                                                         //soitetaan omena-ääni
        points += difficulty;
        wormLength += 20;
        generateAppleCoordinates();
    }
}




function updateGameArea() {                                             //Kutsuu pelin toimintoja, eli huolehtii näytön päivityksestä.
    myGameArea.clear();
    worm.update();
    gameArea.update();
}




function gameOver() {
    myGameArea.stop();
    if (points >= hiScore) {                                            //Tallennetaan pisteet localstorageen, mikäli ennätys on syntynyt
        hiScore = points;
        document.getElementById("playerNameField").style.display = "block";
        document.getElementById("saveHiScoreButton").style.display = "block";
    }
    document.getElementById("score").textContent = points;
    let gameOverModal = new bootstrap.Modal(document.getElementById("gameOverModal"));
    setTimeout(function() {
        gameOverModal.show();
    }, 1000);
}




function saveHiScore() {                                                    //Nimen tallennus, pelaajan halutessa. Muuten talletus oletusnimellä.
    gameStop = true;
    localStorage.removeItem(playerName);
    let nameInput = document.getElementById("playerNameField");
    playerName = nameInput.value || "Nimetön pelaaja";
    localStorage.setItem("hiScore", hiScore);
    localStorage.setItem("playerName", playerName);
    document.getElementById("playerNameField").style.display = "none";
    document.getElementById("saveHiScoreButton").style.display = "none";
}




function returnToMenu() {                                               //palataan pelin menuun (menu.html)
    window.location.href = "menu.html";
}




function restartGame() {                            //aloitetaan peli uudestaan, jos käyttäjä valitsee. Lataa uudelleen mato.html tiedoston
    location.reload();
}