let kursy;
const list = document.getElementsByClassName("dropdown_menu");
let valueOneSelected = false;
let valueTwoSelected = false;

window.onload = function() {
  start();
};

function start() {
  downlandFile();
}

function downlandFile() {
  let klientHTTP = new XMLHttpRequest();
  let NBPurl = "http://api.nbp.pl/api/exchangerates/tables/a?format=json";

  klientHTTP.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      kursy = JSON.parse(this.responseText);
      console.log(kursy);

      setDate();
      initDropDown();
    }
  };
  klientHTTP.open("GET", NBPurl, true);
  klientHTTP.send();
}

function setDate(){
  const date = kursy[0].effectiveDate;
  const div = document.getElementById("date");
  div.innerHTML ="NBP rates updated on: "+ date;
}
function initDropDown() {
  let length = kursy[0].rates.length;
  for (let i = 0; i <= length - 1; i++) {
    const code = kursy[0].rates[i].code;
    const mid = kursy[0].rates[i].mid;
    const li = document.createElement("li");
    li.className = "dropdown_item";
    const label = document.createAttribute("text");
    const att = document.createAttribute("data-value");
    att.value = mid;
    label.value = code;
    li.setAttributeNode(att);
    li.setAttributeNode(label);
    li.innerHTML = code;
    li.onclick = onLiClick;
    const li1 = li.cloneNode(true);
    li1.onclick = onLi1Click;
    list[0].appendChild(li);
    list[1].appendChild(li1);
  }
}

function onBtnClick() {
  const menu = document.getElementsByClassName("dropdown_menu")[0];
  if (menu.classList.contains('active_dropdown')){
    menu.classList.remove('active_dropdown');
  } else {
    menu.classList.add('active_dropdown');
  }
}

function onSecBtnClick() {
  const menu = document.getElementsByClassName("dropdown_menu")[1];
  if (menu.classList.contains("active_dropdown")){
    menu.classList.remove("active_dropdown");
  } else {
    menu.classList.add("active_dropdown");
  }
}

function onLiClick() {
  const self = this;
  const inputPLN = document.getElementById("pln").value;
  valueOneSelected = true;
  countCurrencyFromPln(self);
  if ((inputPLN !== "") & (inputPLN !== "0")) {
  setLabel(self);
  doActiveOn(self);
  }
}
function onLi1Click() {
  const self = this;
  const input = document.getElementById("other").value;
  valueTwoSelected = true;
  countCurrencyToPln(self);
  if ((input !== "") & (input !== "0")) {
  setLabel1(self);
  doActiveOn(self);}
}

function countCurrencyFromPln(self) {
  const count = document.getElementsByClassName("score")[0];
  const inputPLN = document.getElementById("pln").value;
  const value = self.getAttribute("data-value");
  if ((inputPLN !== "") & (inputPLN !== "0")) {
    let score = fromPLN(inputPLN, value);
    let precisionScore = Math.round(score * 1000) / 1000;
    count.innerHTML = precisionScore;
  } else {
    alert("Please, provide the value before selecting the currency!");
  }
}
function fromPLN(x, y) {
  return x / y;
}

function setLabel(self) {
  const scoreLabel = document.getElementsByClassName("score_label")[0];
  const label = self.getAttribute("text");
    scoreLabel.innerHTML = label;
}
function setLabel1(self) {
  const scoreLabel = document.getElementsByClassName("score_label")[1];
  const label = self.getAttribute("text");
    scoreLabel.innerHTML = label;

}
function countCurrencyToPln(self) {
  const count = document.getElementsByClassName("score")[1];
  const input = document.getElementById("other").value;
  const value = self.getAttribute("data-value");
  if ((input !== "") & (input !== "0")) {
    let score = toPLN(input, value);
    let precisionScore = Math.round(score * 1000) / 1000;
    count.innerHTML = precisionScore;
  } else {
    alert("Please, provide the value before selecting the currency!");
  }
}
function toPLN(x, y) {
  return x * y;
}
function doActiveOn(self) {
  const lis = self.parentNode.children;
  let length = lis.length;
  for (let i = 0; i <= length - 1; i++) {
    if (lis[i] !== self) {
      lis[i].classList.remove("active_currency");
    }
  }
  self.classList.add("active_currency");
}

function recalculate(event) {
  let li;
  const id = event.target.id;
  switch (id) {
    case "pln":
      if (valueOneSelected) {
        li = document.getElementsByClassName("active_currency")[0];
        countCurrencyFromPln(li);
      }
      break;
    case "other":
      if (valueTwoSelected) {
        if (valueOneSelected) {
          li = document.getElementsByClassName("active_currency")[1];
        } else {
          li = document.getElementsByClassName("active_currency")[0];
        }
        countCurrencyToPln(li);
      }
      break;
  }
}
