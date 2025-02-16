document.addEventListener('DOMContentLoaded', () => {
    const pokemonManager = new PokemonManager();
    let sessionCount = parseInt(localStorage.getItem('session-count') || '0');

    // Update session count display
    const updateSessionCount = () => {
        document.getElementById('session-count').textContent = sessionCount;
        localStorage.setItem('session-count', sessionCount.toString());
    };
    updateSessionCount();

    // Initialize timer
    const timer = new PomodoroTimer(async () => {
        // Handle completed Pomodoro session
        sessionCount++;
        updateSessionCount();

        const pokemon = await pokemonManager.getRandomPokemon();
        if (pokemon) {
            const rewardElement = document.getElementById('pokemon-reward');
            const spriteElement = document.getElementById('pokemon-sprite');
            const nameElement = document.getElementById('pokemon-name');

            spriteElement.src = pokemon.sprite;
            nameElement.textContent = pokemon.name;
            rewardElement.classList.remove('hidden');

            // Play Pokemon cry sound (you'll need to add this)
            // const cry = new Audio(`assets/sounds/cries/${pokemon.id}.mp3`);
            // cry.play();
        }
    });

    // Button event listeners
    document.getElementById('start-btn').addEventListener('click', () => {
        timer.start();
        document.getElementById('start-btn').disabled = true;
        document.getElementById('pause-btn').disabled = false;
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
        timer.pause();
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        timer.reset();
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
        document.getElementById('pokemon-reward').classList.add('hidden');
    });
}); 