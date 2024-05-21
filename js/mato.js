let moveUp;             //Ohjauksessa käytettävät muuttujat. Lisätään muuttujia tarvittaessa.
let moveDown;
let moveLeft;
let moveRight;




window.onload = function() {        //Ohjelman käynnistys sivun latautuessa
    startGame();
}




function startGame() {                                              //Luo canvasin ja päivittää näytön tapahtumia
    myGameArea.start();
    gameArea = new drawGameArea(0, 0, 800, 400);                    //Kutsutaan funktiota luomaan canvas
    document.addEventListener("keydown", function(event) {          //Tapahtumakuuntelu nuolinäppäimien painallukselle
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1) {
            event.preventDefault();                                 //Estetään oletustoiminto eli tässä tapauksessa sivun vieritys
        }

        if (event.key === "ArrowUp") {
            moveUp = true;
        } else if (event.key === "ArrowDown") {
            moveDown = true;
        } else if (event.key === "ArrowLeft") {
            moveLeft = true;
        } else if (event.key === "ArrowRight") {
            moveRight = true;
        }
    });
    document.addEventListener("keyup", function(event) {            //Tapahtumakuuntelu nuolinäppäimien vapauttamiselle. Tätä
        if (event.key === "ArrowUp") {                              //ei varmaankaan tarvita, sillä mato liikkunee koko ajan.
            moveUp = false;                                         //Poistetaan tarvittaessa.
        } else if (event.key === "ArrowDown") {
            moveDown = false;
        } else if (event.key === "ArrowLeft") {
            moveLeft = false;
        } else if (event.key === "ArrowRight") {
            moveRight = false;
        }
    });
    }
    let myGameArea = {                                              //Luodaan canvas
        canvas: document.createElement("canvas"),
        start: function() {
            this.canvas.width = 800;
            this.canvas.height = 400;
            this.context = this.canvas.getContext("2d");
            let gameAreaDiv = document.getElementById("gameArea");
            gameAreaDiv.appendChild(this.canvas);                   //Asetetaan canvas div-elementtiin html-sivulla
            this.interval = setInterval(updateGameArea, 20);        //Päivitetään näyttö, eli pelitilanne 20 ms välein
        },
        clear: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);    //Näytön tyhjennys. Estää edellisen piirron jäämisen
        },                                                                          //näytölle.
        stop: function() {                                                          //Nollaa ajastuksen, eli pysäyttää ohjelman suorituksen
            clearInterval(this.interval);                                           //pysäyttämällä näytön.
        }
}




function drawGameArea(startX, startY, width, height) {              //Piirtää reunat canvasiin
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.beginPath();
        ctx.roundRect(startX, startY, width, height, [20]);         //Aloituskoordinaatit ja koko, sekä kulmien pyöristys
        ctx.lineWidth = 5;
        ctx.strokeStyle = "darkgray";
        ctx.stroke();
    }
}




function worm(startX, startY, endX, endY) {             //Muokataan tähän funktioon madon piirto.
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.lineWidth = 12;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}




function updateGameArea() {         //Kutsuu pelin toimintoja, eli huolehtii näytön päivityksestä.
    myGameArea.clear();
    gameArea.update();

    if (moveUp) {                                           //Tämä if-lohko lisätty vain tarkistamaan näppäinten oikea toiminta.
        console.log("Painettu ylös: ", moveUp);
    } else if (moveDown) {
        console.log("Painettu alas: ", moveDown);
    } else if (moveLeft) {
        console.log("Painettu vasemmalle: ", moveLeft);
    } else if (moveRight) {
        console.log("Painettu oikealle: ", moveRight);
    } else {
        if (!moveUp && !moveDown && !moveLeft && !moveRight) {
            console.log("Kaikki nuolinäppäimet vapautettu");
        }
    }
}
