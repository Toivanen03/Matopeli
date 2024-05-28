function startPoints() {                                                //Käynnistää canvasin ja päivittää pistenäyttöä
    myPointsArea.start();
    pointsArea = new drawPointsArea();                    //Kutsutaan funktiota luomaan canvas
}

let myPointsArea = {                                                    //Luodaan canvas
    pointsCanvas: document.createElement("canvas"),
    start: function() {
        this.pointsCanvas.width = 200;
        this.pointsCanvas.height = 100;
        this.context = this.pointsCanvas.getContext("2d");
        let pointsAreaDiv = document.getElementById("pointsArea");
        pointsAreaDiv.appendChild(this.pointsCanvas);                                       //Asetetaan canvas div-elementtiin html-sivulla
        this.interval = setInterval(updatePointsArea, speed);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.pointsCanvas.width, this.pointsCanvas.height);    //Näytön tyhjennys. Estää edellisen piirron jäämisen
    },                                                                                      //näytölle.
    stop: function() {                                                                      //Nollaa ajastuksen, eli pysäyttää ohjelman suorituksen
        clearInterval(this.interval);                                                       //pysäyttämällä näytön.
    }
}





function drawPointsArea() {                                 //Alustaa canvasin
    this.update = function() {
        let ctx = myPointsArea.context;
        ctx.beginPath();
        ctx.roundRect(0, 0, 200, 100, [20]); 
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
        handlePoints(ctx);
    }
}

function handlePoints(ctx) {
    document.getElementById("pointsHeader").innerHTML = "<h3>Pisteet</h3>";         //Otsikko
    let pointsString = points.toString();                                           //Muunnetaan pisteet merkkijonoksi

    let segmentWidth = 20;                                                          //Määritellään lukujen koko ja piirron
    let startX = 200 - segmentWidth - 30;                                           //aloituskoordinaatit

    for (let i = pointsString.length - 1; i >= 0; i--) {                            //Haetaan tulostettava numero sekä
        drawNumber(ctx, pointsString[i], startX);                                   //määritellään tulosuspaikka
        startX -= (segmentWidth + 10);
    }
}

function drawNumber(ctx, number, startX) {      //Funktio tulostaa saamiensa parametrien perusteella pistemäärän
    let segmentWidth = 20;                      //kutakin lukua vastaavan kuvion
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





function updatePointsArea() {         //Kutsuu tulostuksen toimintoja, eli huolehtii näytön päivityksestä.
    myPointsArea.clear();
    pointsArea.update();    
}