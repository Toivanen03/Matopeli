function showInstructions() {  //ohjeiden näyttö
  document.getElementById("instructionsModal").style.display = "block";
}

function closeInstructions() { //ohjeiden sulku
  document.getElementById("instructionsModal").style.display = "none";
}

// Alhaalta tippuvat logot
function createFloatingLogo() {
  const logoContainer = document.querySelector('.floating-logos');
  const logo = document.createElement('img');
  logo.src = 'img/matologo.png';
  logo.className = 'floating-logo';
  
  // Logojen randomit aloituspaikat ja kesto
  logo.style.left = Math.random() * 100 + 'vw';
  logo.style.animationDuration = Math.random() * 3 + 3 + 's'; // Adjust duration here
  
  // "Päälogo"
  logoContainer.appendChild(logo);
  
  setTimeout(() => {
    logoContainer.removeChild(logo);
  }, 6000); 
}

setInterval(createFloatingLogo, 500); 

for (let i = 0; i < 10; i++) {
  createFloatingLogo();
}

function startGame() {
  var difficulty = document.getElementById("difficulty").value;
  window.location.href = "mato.html?difficulty=" + difficulty;
}
