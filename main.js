let totalCount = 0;
let nextPage = '';
let prevPage = '';

const pokemonName = document.querySelector('input');
const pokemonContainer = document.querySelector(
  '.pokemon-container'
);
const pages = document.querySelector('pagination');

const prevButtons = document.querySelectorAll('.prev');
const pagesButtons = document.querySelectorAll('a');

pagesButtons.forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();

    if (button.className === 'next') {
      const data = await fetchNextOrPrevPokemonPage(
        nextPage
      );
      nextPage = data.next;
      prevPage = data.previous;

      pokemonContainer.innerHTML = '';
      renderPokemonList(data.results);
    } else {
      const data = await fetchNextOrPrevPokemonPage(
        prevPage
      );
      nextPage = data.next;
      prevPage = data.previous;

      pokemonContainer.innerHTML = '';
      renderPokemonList(data.results);
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const {
    count,
    results: pokemonList,
    next,
    previous
  } = await fetchPokemonList();
  totalCount = count;
  nextPage = next;
  prevPage = previous;

  const pages = Math.ceil(count / 20);

  renderPokemonList(pokemonList);
});

pokemonName.addEventListener('keydown', searchPokemon);

function searchPokemon() {
  const inputValue = pokemonName.value;
  const cards = document.querySelectorAll('.pokemon-card');

  for (const card of cards) {
    const pokemonName =
      card.querySelector('h1').textContent;

    if (pokemonName.includes(inputValue)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  }
}

async function fetchPokemonList(next) {
  const response = await fetch(
    next || 'https://pokeapi.co/api/v2/pokemon/',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await response.json();

  return data;
}

async function fetchPokemon(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  return data;
}

async function fetchNextOrPrevPokemonPage(nextPage) {
  const response = await fetch(nextPage, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  return data;
}

async function renderPokemonList(pokemonList) {
  for (const [i, pokemon] of pokemonList.entries()) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const number = document.createElement('p');
    const name = document.createElement('h1');
    const types = document.createElement('p');
    types.textContent = 'Types: ';

    const fetchedPokemon = await fetchPokemon(pokemon.url);

    for (const type of fetchedPokemon.types) {
      types.textContent += type.type.name;
    }

    img.setAttribute(
      'src',
      fetchedPokemon.sprites.other['official-artwork']
        .front_default
    );
    img.setAttribute('alt', pokemon.name);

    div.appendChild(img);

    div.className = 'pokemon-card';
    number.textContent = `#${fetchedPokemon.id}`;
    div.appendChild(number);
    div.appendChild(name);

    name.textContent = pokemon.name;

    div.appendChild(types);

    pokemonContainer.appendChild(div);
  }
}
