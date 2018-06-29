'use strict';

var HOUSE_TYPES = {
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  flat: 'Квартира'
};
var TITLE_NAMES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OBJECT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES_SERVICES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_ARR = ['https://o0.github.io/assets/images/tokyo/hotel1.jpg', 'https://o0.github.io/assets/images/tokyo/hotel2.jpg', 'https://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomArrayElement = function (arr) {
  var randomIndexNumber = Math.floor(Math.random() * arr.length);
  return arr[randomIndexNumber];
};

var arrayShuffle = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

var createAds = function (quantity) {
  var objects = [];
  var numbersAvatar = [];
  for (var j = 0; j < quantity; j++) {
    numbersAvatar[j] = j + 1;
  }
  for (var i = 0; i < quantity; i++) {
    var obj = {};
    obj.author = {};
    obj.offer = {};
    obj.location = {};
    if (numbersAvatar[i] <= 9) {
      obj.author.avatar = 'img/avatars/user0' + numbersAvatar[i] + '.png';
    } else {
      obj.author.avatar = 'img/avatars/user' + numbersAvatar[i] + '.png';
    }
    obj.offer.title = getRandomArrayElement(TITLE_NAMES);
    obj.location.x = getRandomNumber(300, 900);
    obj.location.y = getRandomNumber(130, 630);
    obj.offer.address = obj.location.x + ', ' + obj.location.y;
    obj.offer.price = getRandomNumber(1000, 1000000);
    obj.offer.type = OBJECT_TYPE[getRandomNumber(0, 4)];
    obj.offer.rooms = getRandomNumber(1, 5);
    obj.offer.guests = getRandomNumber(1, 8);
    obj.offer.checkin = getRandomArrayElement(CHECKIN_TIMES);
    obj.offer.checkout = obj.offer.checkin;
    var NEW_FEATURES_SERVICES = FEATURES_SERVICES.slice();
    arrayShuffle(NEW_FEATURES_SERVICES);
    NEW_FEATURES_SERVICES.length = getRandomNumber(0, NEW_FEATURES_SERVICES.length);
    obj.offer.features = NEW_FEATURES_SERVICES;
    obj.offer.description = '';
    var NEW_PHOTOS_ARR = PHOTOS_ARR.slice();
    obj.offer.photos = arrayShuffle(NEW_PHOTOS_ARR);
    objects.push(obj);
  }
  return objects;
};

var ads = createAds(8);

var template = document.querySelector('template');
var templatePin = template.content.querySelector('.map__pin');

var renderPin = function (ad) {
  var pin = templatePin.cloneNode(true);
  var pinWidth = templatePin.offsetWidth;
  var pinHeight = templatePin.offsetHeight;
  pin.style.left = ad.location.x - pinWidth / 2 + 'px';
  pin.style.top = ad.location.y - pinHeight + 'px';
  pin.querySelector('img').src = ad.author.avatar;
  pin.querySelector('img').alt = ad.offer.title;
  return pin;
};

var fragmentPin = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  fragmentPin.appendChild(renderPin(ads[i]));
}
map.appendChild(fragmentPin);

var renderFeatures = function (arrFeatures) {
  var fragmentFeatures = document.createDocumentFragment();
  var newFeatureElement;
  for (i = 0; i < arrFeatures.length; i++) {
    newFeatureElement = document.createElement('li');
    newFeatureElement.className = 'popup__feature popup__feature--' + arrFeatures[i];
    fragmentFeatures.appendChild(newFeatureElement);
  }
  return fragmentFeatures;
};
var renderPhotos = function (arrPhotos) {
  var photosContainer = document.createDocumentFragment();
  var templatePhoto = template.content.querySelector('.popup__photo');
  for (i = 0; i < arrPhotos.length; i++) {
    var photoElement = templatePhoto.cloneNode(true);
    photoElement.src = arrPhotos[i];
    photosContainer.appendChild(photoElement);
  }
  return photosContainer;
};
var templateCard = template.content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');

var renderCard;
renderCard = function (ad) {
  var card = templateCard.cloneNode(true);
  card.querySelector('.popup__title').textContent = ad.offer.title;
  card.querySelector('.popup__text--address').textContent = ad.offer.address;
  card.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = HOUSE_TYPES[ad.offer.type];
  card.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  card.querySelector('.popup__features').textContent = '';
  card.querySelector('.popup__features').appendChild(renderFeatures(ad.offer.features));
  card.querySelector('.popup__description').textContent = ad.offer.description;
  card.querySelector('.popup__photos').textContent = '';
  card.querySelector('.popup__photos').appendChild(renderPhotos(ad.offer.photos));
  card.querySelector('.popup__avatar').src = ad.author.avatar;
  return card;
};
map.insertBefore(renderCard(ads[0]), mapFiltersContainer);
