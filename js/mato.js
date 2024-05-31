let moveUp;             //Ohjauksessa käytettävät muuttujat.
let moveDown;
let moveLeft;
let moveRight = true;
let direction = "right";
   
let difficultyOption = {     //Vaikeustason vaihtoehdot. Arvo vastaa näytön päivitystaajuutta.
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
let difficulty = localStorage.getItem("difficulty") ? parseInt(localStorage.getItem("difficulty")) : 5;  //vaikeustaso localstoragesta, jos on asetettu. Muuten käyttöön  oletrusarvo 5.
let speed = difficultyOption[difficulty]; //nopeuden määritys

let wormLength = 40;                                        //Madon pituus
let wormX = 70;                                             //Madon aloituskoordinaatit
let wormY = 194;
let wormSegments = [];                                      //Listat madon sijainnille ja käännöksille
let turnPoints = [];

let appleX;                                                 //Omenan koordinaatit
let appleY;

let points = 0;
const savedHiScore = localStorage.getItem("hiScore");
let hiScore = savedHiScore ? parseInt(savedHiScore) : 0;

window.onload = function() {
    generateAppleCoordinates();
    loadScripts(function() {
        startPoints();
        starthiScore();
    });
    startGame();
}

function loadScripts(callback) {
    let scriptsToLoad = 2;
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
// Toistetaan ääni valitun asetuksen perusteella.
function playSound(sound) {
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
    if (audioElement) {
        audioElement.play().catch(error => {
            console.error("TESTIP, VIRHE ÄÄNENTOISTOSSA:", error);
        });
    }
}

function startGame() {                                              //Käynnistää canvasin ja päivittää näytön tapahtumia
    playSound("start"); //soitetaan start-ääni
    myGameArea.start();
    gameArea = new drawGameArea(0, 0, 800, 400);                    //Kutsutaan funktiota luomaan canvas
    worm = new generateWorm(wormX, wormY);                          //Kutsutaan funktiota piirtämään mato

    document.addEventListener("keydown", function(event) {          //Tapahtumakuuntelu nuolinäppäimien painallukselle
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1) {
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
}

let myGameArea = {                                                  //Luodaan canvas
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        let gameAreaDiv = document.getElementById("gameArea");
        gameAreaDiv.appendChild(this.canvas);                           //Asetetaan canvas div-elementtiin html-sivulla
        this.interval = setInterval(updateGameArea, speed);        //Päivitetään näyttö, eli pelitilanne vaikeustason mukaisesti
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);    //Näytön tyhjennys. Estää edellisen piirron jäämisen
    },                                                                          //näytölle.
    stop: function() {                                                          //Nollaa ajastuksen, eli pysäyttää ohjelman suorituksen
        clearInterval(this.interval);                                           //pysäyttämällä näytön.
    }
}

function setMoveDirection(newDirection) {
    if (newDirection !== direction) { // Tallennetaan nykyinen ja uusi sijainti
        turnPoints.push({ x: wormSegments[0].x, y: wormSegments[0].y, newDirection: newDirection });
    }
    moveUp = moveDown = moveLeft = moveRight = false; // Kaikki suuntamuuttujat asetetaan arvoon false,
    direction = newDirection; // ennen kuin uusi suunta määrätään.

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

function drawGameArea(startX, startY, width, height) { // Piirtää reunat canvasiin
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.beginPath();
        ctx.roundRect(startX, startY, width, height, [20]); // Canvasin koordinaatit ja koko, sekä kulmien pyöristys
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
    }
}

function generateWorm(x, y) {
    this.wormX = x;
    this.wormY = y;
    for (let i = 0; i < wormLength; i++) {
        wormSegments.push({ x: x - i * 2, y: y }); // Tallennetaan madon piirtämiseen käytettävät koordinaatit listaan
    }
    this.update = function() { // Päivitetään madon pään sijainti
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
        wormSegments.unshift({ x: this.wormX, y: this.wormY }); // Tallennetaan pään uusi sijainti

        if (wormSegments.length > wormLength) { // Lyhennetään matoa peräpäästä
            wormSegments.pop();
        }
        if (turnPoints.length > 0) { // Pidetään kirjaa käännöksistä
            let currentTurn = turnPoints[0];
            if (this.wormX === currentTurn.x && this.wormY === currentTurn.y) {
                direction = currentTurn.newDirection;
                turnPoints.shift();
            }
        }
        drawWorm();
    };
}

function drawWorm() { // Piirtää madon tallennettujen koordinaattien mukaisesti
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

    let head = wormSegments[0]; // Piirtää madolle silmät
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

function generateAppleCoordinates() {
    let validApplePosition = false;
    while (!validApplePosition) {
        appleX = Math.floor(Math.random() * 385) * 2 + 10;
        appleY = Math.floor(Math.random() * 185) * 2 + 10;
        validApplePosition = true;
        for (let i = 0; i < wormSegments.length; i++) {
            if (Math.abs(wormSegments[i].x - appleX) < 12 && Math.abs(wormSegments[i].y - appleY) < 12) {
                validApplePosition = false;
                break;
            }
        }
    }
}

function generateApple() {
    let ctx = myGameArea.context;
    let appleImg = document.getElementById("appleImg");
    ctx.drawImage(appleImg, appleX, appleY, 20, 25);
    checkCollision(appleX, appleY);
}

function checkCollision(appleX, appleY) {
    let head = wormSegments[0];

    if (head.x <= 12 || head.x >= 792 || head.y <= 12 || head.y >= 392) { // Tarkistetaan osuma alueen reunoihin
        playSound("gameover"); //soitetaan gameover-ääni
        gameOver();
    }

    for (let i = 1; i < wormSegments.length; i++) {
        if (head.x === wormSegments[i].x && head.y === wormSegments[i].y) { // Tarkistetaan madon osuma itseensä
            playSound("gameover"); //soitetaan gameover-ääni
            gameOver();
        }
    }

    if (Math.abs((head.x -8) - appleX) <= 12 && Math.abs((head.y -10) - appleY) <= 12) { // Tarkistetaan omenan syönti
        playSound("apple"); //soitetaan omena-ääni
        points += difficulty;
        wormLength += 20;
        generateAppleCoordinates();
    }
}

function updateGameArea() { // Kutsuu pelin toimintoja, eli huolehtii näytön päivityksestä.
    myGameArea.clear();
    worm.update();
    gameArea.update();
}

function gameOver() {
    if (points > hiScore) {
        localStorage.setItem('hiScore', points.toString());
    }
    myGameArea.stop();
    document.getElementById('score').textContent = points;
    var gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
    gameOverModal.show();
}

function returnToMenu() {  //palataan pelin menuun (index.html)
    window.location.href = "index.html";
}

function restartGame() {  //aloitetaan peli uudestaan, jos käyttäjä valitsee. Lataa uudelleen mato.html tiedoston
    location.reload();
}
