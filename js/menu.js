const startGame = document.getElementById("start");
const bShowRules = document.getElementById("showRules");
const bHideRules = document.getElementById("hideRules");
const menuDiv = document.getElementById("menu");
const rulesDiv = document.getElementById("rules");

rulesDiv.style.display = "none";

startGame.onclick = function () {
  window.location.href = "pages/game.html";
};

bShowRules.onclick = function () {
  menuDiv.style.display = "none";
  rulesDiv.style.display = "block";
};

bHideRules.onclick = function () {
  menuDiv.style.display = "flex";
  rulesDiv.style.display = "none";
};
