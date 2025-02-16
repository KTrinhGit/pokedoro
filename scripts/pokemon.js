class PokemonManager {
    constructor() {
        this.collection = this.loadCollection();
    }

    loadCollection() {
        const savedCollection = localStorage.getItem('pokemon-collection');
        return savedCollection ? JSON.parse(savedCollection) : [];
    }

    saveCollection() {
        localStorage.setItem('pokemon-collection', JSON.stringify(this.collection));
    }

    async getRandomPokemon() {
        // Gen 1 Pokémon range from 1-151
        const randomId = Math.floor(Math.random() * 151) + 1;
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();

            const pokemon = {
                id: data.id,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                sprite: data.sprites.front_default,
                dateEarned: new Date().toISOString()
            };

            this.collection.push(pokemon);
            this.saveCollection();
            return pokemon;
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
            return null;
        }
    }

    displayCollection(container) {
        container.innerHTML = '';
        this.collection.forEach(pokemon => {
            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'pokemon-card';
            pokemonElement.innerHTML = `
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
                <p>${pokemon.name}</p>
                <small>Caught: ${new Date(pokemon.dateEarned).toLocaleDateString()}</small>
            `;
            container.appendChild(pokemonElement);
        });
    }
} 