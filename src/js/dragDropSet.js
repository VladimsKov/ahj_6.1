import CardSys from './component';
import { saveData } from './localSave';

export default function dragDropSet(container, addBtns) {
  let draggedEl = null;
  let ghostEl = null;
  let EvtGhostElLeft;
  let EvtGhostElTop;
  let inputFieldCoords = {};

  // действия при нажатии кнопки мыши
  container.addEventListener('mousedown', (evt) => {
    if (!evt.target.classList.contains('card')) return;
    evt.preventDefault();
    container.style.cursor = 'grab';
    draggedEl = evt.target;
    ghostEl = evt.target.cloneNode(true);
    ghostEl.classList.add('dragged');
    document.body.appendChild(ghostEl);

    // выставление стартовых размеров и координат для ghostEl:
    const { top } = draggedEl.getBoundingClientRect();
    const { left } = draggedEl.getBoundingClientRect();
    ghostEl.style.left = `${left}px`;
    ghostEl.style.top = `${top}px`;
    ghostEl.style.width = `${draggedEl.offsetWidth}px`;
    ghostEl.style.height = `${draggedEl.offsetHeight}px`;

    EvtGhostElLeft = evt.pageX - left;
    EvtGhostElTop = evt.pageY - top;
  });

  // действия при движении нажатой мыши
  container.addEventListener('mousemove', (evt) => {
    evt.preventDefault();
    if (!ghostEl) {
      return;
    }

    CardSys.dragElemsStyle(container, addBtns);
    ghostEl.style.left = `${evt.pageX - EvtGhostElLeft}px`;
    ghostEl.style.top = `${evt.pageY - EvtGhostElTop}px`;

    // создание свободного поля для вставки
    inputFieldCoords = CardSys.freeInputFieldSet(container, evt, ghostEl);
    draggedEl.classList.add('hidden');
  });

  // действия при выходе за границы области перетаскивания
  container.addEventListener('mouseleave', () => {
    if (!ghostEl) {
      return;
    }
    document.body.removeChild(ghostEl);
    ghostEl = null;
    draggedEl.classList.remove('hidden');
    CardSys.dragElemStyleOff(container, addBtns);
    CardSys.freeInputFieldOff(container);
  });
  // действия при отпускании кнопки мыши
  container.addEventListener('mouseup', (evt) => {
    if (!ghostEl) {
      return;
    }
    const closest = document.elementFromPoint(evt.clientX, evt.clientY);
    const closestCol = evt.target.closest('.col');

    // вставка в пустую колонку
    if (closestCol && closestCol.querySelector('.card') === null) {
      const titleEl = closestCol.querySelector('.colTitle');
      titleEl.after(draggedEl);

      document.body.removeChild(ghostEl);
      ghostEl = null;
      draggedEl.classList.remove('hidden');
      CardSys.dragElemStyleOff(container, addBtns);
      CardSys.freeInputFieldOff(container);
      saveData(container);
      return;
    }

    // вставка, когда курсор над пустым полем для вставки:
    if (!evt.target.classList.contains('card')) {
      const topBorder = window.scrollY + inputFieldCoords.top;
      const bottomBorder = window.scrollY + inputFieldCoords.bottom;
      const leftBorder = window.scrollX + inputFieldCoords.left;
      const rightBorder = window.scrollX + inputFieldCoords.right;

      if (evt.pageY > topBorder && evt.pageY < bottomBorder
        && evt.pageX > leftBorder && evt.pageX < rightBorder) {
        const cardEls = Array.from(container.querySelectorAll('.card'));
        const lastEl = cardEls.find((item) => item === inputFieldCoords.lastOverEl);

        if (inputFieldCoords.pos === 'top') {
          lastEl.before(draggedEl);
        }
        if (inputFieldCoords.pos === 'bottom') {
          lastEl.after(draggedEl);
        }
      }

      document.body.removeChild(ghostEl);
      ghostEl = null;
      draggedEl.classList.remove('hidden');
      CardSys.dragElemStyleOff(container, addBtns);
      CardSys.freeInputFieldOff(container);
      saveData(container);
      return;
    }

    // вставка, когда курсор над элементом <.card>:
    const { top } = closest.getBoundingClientRect();
    if (evt.pageY > window.scrollY + top + closest.offsetHeight / 2) {
      closest.after(draggedEl);
    } else {
      closest.before(draggedEl);
    }
    document.body.removeChild(ghostEl);
    ghostEl = null;
    draggedEl.classList.remove('hidden');
    CardSys.dragElemStyleOff(container, addBtns);
    CardSys.freeInputFieldOff(container);
    saveData(container);
  });
}
