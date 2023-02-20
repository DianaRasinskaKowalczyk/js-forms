const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

document.addEventListener("DOMContentLoaded", init);

function init() {
	const uploadFile = document.querySelector(".uploader__input");
	const excursionsWrapper = document.querySelector(".excursions");
	const orderSubmit = document.querySelector(".order");
	const summaryList = document.querySelectorAll(".panel__summary");

	uploadFile.addEventListener("change", readFile);
	excursionsWrapper.addEventListener("submit", makeTripSummary);
	orderSubmit.addEventListener("submit", submitOrder);
	summaryList.forEach(function (item) {
		item.addEventListener("click", removeTrip);
	});
}

function readFile(e) {
	const file = e.target.files[0];

	if (file && file.type.includes("text")) {
		const reader = new FileReader();

		reader.onload = function (readerEvent) {
			const content = readerEvent.target.result;
			const contentSplit = content.split(/[\r\n]+/gm);

			const trip = tripData(contentSplit);

			createTripElement(trip);
		};
		reader.readAsText(file, "UTF-8");
	}
}

const tripData = function (content) {
	return content.map(function (item) {
		const singleTripDataArray = item.substr(1, item.length - 2).split('","');
		return singleTripDataArray;
	});
};

const createTripElement = function (tripEl) {
	const prototypeElement = document.querySelector(
		".excursions__item--prototype"
	);
	const tripElementWrapper = document.querySelector(".panel__excursions");

	tripEl.forEach(function (item) {
		const tripElement = prototypeElement.cloneNode(true);
		tripElement.classList.remove("excursions__item--prototype");
		implementTripData(tripElement, item);
		tripElementWrapper.appendChild(tripElement);
	});

	if (prototypeElement.classList.contains("excursions__item--prototype")) {
		prototypeElement.style.display = "none";
	}
};

const implementTripData = function (tripEl, element) {
	const tripTitle = tripEl.querySelector(".excursions__title");
	const tripDescription = tripEl.querySelector(".excursions__description");
	const tripPrice = tripEl.querySelectorAll(".excursions__price");

	const [, title, description, priceFirst, priceSecond] = element;
	tripTitle.innerText = title;
	tripDescription.innerText = description;
	tripPrice[0].innerText = priceFirst;
	tripPrice[1].innerText = priceSecond;
};

function makeTripSummary(e) {
	e.preventDefault();

	const singleTripEl = e.target.parentElement;
	const title = singleTripEl.querySelector(".excursions__title");
	const price = singleTripEl.querySelectorAll(".excursions__price");
	const numberInputList = e.target.querySelectorAll(".excursions__field-input");

	const adultsNumber = Number(e.target[0].value);
	const childrenNumber = Number(e.target[1].value);

	const basket = {
		title: title.innerText,
		adultNumber: adultsNumber,
		adultPrice: price[0].innerText,
		childNumber: childrenNumber,
		childPrice: price[1].innerText,
	};

	let errors = [];
	inputEvaluation(errors, adultsNumber, childrenNumber);

	numberInputList.forEach(function (numberInput) {
		numberInput.style.borderColor = "black";
	});

	if (errors.length > 0) {
		errors.forEach(function (error) {
			alert("Wpisz prawidłową liczbę osób");
		});
	} else {
		addTripToSummary(basket);
	}
}

const inputEvaluation = function (errorsArray, adultNr, childrenNr) {
	if (Number.isNaN(Number(adultNr)) || Number.isNaN(Number(childrenNr))) {
		errorsArray.push("To nie jest liczba");
	}
	if (adultNr < 0 || childrenNr < 0) {
		errorsArray.push("Nieprawidłowa wartość");
	}
	if (adultNr === 0 && childrenNr === 0) {
		errorsArray.push("Jedno pole jest wymagane");
	}
};

let finalPrice = 0;

