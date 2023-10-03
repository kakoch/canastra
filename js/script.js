const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

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

let currentPlayer = 1;
const player1Hand = document.getElementById("player1Hand");
const player2Hand = document.getElementById("player2Hand");
const drawCardButton = document.getElementById("drawCard");
const trashPile = document.getElementById("trashPile");
let player1HasTakenFromTrash = false;
let player2HasTakenFromTrash = false;
let player1HasBuy = false;
let player2HasBuy = false;

const drawCount = document.getElementById("drawCount"); // Seleciona o elemento de contagem
drawCardButton.addEventListener("click", () => {
  if (remainingCards === 0) {
    alert("O monte de compra está vazio!");
    return;
  }

  if (currentPlayer === 1) {
    if (!player1HasTakenFromTrash && !player1HasBuy) {
      // Verifique se o jogador 1 não pegou cartas do lixo neste turno
      // Jogador 1 pode comprar uma carta
      const card = deck.pop();
      const cardElement = createCardElement(card);
      player1Hand.appendChild(cardElement);
      sortPlayerHand(player1Hand); // Ordene as cartas do jogador 1
      player1HasBuy = true;
    } else {
      alert("Você já comprou cartas ou pegou do lixo neste turno.");
    }
  } else {
    if (!player2HasTakenFromTrash && !player2HasBuy) {
      // Verifique se o jogador 2 não pegou cartas do lixo neste turno
      // Jogador 2 pode comprar uma carta
      const card = deck.pop();
      const cardElement = createCardElement(card);
      player2Hand.appendChild(cardElement);
      sortPlayerHand(player2Hand); // Ordene as cartas do jogador 2
      player2HasBuy = true;
    } else {
      alert("Você já comprou cartas ou pegou do lixo neste turno.");
    }
  }

  remainingCards--; // Reduza a contagem de cartas disponíveis
  drawCount.textContent = `Cartas Restantes: ${remainingCards}`; // Atualize o texto exibido

  // Verifique se a mão do jogador está vazia e transfira cartas do "morto" se necessário
  if (currentPlayer === 1 && player1Hand.children.length === 0) {
    transferDeadPileToHand(player1Hand, discardPile1);
  } else if (currentPlayer === 2 && player2Hand.children.length === 0) {
    transferDeadPileToHand(player2Hand, discardPile2);
  }
});

function transferDeadPileToHand(playerHand, deadPile) {
  while (deadPile.children.length > 0) {
    const card = deadPile.lastChild;
    const cardElement = createCardElement(card.textContent); // Crie um novo elemento de carta
    playerHand.appendChild(cardElement);
    cardElement.addEventListener("click", () => {
      // Adicione novamente o evento de clique
      selectCard(cardElement);
    });
  }
  shuffleDeck(deck); // Embaralhe o baralho novamente após a transferência
  sortPlayerHand(playerHand); // Ordene as cartas na mão do jogador
}

// Defina a contagem inicial
let remainingCards = 60; // ou o número desejado de cartas no monte de compra

