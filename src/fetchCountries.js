const url = 'https://restcountries.com/v3.1';
const fields = 'name,capital,population,flags,languages';

export const fetchCountries = name => {
  return fetch(`${url}/name/${name}/?fields=${fields}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
