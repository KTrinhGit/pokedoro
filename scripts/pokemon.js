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

    async getAllPokemon() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching all Pokemon:', error);
            return [];
        }
    }

    async displayFullCollection(container) {
        container.innerHTML = '';

        // Get all Gen 1 Pokemon
        const allPokemon = await this.getAllPokemon();

        // Create a map of caught Pokemon for quick lookup
        const caughtMap = new Map(
            this.collection.map(p => [p.name.toLowerCase(), p])
        );

        // Display progress stats
        const collectionHeader = document.createElement('div');
        collectionHeader.className = 'collection-header';
        collectionHeader.innerHTML = `
            <h2>Pokémon Collection</h2>
            <div class="collection-stats">
                Caught: ${this.collection.length} / 151
            </div>
        `;
        container.appendChild(collectionHeader);

        const grid = document.createElement('div');
        grid.className = 'collection-grid';

        // Create and append each Pokemon entry
        for (const pokemon of allPokemon) {
            const caught = caughtMap.get(pokemon.name);
            const pokemonId = pokemon.url.split('/')[6];
            const element = document.createElement('div');
            element.className = `pokemon-entry ${caught ? 'caught' : 'uncaught'}`;

            element.innerHTML = `
                <img src="${caught ? caught.sprite : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}" 
                     alt="${pokemon.name}"
                     style="${!caught ? 'filter: brightness(0) saturate(100%) invert(0);' : ''}">
                <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
            `;

            grid.appendChild(element);
        }

        container.appendChild(grid);
    }
} 