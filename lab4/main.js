var n = 27;
var index = (n % 10) + 1;

var colored1 = false;
var colored2 = false;

var city = document.getElementById("city");
city.addEventListener("click", function () {
  colored1 = !colored1;
  city.style.backgroundColor = colored1 ? "yellow" : "";
  city.style.color = colored1 ? "darkred" : "";
});

var link = document.querySelector("#cityLink");
link.addEventListener("click", function (e) {
  colored2 = !colored2;
  link.style.backgroundColor = colored2 ? "navy" : "";
  link.style.color = colored2 ? "white" : "";
});

function images() {
  return link.querySelectorAll("img");
}

document.getElementById("btnAdd").addEventListener("click", function () {
  var img = document.createElement("img");
  img.src = "./img/image.png";
  img.alt = "Фото міста Варшава";
  img.style.width = "400px";
  link.appendChild(img);
});

function resize(factor) {
  var list = images();
  if (list.length === 0) return;
  var img = list[list.length - 1];
  img.style.width = img.clientWidth * factor + "px";
}

document.getElementById("btnZoomIn").addEventListener("click", function () {
  resize(1.2);
});

document.getElementById("btnZoomOut").addEventListener("click", function () {
  resize(0.8);
});

document.getElementById("btnDelete").addEventListener("click", function () {
  var list = images();
  if (list.length > 0) list[list.length - 1].remove();
});