const addTripToSummary = function (basketElement) {
	const basketSummaryWrapper = document.querySelector(".panel__summary");
	const basketSummaryTrip = createTripPrototype();

	const tripTitle = basketSummaryTrip.querySelector(".summary__name");
	const summaryTotalPrice = basketSummaryTrip.querySelector(
		".summary__total-price"
	);
	const removeButton = basketSummaryTrip.querySelector(".summary__btn-remove");
	const summaryPrices = basketSummaryTrip.querySelector(".summary__prices");

	tripTitle.innerText = basketElement.title;
	summaryTotalPrice.innerText =
		basketElement.adultNumber * basketElement.adultPrice +
		basketElement.childNumber * basketElement.childPrice +
		" PLN";

	summaryPrices.innerText =
		"dorośli: " +
		basketElement.adultNumber +
		" x 99PLN, dzieci: " +
		basketElement.childNumber +
		" x 50PLN";

	basketSummaryWrapper.appendChild(basketSummaryTrip);

	addFinalPrice(basketElement);
};

const createTripPrototype = function () {
	const basketSummaryWrapperEl = document.querySelector(".panel__summary");
	const basketSummaryPrototype = basketSummaryWrapperEl.querySelector(
		".summary__item--prototype"
	);
	const basketSummaryTripEl = basketSummaryPrototype.cloneNode(true);
	basketSummaryTripEl.classList.remove("summary__item--prototype");
	if (basketSummaryPrototype.classList.contains("summary__item--prototype")) {
		basketSummaryPrototype.classList.remove = "summary__item--prototype";
	}
	return basketSummaryTripEl;
};

const addFinalPrice = function (basketEl) {
	const basketSummaryWrapperElement = document.querySelector(".panel__summary");
	const tripsList =
		basketSummaryWrapperElement.querySelectorAll(".summary__item");
	const totalPrice = document.querySelector(".order__total-price-value");

	finalPrice +=
		parseFloat(basketEl.adultNumber * basketEl.adultPrice) +
		parseFloat(basketEl.childNumber * basketEl.childPrice);

	totalPrice.innerText = finalPrice + "PLN";
};

function submitOrder(e) {
	e.preventDefault();

	const inputList = e.target.querySelectorAll(".order__field-input");

	let errors = [];

	const alertsList = document.querySelector(".alertsList");
	alertsList.innerHTML = "";

	validateOrderForm(inputList, errors);

	if (errors.length === 0) {
		const email = document.querySelector('[name="email"]').value;
		const price = document.querySelector(
			".order__total-price-value"
		).textContent;
		alert(
			"Dziękujemy za złożenie zamówienia o wartości " +
				price +
				". Wszelkie szczegóły zamówienia zostały wysłane na adres email: " +
				email +
				" ."
		);
		resetForms();
	} else {
		errors.forEach(function (error) {
			const errorLiEl = document.createElement("li");
			errorLiEl.innerText = error;
			errorLiEl.style.color = "red";
			alertsList.appendChild(errorLiEl);
		});
	}
}

const validateOrderForm = function (inputListEl, errorsEl) {
	if (
		inputListEl[0].value === "" ||
		!Number.isNaN(Number(inputListEl[0].value))
	) {
		errorsEl.push("Podaj swoje imię i nazwisko");
	}

	if (inputListEl[1].value === "" || !inputListEl[1].value.includes("@")) {
		errorsEl.push("Adres email jest niepoprawny");
	}

	if (finalPrice === 0) {
		errorsEl.push("Wybierz wycieczkę");
		alert("Wybierz wycieczkę");
	}
};

const resetForms = function () {
	const panelSummary = document.querySelector(".panel__summary");
	while (panelSummary.children.length > 1) {
		panelSummary.removeChild(panelSummary.lastElementChild);
	}
	const allForms = document.querySelectorAll("form");
	allForms.forEach(function (form) {
		form.reset();
	});
};

function removeTrip(e) {
	e.preventDefault();
	const currentTrip = e.target;
	const panelSummary = e.currentTarget;

	const summaryTotalPrice = currentTrip.parentElement.querySelector(
		".summary__total-price"
	);
	const summaryItem = e.target.parentElement.parentElement;
	const summaryTotalPriceValue = document.querySelector(
		".order__total-price-value"
	);

	panelSummary.removeChild(summaryItem);
	updateTotalPrice();
}

function updateTotalPrice() {
	const summaryContainer = document.querySelector(".summary");
	const summaryPricesList = summaryContainer.querySelectorAll(
		".summary__total-price"
	);
	const totalPrice = document.querySelector(".order__total-price-value");
	let total = 0;
	summaryPricesList.forEach(price => {
		total += Number(price.innerText.replace("PLN", ""));
	});

	const sum = total - 199;
	totalPrice.innerText = sum + " PLN";
}
