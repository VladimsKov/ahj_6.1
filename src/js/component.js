import dragDropSet from "./dragDropSet";
import { saveData, readSavedData } from "./localSave";

export default class CardSys {
  constructor() {
    this.container = document.querySelector('.container');
    this.addBtns = this.container.querySelectorAll('.addBtn');
    for (let elem of this.addBtns) {
      elem.addEventListener('click', (evt) => {
        evt.currentTarget.classList.toggle('hidden');
        const addBlockEl = CardSys.createAddBlock();
        evt.currentTarget.after(addBlockEl);
        this.createCard(addBlockEl);
        addBlockEl.querySelector('textarea').focus();
      });
    };

    dragDropSet(this.container, this.addBtns);
    readSavedData(this.container);
  }

  //создание блока с текстовым  полем и кнопками для добавления
  static createAddBlock() {
    const field = document.createElement('div');
    field.classList.add('addfield');
    field.insertAdjacentHTML('beforeend', '<textarea class="textareastyle" rows="2"  maxlength="200" placeholder="Enter a title for this card"></textarea><button class="setbtn">Add Field</button><span>&#10006</span>'); return field;
  }
  //создание и вставка карточки с текстом из узла <textArea>
  createCard(elem) {
    const setBtn = elem.querySelector('.setbtn');
    const textArea = elem.querySelector('textarea');
    const btnEl = elem.closest('.col').querySelector('.addBtn');
    setBtn.addEventListener('click', () => {
      if (!textArea.value) {
        alert('Заполните данные');
        return;
      }
      const card = document.createElement('div');
      card.classList.add('card');
      card.append(textArea.value);
      btnEl.before(card);
      btnEl.classList.toggle('hidden');
      elem.remove();
      this.сloseCardBtn(card);
      saveData(this.container);
    });
    //кнопка удаления блока с <textarea>
    const closeBtn = elem.querySelector('span');
    closeBtn.addEventListener('click', () => {
      elem.remove();
      btnEl.classList.toggle('hidden');
    });
  }

  //кнопка удаления карточки:
  сloseCardBtn(cardEl) {
    cardEl.insertAdjacentHTML('afterbegin', '<div class="closecard hidden"><span>&#10006</span></div>');
    CardSys.closeCardEvents(this.container, cardEl);
  };

  static closeCardEvents(container, cardEl) {
    const closeCardBtn = cardEl.querySelector('.closecard');
    cardEl.addEventListener('mouseover', () => {
      closeCardBtn.classList.remove('hidden');
    });
    cardEl.addEventListener('mouseout', () => {
      closeCardBtn.classList.add('hidden');
    });
    closeCardBtn.addEventListener('click', () => {
      cardEl.remove();
      saveData(container);
    });
  }

  // установка / отключение hover-стилей при перетаскивании
  static dragElemsStyle(container, addBtns) {
    container.style.cursor = 'grabbing';
    for (let elem of addBtns) {
      elem.classList.add('addBtndragstyle');
    }
    const closecardElems = container.querySelectorAll('.closecard');
    closecardElems.forEach(elem => {
      elem.classList.add('hidden');
    });
  }

  static dragElemStyleOff(container, addBtns) {
    container.removeAttribute('style');
    for (let elem of addBtns) {
      elem.classList.remove('addBtndragstyle');
    }
  }

  //добавление свободного поля для вставки при перемещении над любым эл-ом <*.card>
  static freeInputFieldSet(container, evt, ghostEl, inputFieldCoords) {
    const closestEl = document.elementFromPoint(evt.clientX, evt.clientY);
    const { top } = closestEl.getBoundingClientRect();

    if (closestEl.classList.contains('card')) {
      const cardEls = container.querySelectorAll('.card');
      cardEls.forEach(elem => {
        if (elem != closestEl) {
          elem.removeAttribute('style');
        }
      });
      //запоминаем левую и правую границы для поля вставки:
      inputFieldCoords.left = closestEl.getBoundingClientRect().left;
      inputFieldCoords.right = closestEl.getBoundingClientRect().right;
      //добавить отступы для поля вставки ниже курсора
      if (evt.pageY > window.scrollY + top + closestEl.offsetHeight / 2) {
        closestEl.style.marginBottom = `${ghostEl.offsetHeight + 10}px`;
        closestEl.style.marginTop = '0';
        //запоминаем пустое поле вставки, которое ниже курсора и позицию поля относительно closestEl:
        inputFieldCoords.top = closestEl.getBoundingClientRect().bottom;
        inputFieldCoords.bottom = closestEl.getBoundingClientRect().bottom + ghostEl.offsetHeight + 10;
        inputFieldCoords.pos = 'bottom';

      } else {
        //добавить отступы для поля вставки выше курсора и позицию поля относительно closestEl:
        closestEl.style.marginBottom = '10px';
        closestEl.style.marginTop = `${ghostEl.offsetHeight + 10}px`;
        //запоминаем пустое поле вставки, которое выше курсора:
        inputFieldCoords.top = closestEl.getBoundingClientRect().top - ghostEl.offsetHeight - 10;
        inputFieldCoords.bottom = closestEl.getBoundingClientRect().top;
        inputFieldCoords.pos = 'top';
      }
      inputFieldCoords.lastOverEl = closestEl;
    }
  }
  //сброс доп. отступов для поля вставки у card-элементов
  static freeInputFieldOff(container) {
    const cardEls = container.querySelectorAll('.card');
    cardEls.forEach(elem => {
      elem.removeAttribute('style')
    });
  }
}
