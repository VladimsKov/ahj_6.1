import CardSys from "./component";

export function saveData(container) {
  const cardsData = [];
  const cols = Array.from(container.querySelectorAll('.col'));
  for (let i = 0; i < cols.length; i++) {
    const cards = Array.from(cols[i].querySelectorAll('.card'));
    for (let j = 0; j < cards.length; j++) {
      cards[j] = cards[j].innerHTML;
    }
    cardsData[i] = cards;
  }
  localStorage.savedData = JSON.stringify(cardsData);
}

export function readSavedData(container) {
  const cardsData = JSON.parse(localStorage.getItem('savedData'));
  if (cardsData) {
    const cols = Array.from(container.querySelectorAll('.col'));
    for (let i = 0; i < cols.length; i++) {
      const btn = cols[i].querySelector('.addBtn');

      for (let j = 0; j < cardsData[i].length; j++) {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        btn.before(cardEl);
        cardEl.insertAdjacentHTML('beforeend', cardsData[i][j]);
        CardSys.closeCardEvents(container, cardEl);
      }
    }
  }
}
