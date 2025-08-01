//если надо очистить сохранение
//localStorage.clear();

//ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ ДЛЯ КОДА
let score = localStorage.getItem("score")
	? Number(localStorage.getItem("score"))
	: 0;
let countClick = localStorage.getItem("countClick")
	? Number(localStorage.getItem("countClick"))
	: 1;
let energy = localStorage.getItem("energy")
	? Number(localStorage.getItem("energy"))
	: 500;
let fullEnergy = localStorage.getItem("fullEnergy")
	? Number(localStorage.getItem("fullEnergy"))
	: 500;
let percentEnergy;

let priceLvlEnergy = localStorage.getItem("priceLvlEnergy")
	? Number(localStorage.getItem("priceLvlEnergy"))
	: 300;
let lvlEnergy = localStorage.getItem("lvlEnergy")
	? Number(localStorage.getItem("lvlEnergy"))
	: 0;
let countEnergy = localStorage.getItem("countEnergy")
	? Number(localStorage.getItem("countEnergy"))
	: 100;
let scoreInHour = localStorage.getItem("scoreInHour")
	? Number(localStorage.getItem("scoreInHour"))
	: 0;

let lvlTap = localStorage.getItem("lvlTap")
	? Number(localStorage.getItem("lvlTap"))
	: 0;

let countRestart = 0;
let today = new Date().toDateString();
let saveDataGame = localStorage.getItem("countRestartDate");
if (today !== saveDataGame) {
	countRestart = 0;
	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);
} else {
	countRestart = Number(localStorage.getItem("countRestart"));
}

//переменные для отображения на странице HTML
let scoreHTML = document.getElementById("score");
let energyHTML = document.getElementById("energyText");
let energyFillHTML = document.getElementById("energyFill");

let priceLvlEnergyHTML = document.getElementById("priceLvlEnergy");
let lvlEnergyHTML = document.querySelectorAll(".lvlFullEnergy");
let countEnergyHTML = document.getElementById("countEnergy");

let countRestartHTML = document.querySelectorAll(".lvlRestart");

let scoreInHourHTML = document.getElementById("scoreInHour");

let lvlTapHTML = document.getElementById("lvlTap");
let countClickHTML = document.getElementById("countClick");

//структура данных для карточек пассивного дохода
let cardsData = {
	1: {
		img: "ai-bottomCard.jpg",
		title: "Медиа-империя",
		level: 0,
		bonus: 150,
		price: 100,
		coef: 2.5,
	},
	2: {
		img: "ai-bottom2.png",
		title: "Сова-комбо",
		level: 0,
		bonus: 100,
		price: 50,
		coef: 3.6,
	},
	3: {
		img: "ai-bottom3.png",
		title: "Медиа-империя",
		level: 0,
		bonus: 150,
		price: 200,
		coef: 2.75,
	},
	4: {
		img: "ai-bottom2.png",
		title: "Медиа-империя",
		level: 0,
		bonus: 200,
		price: 300,
		coef: 2.25,
	},
	5: {
		img: "ai-bottomCard.jpg",
		title: "Медиа-империя",
		level: 0,
		bonus: 300,
		price: 1000,
		coef: 3.4,
	},
};

//при загрузке восстанавливаем уровни пассивного дохода
Object.keys(cardsData).forEach(id => {
	let savedCard = JSON.parse(localStorage.getItem(`card${id}`));
	if (savedCard) {
		cardsData[id] = savedCard;
	}
});

let cardsPassive = document.querySelectorAll(".cardPassive");
cardsPassive.forEach(card => {
	let id = card.getAttribute("data-id");
	let data = cardsData[id];
	if (data) {
		card.innerHTML = `
		<div class="imageCard" 
		     style=" margin-left:5%;
				   padding-top:1%;
				   background-Image: url('${data.img}'); background-size: cover;" >
			<p>ур. <span id="lvl${id}" class="lvlPassive">${data.level}</span></p>
		</div>
		<p class="textCard" style="text-align: center;">${data.title}</p>`;
	}
});

