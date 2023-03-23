import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
  countryDiv: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));
refs.list.addEventListener('click', onListClick);

function onInputSearch(e) {
  const value = e.target.value.trim();
  if (value === '') {
    clearContent();
    return;
  }
  fetchCountries(value)
    .then(response => {
      if (response.length > 10) {
        clearContent();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (response.length === 1) {
        clearContent();
        render(response, countryTpl, refs.countryDiv);
        return;
      }
      clearContent();
      render(response, listTlp, refs.list);
    })
    .catch(errNotify);
}
function onListClick(e) {
  if (e.target.nodeName !== 'LI') {
    return;
  }
  let name = e.target.dataset.value;
  fetchCountries(name)
    .then(response => {
      const findedCountry = response.find(country => {
        return country.name.common === name;
      });
      clearContent();
      refs.countryDiv.insertAdjacentHTML(
        'beforeend',
        countryTpl(findedCountry)
      );
    })
    .catch(errNotify);
}

function errNotify(err) {
  Notify.failure('Oops, there is no country with that name');
  console.log(err);
  clearContent();
}

function clearContent() {
  refs.list.innerHTML = '';
  refs.countryDiv.innerHTML = '';
}

function render(data, template, elToInsert) {
  const tlp = data.map(template).join('');
  elToInsert.insertAdjacentHTML('beforeend', tlp);
}
function listTlp(data) {
  return `<li data-value='${data.name.common}'>
    <img class="flag" src="${data.flags.svg}">
    ${data.name.official}
  </li>`;
}

function countryTpl(data) {
  const lang = Object.values(data.languages);
  return `<div class="country-name">
  <img class="flag" src="${data.flags.svg}">
  <h2>${data.name.official}</h2>
  </div>
  <ul class="country-info__list">
    <li><span class='text'>Capital: </span>${data.capital}</li>
    <li><span class='text'>Population: </span>${data.population}</li>
    <li><span class='text'>${
      lang.length > 1 ? 'Languages' : 'Language'
    }: </span>${lang.join(', ')}</li>
  </ul>`;
}
