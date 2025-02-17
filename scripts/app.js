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

    // Navigation handling
    const timerSection = document.querySelector('.timer-section');
    const collectionSection = document.createElement('div');
    collectionSection.className = 'collection-section';
    document.querySelector('.main-content').appendChild(collectionSection);

    // Home button (first nav button)
    const homeButton = document.querySelector('.nav-item:first-child');
    homeButton.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        homeButton.classList.add('active');

        timerSection.classList.remove('hidden');
        collectionSection.classList.remove('active');
    });

    // Collection button
    const collectionButton = document.getElementById('collection-nav');
    collectionButton.addEventListener('click', async () => {
        console.log('Collection button clicked'); // Debug log

        // Update active states
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        collectionButton.classList.add('active');

        // Hide timer, show collection
        timerSection.classList.add('hidden');
        collectionSection.classList.add('active');

        // Display the collection
        try {
            await pokemonManager.displayFullCollection(collectionSection);
        } catch (error) {
            console.error('Error displaying collection:', error);
        }
    });
}); 