let dialog = document.getElementById("screenPassive");
cardsPassive.forEach(card => {
	let touchStartX = 0;
	let touchEndX = 0;
	card.addEventListener("touchstart", event => {
		touchStartX = event.changedTouches[0].screenX;
	});
	card.addEventListener("touchend", event => {
		touchEndX = event.changedTouches[0].screenX;
		if (Math.abs(touchStartX - touchEndX) < 10) {
			let id = card.getAttribute("data-id");
			let data = cardsData[id];
			if (data) {
				dialog.innerHTML = `<form method="dialog">
				<button class="closeButton">X</button>
				<img class="imgDialog" src="${data.img}" />
				<h2>${data.title}</h2>
				<div class="textContainer">
					<p>ур. <span class="lvlPassive">${data.level}</span></p>
					<img src="icons8-монета-48 (1).png" />
					<p>+<span class="bonusPassive">${data.bonus}</span> в час</p>
				</div>
				<button class="pay payPassiveCard">
					<p>Купить за <span class="pricePassive">${data.price}</span></p>
				</button>
			</form>`;
				if (score < data.price) {
					dialog.querySelector(".payPassiveCard").style.background = "grey";
				}
				dialog.showModal();
				dialog
					.querySelector(".payPassiveCard")
					.addEventListener("touchstart", event => {
						payPassiveCard(id, data);
					});
			}
		}
	});
});
function payPassiveCard(id, data) {
	if (score >= data.price) {
		score -= data.price;
		data.level++;
		scoreInHour += data.bonus;
		data.price = Math.round(data.price * data.coef);
		data.bonus = Math.round((data.bonus * data.coef) / 2);

		localStorage.setItem(`card${id}`, JSON.stringify(data));
		document.getElementById(`lvl${id}`).innerText = data.level;
		saveData();
		dataScreen();
	}
}

let obj = document.getElementById("objectPanel");
if (obj) {
	obj.addEventListener("touchstart", clicker);
}
let obj2 = document.getElementById("clickFullEnergy");
let obj2Pay = document.getElementById("payLvlEnergy");
if (obj2) {
	obj2.addEventListener("touchstart", function () {
		if (score < priceLvlEnergy) {
			document.getElementById("payLvlEnergy").style.background = "grey";
		}
		document.getElementById("screenLvlEnergy").showModal();
	});
	obj2Pay.addEventListener("touchstart", payLvlEnergy);
}
let obj4 = document.getElementById("clickCountClick");
let obj4Pay = document.getElementById("payLvlTap");
if (obj4) {
	obj4.addEventListener("touchstart", function () {
		if (score < priceLvlTap) {
			document.getElementById("payLvlTap").style.background = "grey";
		}
		document.getElementById("screenTap").showModal();
	});
	obj4Pay.addEventListener("touchstart", payLvlTap);
}

let obj3 = document.getElementById("clickRestart");
let obj3Pay = document.getElementById("payLvlRestart");
if (obj3) {
	obj3.addEventListener("touchstart", function () {
		if (countRestart >= 6) {
			document.getElementById("payLvlRestart").style.background = "grey";
		}
		document.getElementById("screenRestart").showModal();
	});
	obj3Pay.addEventListener("touchstart", payRestart);
}
//Функция покупки восстановления энергии
function payRestart() {
	if (countRestart < 6) {
		energy = fullEnergy;
		countRestart++;
		saveData();
		dataScreen2();
	}
}

//Функция покупки уровня запаса энергии
function payLvlEnergy() {
	if (score >= priceLvlEnergy) {
		score -= priceLvlEnergy;
		lvlEnergy++;
		fullEnergy += countEnergy;
		priceLvlEnergy = priceLvlEnergy * 2;
		countEnergy += 50;
		saveData();
		dataScreen2();
	}
}

function payLvlTap() {
	if (score >= priceLvlTap) {
		score -= priceLvlTap;
		lvlTap++;
		countClick += 10;
		priceLvlTap = priceLvlTap * 2;
		saveData();
		dataScreen2();
	}
}

