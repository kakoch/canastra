const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const deck = [];

// Gere um baralho com 4 cópias de cada carta
for (let i = 0; i < 4; i++) {
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank}${suit}`);
        }
    }
}

// Embaralhe o baralho
shuffleDeck(deck);


function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

shuffleDeck(deck);
console.log(deck)
const player1Hand = document.getElementById('player1Hand');
const player2Hand = document.getElementById('player2Hand');
const drawCardButton = document.getElementById('drawCard');

let currentPlayer = 1;
const drawCount = document.getElementById('drawCount'); // Seleciona o elemento de contagem
drawCardButton.addEventListener('click', () => {
    if (remainingCards === 0) {
        alert('O monte de compra está vazio!');
        return;
    }

    const card = deck.pop();
    const cardElement = createCardElement(card);

    if (currentPlayer === 1) {
        player1Hand.appendChild(cardElement);
        sortPlayerHand(player1Hand); // Ordene as cartas do jogador 1
        currentPlayer = 2;
    } else {
        player2Hand.appendChild(cardElement);
        sortPlayerHand(player2Hand); // Ordene as cartas do jogador 2
        currentPlayer = 1;
    }

    remainingCards--; // Reduza a contagem de cartas disponíveis
    drawCount.textContent = `Cartas Restantes: ${remainingCards}`; // Atualize o texto exibido
});
// Defina a contagem inicial
let remainingCards = 60; // ou o número desejado de cartas no monte de compra

function createCardElement(card) {
    let number ;
    let classeNaipe ;
    if (card.length > 2) {
        number = card.substring(0, 2);
    } else {
        number = card.substring(0, 1);
    }
    const naipe = card.substring(card.length - 1);
    if(naipe == '♥' || naipe == '♦'){
        classeNaipe = 'naipeRed';
    }else{
        classeNaipe = 'naipeBlack';
    }
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.classList.add(naipe.toLowerCase()); // Adicione classe para o naipe
    const cardImage = `
                <div class="corner top">
                    <span class="number ${classeNaipe}">${number}</span>
                    <span class="suit ${classeNaipe}">${naipe}</span>
                </div>
                <div class="center ${classeNaipe}">${naipe}</div>
                <div class="corner bottom">
                    <span class="number ${classeNaipe}">${number}</span>
                    <span class="suit ${classeNaipe}">${naipe}</span>
                </div>
            `;
    cardElement.innerHTML = cardImage;
    return cardElement;
}

function checkEmptyHand(playerHand, deadPile) {
    if (playerHand.children.length === 0 && deadPile.children.length > 0) {
        // Todas as cartas do jogador estão no "morto," transferir para a mão
        while (deadPile.children.length > 0) {
            const card = deadPile.lastChild;
            playerHand.appendChild(card);
        }
        shuffleDeck(deck); // Embaralhe o baralho novamente
    }
}

// Distribuir 11 cartas para cada jogador no início
for (let i = 0; i < 11; i++) {
    const card1 = deck.pop(); // Carta para o jogador 1
    const card2 = deck.pop(); // Carta para o jogador 2

    player1Hand.appendChild(createCardElement(card1));
    player2Hand.appendChild(createCardElement(card2));

    // Adicione 11 cartas ao "morto" de cada jogador
    const deadCard1 = deck.pop();
    const deadCard2 = deck.pop();

    discardPile1.appendChild(createCardElement(deadCard1));
    discardPile2.appendChild(createCardElement(deadCard2));
}
function sortPlayerHand(playerHand) {
    const cards = Array.from(playerHand.children);
    cards.sort((a, b) => {
        const naipeA = a.querySelector('.suit').textContent;
        const naipeB = b.querySelector('.suit').textContent;
        const numberA = a.querySelector('.number').textContent;
        const numberB = b.querySelector('.number').textContent;
        
        if (naipeA !== naipeB) {
            // Ordene pelo naipe primeiro
            return naipeA.localeCompare(naipeB);
        } else {
            // Se o naipe for o mesmo, ordene pelo número
            return numberA.localeCompare(numberB);
        }
    });

    // Remova todas as cartas da mão do jogador
    while (playerHand.firstChild) {
        playerHand.removeChild(playerHand.firstChild);
    }

    // Adicione as cartas ordenadas de volta à mão do jogador
    for (const card of cards) {
        playerHand.appendChild(card);
    }
}