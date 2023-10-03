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
});

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
  //cardElement.classList.add(naipe.toLowerCase()); // Adicione classe para o naipe
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
  sortPlayerHand(player1Hand); // Ordene as cartas do jogador 1
  sortPlayerHand(player2Hand); // Ordene as cartas do jogador 2
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
let selectedCardsPlayer1 = []; // Array para armazenar as cartas selecionadas do jogador 1
let selectedCardsPlayer2 = []; // Array para armazenar as cartas selecionadas do jogador 2

const player1Cards = document.querySelectorAll("#player1Hand .card");
player1Cards.forEach((card) => {
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
          card.classList.add("left35");
          selectedCardsPlayer1.push(card);
        }
      }
    }
  });
});

// Adicione um evento de clique às cartas da mão do jogador 2
const player2Cards = document.querySelectorAll("#player2Hand .card");
player2Cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (currentPlayer === 2) {
      // Verifique o jogador atual
      if (!card.classList.contains("inTrash")) {
        // Verifique se a carta não está no lixo
        if (selectedCardsPlayer2.includes(card)) {
          // Se a carta já estiver selecionada, remova o destaque dela
          card.classList.remove("highlighted");
          selectedCardsPlayer2 = selectedCardsPlayer2.filter(
            (selectedCard) => selectedCard !== card
          );
        } else {
          // Se a carta não estiver selecionada, destaque ela e adicione ao array de cartas selecionadas do jogador 2
          card.classList.add("highlighted");
          card.classList.add("left35");
          selectedCardsPlayer2.push(card);
        }
      }
    }
  });
});
const discardButton = document.getElementById("discardButton");

discardButton.addEventListener("click", () => {
  const selectedCards =
    currentPlayer === 1 ? selectedCardsPlayer1 : selectedCardsPlayer2; // Escolha a array de cartas selecionadas com base no jogador atual

  if (selectedCards.length !== 1) {
    alert("Você só pode jogar uma carta no lixo de cada vez.");
    return;
  }

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

    // Alternar para o próximo jogador após o descarte
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  } else {
    alert("Você deve esperar o seu turno");
  }
  currentPlayerText.innerText = `Turno do Jogador ${currentPlayer}`;
  player1HasBuy = false;
  player2HasBuy = false;
});

const takeFromTrashButton = document.getElementById("takeFromTrashButton");

takeFromTrashButton.addEventListener("click", () => {
  const trashPile = document.getElementById("trashPile");
  const discardedCards = Array.from(trashPile.children);
  if (discardedCards.length === 0) {
    alert("Não há cartas no lixo.");
    return;
  }
  if (!player1HasBuy && !player2HasBuy) {
    discardedCards.forEach((card) => {
      // Verifique o jogador atual e mova as cartas do lixo para a mão dele
      if (currentPlayer === "1") {
        player1Hand.appendChild(card);
        player1HasTakenFromTrash = true;
      } else {
        player2Hand.appendChild(card);
        player2HasTakenFromTrash = true;
      }
      card.classList.remove("highlighted"); // Certifique-se de que a carta não esteja destacada
      card.classList.remove("left35"); // Certifique-se de que a carta não esteja destacada
      card.classList.remove("inTrash"); // Certifique-se de que a carta não esteja destacada
    });
  }else{
    alert("Você não pode pegar o lixo depois de comprar")
  }
});
