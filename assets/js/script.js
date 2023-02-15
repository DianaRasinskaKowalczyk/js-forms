const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

const uploadFile = document.querySelector(".uploader__input");

uploadFile.addEventListener("change", readFile);

function readFile(e) {
	const file = e.target.files[0];

	if (file && file.type.includes("text")) {
		const reader = new FileReader();

		reader.onload = function (readerEvent) {
			const content = readerEvent.target.result;
			const contentSplit = content.split(/[\r\n]+/gm);

			const trip = tripData(contentSplit);
			console.log(trip);

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

	console.log(prototypeElement);
	const tripElementWrapper = document.querySelector(".panel__excursions");

	tripEl.forEach(function (item) {
		const tripElement = prototypeElement.cloneNode(true);
		console.log(tripElement);
		tripElement.classList.remove("excursions__item--prototype");

		const tripTitle = document.querySelector(".excursions__title");
		const tripDescription = document.querySelector(".excursions__description");
		const tripPrice = document.querySelectorAll(".excursions__price");

		tripTitle.innerText = item[1];
		tripDescription.innerText = item[2];
		tripPrice[0].innerText = item[3];
		tripPrice[1].innerText = item[4];

		tripElementWrapper.appendChild(tripElement);
	});

	// if (prototypeElement.classList.contains("excursions__item--prototype")) {
	// 	prototypeElement.style.display = "none";
	// }
};
