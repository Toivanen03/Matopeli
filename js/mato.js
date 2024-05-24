let moveUp;             //Ohjauksessa käytettävät muuttujat.
let moveDown;
let moveLeft;
let moveRight = true;
let direction = "right";
let oldDirection = "right";

let difficultyOption = [17, 15, 13, 11, 9, 7, 5, 3, 1];     //Vaikeustason vaihtoehdot. Arvo vastaa näytön päivitystaajuutta.
let difficulty = difficultyOption[0];                       //Indeksi 0 on helpoin vaikeustaso, indeksi 8 nopein ja vaikein.
let wormLength = 60;                                        //Madon pituus
let wormX = 70;                                             //Madon aloituskoordinaatit
let wormY = 194;





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
    moveUp = moveDown = moveLeft = moveRight = false;               //Kaikki suuntamuuttujat asetetaan arvoon false,
    direction = newDirection;                                       //ennen kuin uusi suunta määrätään.
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





function generateWorm() {                       //Madon funktio
    let breakpointX;
    let breakpointY;

    this.wormX = wormX;
    this.wormY = wormY;
    this.tailX = wormX - wormLength;
    this.tailY = wormY;
    this.update = function() {
        if (moveUp) {
            this.wormY -= 2;
            this.tailY -= 2;
            breakpointY = this.wormY;
        }
        if (moveDown) {
            this.wormY += 2;
            this.tailY += 2;
            breakpointY = this.wormY;
        }
        if (moveLeft) {
            this.wormX -= 2;
            this.tailX -= 2;
            breakpointX = this.wormX;
        }
        if (moveRight) {
            this.wormX += 2;
            this.tailX += 2;
            breakpointX = this.wormX;
        }
        let coordinates = [this.wormX, this.wormY, this.tailX, this.tailY]
        checkBreakPoint(coordinates, breakpointX, breakpointY);
    }
}





function checkBreakPoint(coordinates, breakpointX, breakpointY) {
    let wormX = coordinates[0];
    let wormY = coordinates[1];
    let tailX = coordinates[2];
    let tailY = coordinates[3];

    if (oldDirection != direction) {
        //  TÄSTÄ PITÄISI JATKAA MADON SUUNNANVAIHTOA
        oldDirection = direction;
    }
    drawWorm(wormX, wormY, tailX, tailY);
}





function drawWorm(wormX, wormY, tailX, tailY) {
    let ctx = myGameArea.context;                   //Piirtää madon
    ctx.beginPath();
    ctx.moveTo(wormX, wormY);
    ctx.lineTo(tailX, tailY);
    ctx.lineWidth = 12;
    ctx.strokeStyle = "pink";
    ctx.lineCap = "round";
    ctx.stroke();

    let eyeOne = [[wormX - 2], [wormY - 3], [1.5], [0], [2 * Math.PI]];
    let eyeTwo = [[wormX - 2], [wormY + 3], [1.5], [0], [2 * Math.PI]];

    ctx.beginPath();                                //Piirtää madolle silmät
    ctx.arc.apply(ctx, eyeOne);
    ctx.fillStyle = "darkbrown";
    ctx.fill();

    ctx.beginPath();
    ctx.arc.apply(ctx, eyeTwo);
    ctx.fillStyle = "darkbrown";
    ctx.fill();

    if (wormX <= 9 || wormX >= 791 || wormY <= 9 || wormY >= 391) {         //Tarkistetaan osuma alueen reunoihin
        gameOver();
    }
}





function updateGameArea() {         //Kutsuu pelin toimintoja, eli huolehtii näytön päivityksestä.
    myGameArea.clear();
    gameArea.update();    
    worm.update();
}





function gameOver() {
    myGameArea.stop();
}