//функция на сохранение в локальное хранилище
function saveData() {
	localStorage.setItem("score", score);
	localStorage.setItem("scoreInHour", scoreInHour);
	localStorage.setItem("energy", energy);
	localStorage.setItem("fullEnergy", fullEnergy);

	localStorage.setItem("lvlEnergy", lvlEnergy);
	localStorage.setItem("priceLvlEnergy", priceLvlEnergy);
	localStorage.setItem("countEnergy", countEnergy);
	localStorage.setItem("countRestart", countRestart);
	localStorage.setItem("countRestartDate", today);

	localStorage.setItem("lvlTap", lvlTap);
	localStorage.setItem("countClick", countClick);
	localStorage.setItem("priceLvlTap", priceLvlTap);
}

//функция на загрузку данных на HTML странице играть
function dataScreen() {
	scoreHTML.innerText = Math.round(score);
	energyHTML.innerText = energy;
	fillEnergy();
	scoreInHourHTML.innerText = scoreInHour;
}
//функция на загрузку данных на HTML странице доход
function dataScreen2() {
	dataScreen();
	lvlEnergyHTML.forEach(element => {
		element.innerText = lvlEnergy;
	});
	lvlTapHTML.forEach(element => {
		element.innerText = lvlTap;
	});
	priceLvlTapHTML.innerText = priceLvlTap;
	countClickHTML.innerText = countClick;
	priceLvlEnergyHTML.innerText = priceLvlEnergy;
	countEnergyHTML.innerText = countEnergy;
	countRestartHTML.forEach(element => {
		element.innerText = countRestart;
	});
}

//Проверка стрницы запуска
let path = window.location.pathname;
if (path.includes("index.html")) dataScreen();
else if (path.includes("earnings.html")) dataScreen2();

function clicker(event) {
	if (energy >= countClick) {
		score += countClick;
		energy -= countClick;
		scoreHTML.innerText = Math.round(score);
		energyHTML.innerText = energy;
		fillEnergy();

		let img = event.currentTarget.querySelector("#objectImg");
		img.style.transform = "scale(0.9)";
		setTimeout(() => {
			img.style.transform = "";
		}, 120);
		const plus = document.createElement("div");
		plus.className = "plus";
		plus.innerText = "+" + countClick;
		const panel = event.currentTarget;
		const rect = panel.getBoundingClientRect();
		plus.style.left = `${event.clientX - rect.left}px`;
		plus.style.top = `${event.clientY - rect.top}px`;
		panel.appendChild(plus);
		setTimeout(() => {
			plus.remove();
		}, 2200);
		saveData();
	}
}
//функция отрисовки контейнера энергии
function fillEnergy() {
	percentEnergy = (energy * 100) / fullEnergy;
	energyFillHTML.style.width = percentEnergy + "%";
}
//функция восстановления энергии
function regenerateEnergy() {
	if (energy < fullEnergy) {
		energy++;
		energyHTML.innerText = energy;
		fillEnergy();
	}
	//score += score / 3600;
	//scoreHTML.innerText = Math.round(score);
	saveData();
}
setInterval(regenerateEnergy, 1000);
//вызывается при покидании страницы
window.addEventListener("beforeunload", () => {
	localStorage.setItem("lastVisit", Date.now());
});
//вызывается при загрузке странице
window.addEventListener("load", () => {
	let lastVisit = localStorage.getItem("lastVisit");
	let nowVisit = Date.now();
	if (nowVisit - lastVisit > 30 * 1000 && lastVisit) {
		let hoursAway = (nowVisit - parseInt(lastVisit)) / (1000 * 60 * 60);
		if (hoursAway > 3) hoursAway = 3;

		//начисление монет
		let offlineScore = Math.round(hoursAway * scoreInHour);
		score += offlineScore;
		scoreHTML.innerText = score;

		//начисление энергии
		let offlineEnergy = Math.round(hoursAway * 3600);
		energy = Math.min(energy + offlineEnergy, fullEnergy);
		energyHTML.innerText = energy;

		alert(`За ваше отсутствие заработано ${offlineScore} монет`);
	}
});
