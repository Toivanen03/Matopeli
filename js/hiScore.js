let oldHiScore = hiScore;               //Tallennetaan aiempi ennätystulos uuteen muuttujaan. Tämä mahdollistaa pisteiden pelinaikaisen
                                        //päivittämisen ja oikean tallentamisen mato.js-scriptissä.


function starthiScore() {                                               //Käynnistää canvasin ja päivittää ennätysnäyttöä
    myhiScoreArea.start();
    hiScoreArea = new drawHiScoreArea();                                //Kutsutaan funktiota luomaan canvas
}

let myhiScoreArea = {                                                   //Luodaan canvas
    hiScoreCanvas: document.createElement("canvas"),
    start: function() {
        this.hiScoreCanvas.width = 200;
        this.hiScoreCanvas.height = 100;
        this.context = this.hiScoreCanvas.getContext("2d");
        let hiScoreAreaDiv = document.getElementById("hiScoreArea");
        hiScoreAreaDiv.appendChild(this.hiScoreCanvas);                                     //Asetetaan canvas div-elementtiin html-sivulla
        this.interval = setInterval(updatehiScoreArea, speed);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.hiScoreCanvas.width, this.hiScoreCanvas.height);  //Näytön tyhjennys. Estää edellisen piirron jäämisen
    },                                                                                      //näytölle.
    stop: function() {                                                                      //Nollaa ajastuksen, eli pysäyttää ohjelman suorituksen
        clearInterval(this.interval);                                                       //pysäyttämällä näytön.
    }
}





function drawHiScoreArea() {                                //Luodaan canvas ennätyksille
    this.update = function() {
        let ctx = myhiScoreArea.context;
        ctx.beginPath();
        ctx.roundRect(0, 0, 200, 100, [20]); 
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
        handlehiScore(ctx);
    }
}




function handlehiScore(ctx) {                                                   //Funktio on ennätystuloksen tallentamista ja muuttujien
    document.getElementById("hiScoreHeader").innerHTML = "<h3>Ennätys</h3>";    //nimiä lukuunottamatta identtinen pistelaskurin kanssa
    document.getElementById("hiScoreHolder").innerHTML = hiScoreHolder;
    if (points >= hiScore && !gameStop) {
        hiScore = points;
        hiScoreHolder = "Uusi ennätys!";
        localStorage.setItem("hiScore", hiScore);                   //Pisteet tallennetaan localStorageen, samoin oletusnimi siltä
        localStorage.setItem("playerName", "Nimetön pelaaja");      //varalta, ettei pelaaja syötä nimeään pelin päätteeksi
    }
    let hiScoreString = hiScore.toString();

    let segmentWidth = 20;
    let startX = 200 - segmentWidth - 30;

    for (let i = hiScoreString.length - 1; i >= 0; i--) {
        drawNumber(ctx, hiScoreString[i], startX);
        startX -= (segmentWidth + 10);
    }
}




function drawNumber(ctx, number, startX) {
    let segmentWidth = 20;
    let segmentHeight = 40;
    let segmentStartHeight = 30;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    switch (number) {
        case "0":
            ctx.moveTo(startX, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX, segmentStartHeight);
            ctx.stroke();
            break;
        case "1":
            ctx.moveTo(startX + segmentWidth / 2, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth / 2, segmentStartHeight + segmentHeight);
            ctx.stroke();
            break;
        case "2":
            ctx.moveTo(startX, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.stroke();
            break;
        case "3":
            ctx.moveTo(startX, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight);
            ctx.moveTo(startX, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight / 2);
            ctx.stroke();
            break;
        case "4":
            ctx.moveTo(startX, segmentStartHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight / 2);
            ctx.moveTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.stroke();
            break;
        case "5":
            ctx.moveTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX, segmentStartHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight);
            ctx.stroke();
            break;
        case "6":
            ctx.moveTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX, segmentStartHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight / 2);
            ctx.stroke();
            break;
        case "7":
            ctx.moveTo(startX, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.stroke();
            break;
        case "8":
            ctx.moveTo(startX, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX, segmentStartHeight);
            ctx.moveTo(startX, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight / 2);
            ctx.stroke();
            break;
        case "9":
            ctx.moveTo(startX + segmentWidth, segmentStartHeight + segmentHeight);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight);
            ctx.lineTo(startX, segmentStartHeight);
            ctx.lineTo(startX, segmentStartHeight + segmentHeight / 2);
            ctx.lineTo(startX + segmentWidth, segmentStartHeight + segmentHeight / 2);
            ctx.stroke();
            break;
    }
}




function updatehiScoreArea() {         //Kutsuu toimintoja, eli huolehtii näytön päivityksestä.
    if (!gameStop) {
        myhiScoreArea.clear();
        hiScoreArea.update();
    }
}