function createCardElement(card) {
  let number;
  let classeNaipe;
  if (card.length > 2) {
    number = card.substring(0, 2);
  } else {
    number = card.substring(0, 1);
  }
  const naipe = card.substring(card.length - 1);
  if (naipe == "♥" || naipe == "♦") {
    classeNaipe = "naipeRed";
  } else {
    classeNaipe = "naipeBlack";
  }
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.classList.add(number + naipe);
  const cardImage = `
                <div class="corner top">
                    <span class="number ${classeNaipe} ">${number}</span>
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

  //discardPile1.appendChild(createCardElement(deadCard1));
  //discardPile2.appendChild(createCardElement(deadCard2));
  sortPlayerHand(player1Hand); // Ordene as cartas do jogador 1
  sortPlayerHand(player2Hand); // Ordene as cartas do jogador 2
}
function sortPlayerHand(playerHand) {
  const cards = Array.from(playerHand.children);

  cards.sort((a, b) => {
    const naipeA = a.querySelector(".suit").textContent;
    const naipeB = b.querySelector(".suit").textContent;
    const numberA = valueForEspecialCards(
      a.querySelector(".number").textContent
    );
    const numberB = valueForEspecialCards(
      b.querySelector(".number").textContent
    );

    if (naipeA !== naipeB) {
      // Ordene pelo naipe primeiro
      return naipeA.localeCompare(naipeB);
    } else {
      // Se o naipe for o mesmo, ordene pelo número
      return numberA - numberB;
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
function valueForEspecialCards(cardNumber) {
  // Converte o número da carta para um valor numérico
  switch (cardNumber) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    case "10":
      return 10;
    default:
      return parseInt(cardNumber);
  }
}
// Adicione um evento de clique às cartas da mão do jogador 1
// Adicione um evento de clique às cartas da mão do jogador 1
let selectedCardsPlayer1 = []; // Array para armazenar as cartas selecionadas do jogador 1
let selectedCardsPlayer2 = []; // Array para armazenar as cartas selecionadas do jogador 2

let player1Cards = document.querySelectorAll("#player1Hand .card");
player1Cards.forEach(selectCard);

// Adicione um evento de clique às cartas da mão do jogador 2
let player2Cards = document.querySelectorAll("#player2Hand .card");
player2Cards.forEach(selectCard);

function selectCard(card) {
  card.addEventListener("click", () => {
    if (currentPlayer === 1) {
      // Verifique o jogador atual
      if (!card.classList.contains("inTrash")) {
        // Verifique se a carta não está no lixo
        if (selectedCardsPlayer1.includes(card)) {
          // Se a carta já estiver selecionada, remova o destaque dela
          card.classList.remove("highlighted");
          selectedCardsPlayer1 = selectedCardsPlayer1.filter(
            (selectedCard) => selectedCard !== card
          );
        } else {
          // Se a carta não estiver selecionada, destaque ela e adicione ao array de cartas selecionadas do jogador 1
          card.classList.add("highlighted");
          selectedCardsPlayer1.push(card);
        }
      }
    } else {
      if (!card.classList.contains("inTrash")) {
        if (selectedCardsPlayer2.includes(card)) {
          card.classList.remove("highlighted");
          selectedCardsPlayer2 = selectedCardsPlayer2.filter(
            (selectedCard) => selectedCard !== card
          );
        } else {
          card.classList.add("highlighted");
          selectedCardsPlayer2.push(card);
        }
      }
    }
  });
}
const discardButton = document.getElementById("discardButton");

discardButton.addEventListener("click", () => {
  const selectedCards =
    currentPlayer === 1 ? selectedCardsPlayer1 : selectedCardsPlayer2; // Escolha a array de cartas selecionadas com base no jogador atual
  let player1Card = Array.from(player1Cards)
  let player2Card = Array.from(player2Cards)
  if (currentPlayer == 1) {
    if (player1HasBuy || player1HasTakenFromTrash) {
      updateTrash();
    } else {
      alert("Você só pode jogar uma carta fora de pois comprar ou rapar")
    }
  } else if (currentPlayer == 2) {
    if (player2HasBuy || player2HasTakenFromTrash) {
      updateTrash();
    } else {
      alert("Você só pode jogar uma carta fora de pois comprar ou rapar")
    }
  }
  if (selectedCards.length !== 1) {
    alert("Você só pode jogar uma carta no lixo de cada vez.");
    return;
  }

  function updateTrash() {
    const trashPile = document.getElementById("trashPile");
    const selectedCard = selectedCards[0]; // Pega a única carta selecionada
    const currentPlayerText = document.getElementById("currente-player");

    // Verifique se é o turno do jogador atual
    if (
      (currentPlayer === 1 && selectedCard.parentElement === player1Hand) ||
      (currentPlayer === 2 && selectedCard.parentElement === player2Hand)
    ) {
      trashPile.appendChild(selectedCard); // Mova a carta selecionada para o lixo
      selectedCard.classList.remove("highlighted"); // Remova o destaque da carta
      selectedCard.classList.add("inTrash"); // Adicione a classe para indicar que a carta está no lixo
      selectedCards.length = 0; // Limpe o array de cartas selecionadas

      // Remova a carta da array player1Cards ou player2Cards
      if (currentPlayer === 1) {
        const index = player1Card.indexOf(selectedCard);
        if (index !== -1) {
          player1Card.splice(index, 1); // Remove a carta da array
          sortPlayerHand(player1Hand)
          console.log(player1Card)
        }
      } else {
        const index = player2Card.indexOf(selectedCard);
        if (index !== -1) {
          player2Card.splice(index, 1); // Remove a carta da array
          sortPlayerHand(player2Hand)
          console.log(player2Card)
        }
      }

      // Alternar para o próximo jogador após o descarte
      currentPlayer = currentPlayer === 1 ? 2 : 1;
    } else {
      alert("Você deve esperar o seu turno");
    }
    currentPlayerText.innerText = `Turno do Jogador ${currentPlayer}`;
    player1HasBuy = false;
    player2HasBuy = false;
    player2Cards = player2Card;
    player1Cards = player1Card;
    console.log('mao do jogador1' + player1Cards)

    console.log('mao do jogador 2' + player2Cards)
  }
});


const takeFromTrashButton = document.getElementById("takeFromTrashButton");

takeFromTrashButton.addEventListener("click", () => {
  const trashPile = document.getElementById("trashPile");
  const discardedCards = Array.from(trashPile.children);
  let player1Card = Array.from(player1Cards)
  let player2Card = Array.from(player2Cards)
  if (discardedCards.length === 0) {
    alert("Não há cartas no lixo.");
    return;
  }
  if (!player1HasBuy && !player2HasBuy) {
    discardedCards.forEach((card) => {
      // Verifique o jogador atual e mova as cartas do lixo para a mão dele
      if (currentPlayer == 1) {
        player1Card.push(card);
        player1Cards = player1Card;
        player1Hand.appendChild(card);
        sortPlayerHand(player1Hand)
        player1HasTakenFromTrash = true;
      } else {
        player2Card.push(card);
        player2Cards = player2Card;
        player2Hand.appendChild(card);
        sortPlayerHand(player2Hand)
        player2HasTakenFromTrash = true;
      }
      card.classList.remove("highlighted");
      card.classList.remove("left35");
      card.classList.remove("inTrash");
    });
  } else {
    alert("Você não pode pegar o lixo depois de comprar");
  }

});

