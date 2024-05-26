let moveUp;             //Ohjauksessa käytettävät muuttujat.
let moveDown;
let moveLeft;
let moveRight = true;
let direction = "right";
let oldDirection = "right";

let difficultyOption = [17, 15, 13, 11, 9, 7, 5, 3, 1];     //Vaikeustason vaihtoehdot. Arvo vastaa näytön päivitystaajuutta.
let difficulty = difficultyOption[0];                       //Indeksi 0 on helpoin vaikeustaso, indeksi 8 nopein ja vaikein.

let wormLength = 40;                                        //Madon pituus
let wormX = 70;                                             //Madon aloituskoordinaatit
let wormY = 194;
let wormSegments = [];
let turnPoints = [];




window.onload = function() {                                //Ohjelman käynnistys sivun latautuessa
    startGame();
}





function startGame() {                                              //Käynnistää canvasin ja päivittää näytön tapahtumia
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
        this.interval = setInterval(updateGameArea, difficulty);        //Päivitetään näyttö, eli pelitilanne vaikeustason mukaisesti
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);    //Näytön tyhjennys. Estää edellisen piirron jäämisen
    },                                                                          //näytölle.
    stop: function() {                                                          //Nollaa ajastuksen, eli pysäyttää ohjelman suorituksen
        clearInterval(this.interval);                                           //pysäyttämällä näytön.
    }
}





function setMoveDirection(newDirection) {
    if (newDirection !== direction) {
                                                                //Tallennetaan nykyinen ja uusi sijainti
        turnPoints.push({ x: wormSegments[0].x, y: wormSegments[0].y, newDirection: newDirection });
    }
    moveUp = moveDown = moveLeft = moveRight = false;           //Kaikki suuntamuuttujat asetetaan arvoon false,
    direction = newDirection;                                   //ennen kuin uusi suunta määrätään.

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






function drawGameArea(startX, startY, width, height) {              //Piirtää reunat canvasiin
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.beginPath();
        ctx.roundRect(startX, startY, width, height, [20]);         //Canvasin koordinaatit ja koko, sekä kulmien pyöristys
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
    }
}





function generateWorm(x, y) {
    this.wormX = x;
    this.wormY = y;
    for (let i = 0; i < wormLength; i++) {
        wormSegments.push({ x: x - i * 2, y: y });          //Tallennetaan madon piirtämiseen käytettävät koordinaatit listaan
    }
    this.update = function() {                              //Päivitetään madon pään sijainti
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





function drawWorm() {                                                       //Piirtää madon tallennettujen koordinaattien mukaisesti
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

    let head = wormSegments[0];                                             //Piirtää madolle silmät
    ctx.beginPath();
    ctx.arc(head.x - 2, head.y - 3, 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "darkbrown";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(head.x - 2, head.y + 3, 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "darkbrown";
    ctx.fill();

    checkCollision(head);
}





function checkCollision(head) {
    if (head.x <= 9 || head.x >= 791 || head.y <= 9 || head.y >= 391) {     //Tarkistetaan osuma alueen reunoihin
        gameOver();
    }

    for (let i = 1; i < wormSegments.length; i++) {
        if (head.x === wormSegments[i].x && head.y === wormSegments[i].y) {
            gameOver();
        }
    }
    return false;
}





function updateGameArea() {         //Kutsuu pelin toimintoja, eli huolehtii näytön päivityksestä.
    myGameArea.clear();
    worm.update();
    gameArea.update();    
}





function gameOver() {
    myGameArea.stop();
}