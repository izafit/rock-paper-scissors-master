const openModalBtn = document.querySelector(".open-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modalOverlay = document.querySelector(".modal-overlay");
const resultButtonElement = document.querySelector(".result__button");

const playerWinsLSKey = "playerWins";
const AIWinsLSKey = "AIWins";

const winningResultMap = {
  paper: ["rock"],
  rock: ["scissors"],
  scissors: ["paper"],
};

let state = {
  playerWins: Number(localStorage.getItem(playerWinsLSKey)) || 0,
  AIWins: Number(localStorage.getItem(AIWinsLSKey)) || 0,
  playerPick: null,
  AIPick: null,
};

const renderScore = () => {
  const pointsElement = document.querySelector(".points");
  pointsElement.innerText = state.playerWins - state.AIWins;
};

const bindPickEvents = () => {
  document.querySelectorAll(".options button").forEach((button) => {
    button.addEventListener("click", pick);
  });

  document.querySelector(".result__button").addEventListener("click", reset);
};

const pick = (e) => {
  pickByPlayer(e.currentTarget.dataset.pick);
  pickByAI();
  hideOptions();
  showFight();
};

const pickByPlayer = (pickedOption) => {
  state = {
    ...state,
    playerPick: pickedOption,
  };
};

const pickByAI = () => {
  const options = ["rock", "paper", "scissors"];
  const AIPick = options[Math.floor(Math.random() * options.length)];

  state = {
    ...state,
    AIPick,
  };
};

const hideOptions = () => {
  const optionsElement = document.querySelector(".options");
  optionsElement.classList.add("slide-left");
};

const showFight = () => {
  const fightElement = document.querySelector(".fight");
  fightElement.classList.add("slide-left");
  createElementPickedByPlayer();
  createElementPickedByAI();

  document.querySelectorAll(".options button").forEach((button) => {
    button.setAttribute("tabindex", -1);
  });
  document.querySelector(".result__button").setAttribute("tabindex", 0);

  showResult();
};

const showResult = () => {
  const resultTextElement = document.querySelector(".result__text");

  if (state.AIPick === state.playerPick) {
    resultTextElement.innerHTML = "DRAW";
  } else if (winningResultMap[state.playerPick].includes(state.AIPick)) {
    resultTextElement.innerHTML = "YOU WIN";
    state = {
      ...state,
      playerWins: state.playerWins + 1,
    };
    localStorage.setItem(playerWinsLSKey, state.playerWins);
    setTimeout(() => highlightWinner("player"), 800);
  } else {
    resultTextElement.innerHTML = "YOU LOSE";
    state = {
      ...state,
      AIWins: state.AIWins + 1,
    };
    localStorage.setItem(AIWinsLSKey, state.AIWins);

    resultButtonElement.classList.add("lost");
    setTimeout(() => highlightWinner("ai"), 800);
  }

  setTimeout(renderResult, 1200);

  renderScore();
};

const renderResult = () => {
  document.querySelector(".result").classList.add("shown");
  document.querySelector(".pick--player").classList.add("moved");
  document.querySelector(".pick--ai").classList.add("moved");
};

const createElementPickedByPlayer = () => {
  const playerPick = state.playerPick;

  const pickContainerElement = document.querySelector(
    ".pick__container--player"
  );

  pickContainerElement.innerHTML = "";
  pickContainerElement.appendChild(createPickElement(playerPick));
};

const createElementPickedByAI = () => {
  const AIPick = state.AIPick;

  const pickContainerElement = document.querySelector(".pick__container--ai");

  pickContainerElement.innerHTML = "";
  pickContainerElement.appendChild(createPickElement(AIPick));
};

const createPickElement = (option) => {
  const pickElement = document.createElement("div");
  pickElement.classList.add(`button`, `button--${option}`);

  const imageContainerElement = document.createElement("div");
  imageContainerElement.classList.add("button__image-container");

  const imageElement = document.createElement("img");
  imageElement.src = `./images/icon-${option}.svg`;
  imageElement.alt = option;

  imageContainerElement.appendChild(imageElement);
  pickElement.appendChild(imageContainerElement);

  return pickElement;
};

const highlightWinner = (winner) => {
  if (winner === "player") {
    document
      .querySelector(".pick__container--player .button")
      .classList.add("winner");
  } else if (winner === "ai") {
    document
      .querySelector(".pick__container--ai .button")
      .classList.add("winner");
  }
};

const reset = () => {
  const fightElement = document.querySelector(".fight");
  fightElement.classList.remove("slide-left");

  const optionsElement = document.querySelector(".options");
  optionsElement.classList.remove("slide-left");

  document.querySelectorAll(".options button").forEach((button) => {
    button.setAttribute("tabindex", 0);
  });
  document.querySelector(".result__button").setAttribute("tabindex", -1);

  resultButtonElement.classList.remove("lost");
  document.querySelectorAll(".button.winner").forEach((button) => {
    button.classList.remove("winner");
  });

  document.querySelector(".result").classList.remove("shown");
  document.querySelector(".pick--player").classList.remove("moved");
  document.querySelector(".pick--ai").classList.remove("moved");
};

openModalBtn.addEventListener("click", () => {
  modalOverlay.classList.add("show");
});

closeModalBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("show");
});

const init = () => {
  renderScore();
  bindPickEvents();
};

init();
