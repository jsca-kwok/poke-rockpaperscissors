const url = 'https://api.pokemontcg.io/v1/'
const cards = 'cards';
const type = '?types=';
const fire = 'fire';
const grass = 'grass';
const water = 'water';
const ground = 'ground';
let playerScore = 0;
let computerScore = 0;

// get cards
const getCards = (container) => {
    axios
        .get(url + cards + type + `${fire}|${grass}|${water}`)
        .then(res => {
            for (let i = 0; i < 5; i++) {
                let j = Math.floor(Math.random() * 100) + 1;
                displayPlayerCards(res.data.cards[j], container);
            }
        })
        .catch(err => console.log(err));
    }

const getComputerCards = (container) => {
    getCards(container);
}

const getPlayerCards = (container) => {
    getCards(container);
}

//display cards
const displayPlayerCards = (card, container) => {
    const characterCard = document.createElement('div');
    characterCard.classList.add('card__single');
    characterCard.classList.add(card.types);
    if (container === '.card__player-container') {
        characterCard.classList.add('card__single--player');
        cardClickListener(characterCard);
    } else {
        characterCard.classList.add('card__single--computer');
    }
    const characterImage = document.createElement('img');
    characterImage.classList.add('card__image');
    characterImage.setAttribute('src', card.imageUrl);
    characterCard.appendChild(characterImage);
    const characterType = document.createElement('p');
    characterType.classList.add('card__type');
    characterCard.appendChild(characterType);
    characterType.innerText = card.types;
    const characterContainer = document.querySelector(container);
    characterContainer.classList.add('card__container');
    characterContainer.appendChild(characterCard);
}

//start game
const startButton = document.querySelector('button');
startButton.addEventListener('click', () => {
    const gameTitle = document.querySelector('h1');
    if (gameTitle) {
        gameTitle.style.display = 'none';
    }
    getPlayerCards('.card__player-container');
    getComputerCards('.card__computer-container');
    const deckHeading = document.querySelectorAll('.card__text');
    deckHeading.forEach((heading) => {
        heading.style.visibility = 'initial';
    })
    startButton.disabled = true;
    startButton.style.display = 'none';
    const instructions = document.createElement('p');
    instructions.classList.add('instructions')
    const battlefield = document.querySelector('.card__battlefield');
    instructions.innerText = 'Choose your Pokémon. Fire beats Grass. Grass beats Water. Water beats Fire.';
    battlefield.appendChild(instructions);
})

//player select card
const cardClickListener = (card) => {
    card.addEventListener('click', () => {cardClickHandler(card)});
}

const cardClickHandler = (card) => {
    const instructions = document.querySelector('.instructions');
    if (instructions) {
        instructions.style.display = 'none';
    }
    const battlefield = document.querySelector('.card__battlefield');
    battlefield.style.flexDirection = 'row';
    card.style.backgroundColor = '#C04C4B';
    card.setAttribute('id', 'player');
    enterBattlefield(card);
    setTimeout(() => {
        randomCardPlay();
        }, 1500);
    setTimeout(() => {
        resultDisplay(compareCards())}, 3500);
}

//computer select card
const randomCardPlay = () => {
    const computerCard = document.querySelectorAll('.card__computer-container .card__single');
    let cardsLeft = document.querySelectorAll('.card__computer-container .card__single').length
    const randomNumber = Math.floor(Math.random() * cardsLeft);
    const randomCard = computerCard[randomNumber];
    randomCard.style.backgroundColor = '#6EA4BB';
    randomCard.setAttribute('id', 'computer');
    const battlefield = document.querySelector('.card__battlefield');
    battlefield.appendChild(randomCard);
}

//play selected card
const enterBattlefield = (card) => {
    const battlefield = document.querySelector('.card__battlefield');
    battlefield.appendChild(card);
}

//compare cards in battlefield
const compareCards = () => {
    const player = document.getElementById('player');
    const computer = document.getElementById('computer');
    if (player.classList.contains('Fire') && computer.classList.contains('Fire')) {
        return `It's a tie! >> click to continue`;
    } else if (player.classList.contains('Water') && computer.classList.contains('Water')) {
        return `It's a tie! >> click to continue`;
    } else if (player.classList.contains('Grass') && computer.classList.contains('Grass')) {
        return `It's a tie! >> click to continue`;
    } else if (player.classList.contains('Fire') && computer.classList.contains('Grass')) {
        playerScore += 1
        document.querySelector('.score-player').innerText = playerScore;
        return `You win! >> click to continue`;
    } else if (player.classList.contains('Grass') && computer.classList.contains('Water')) {
        playerScore += 1
        document.querySelector('.score-player').innerText = playerScore;
        return `You win! >> click to continue`;
    } else if (player.classList.contains('Water') && computer.classList.contains('Fire')) {
        playerScore += 1
        document.querySelector('.score-player').innerText = playerScore;
        return `You win! >> click to continue`;
    } else {
        computerScore += 1;
        document.querySelector('.score-computer').innerText = computerScore;
        return `You lose. >> click to continue`;
    }
}

//result display
const resultDisplay = (result) => {
    const winOrLose = document.createElement('p');
    winOrLose.classList.add('result');
    const battlefield = document.querySelector('.card__battlefield');
    winOrLose.innerText = result;
    battlefield.appendChild(winOrLose);
    const cards = document.querySelectorAll('.card__single');
    nextRound();
}

//click away result
const nextRound = () => {
    const result = document.querySelector('.result');
    const battlefield = document.querySelector('.card__battlefield');
    result.addEventListener('click', () => {
        while (battlefield.firstChild) {
            battlefield.removeChild(battlefield.lastChild);
        }
        const instructions = document.createElement('p');
        instructions.classList.add('instructions');
        battlefield.appendChild(instructions);
        instructions.innerText = 'Choose your Pokémon. Fire beats Grass. Grass beats Water. Water beats Fire.';
        announceWinner();
    })
}

//no cards left
const announceWinner = () => {
    const cardsLeft = document.querySelectorAll('.card__single').length;
    if (cardsLeft === 0) {
        const instructions = document.querySelector('.instructions');
        instructions.style.display = 'none';
        const result = document.createElement('p');
        const battlefield = document.querySelector('.card__battlefield');
        battlefield.style.flexDirection = 'column';
        result.classList.add('result--final');
        battlefield.appendChild(result);
        const reset = document.createElement('button');
        reset.classList.add('button__reset');
        reset.setAttribute('onclick', "window.location.reload();");
        reset.innerText = `Play again!`;
        battlefield.appendChild(reset);
    } else {
        return;
    }
    if (playerScore > computerScore) {
        document.querySelector('.result--final').innerText = `You're the Pokémon Master!`;
    } else if (playerScore < computerScore) {
        document.querySelector('.result--final').innerText = `You lost the battle.`;
    } else {
        document.querySelector('.result--final').innerText = `It's a tie.`;
    }
}

//play again
// resetButton = document.querySelector('.button__reset');
// document.querySelector('.button__reset').addEventListener('click', () => {
//     location.reload();
// })