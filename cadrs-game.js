(() => {
  const body = document.body;
  const container = document.createElement('div');
  const h1 = document.createElement('h1');
  const p = document.createElement('p');
  const input = document.createElement('input');
  const doneButton = document.createElement('button');
  const timerWrapper = document.createElement('div');
  const timerText = document.createElement('div');
  const scoreBoard = document.createElement('div');
  const gameField = document.createElement('div');
  const list = document.createElement('ul');
  const form = document.createElement('form');
  const endWrapper = document.createElement('div');
  const endTitle = document.createElement('p');
  const endButton = document.createElement('button');
  const initialArray = [];
  let nIntervId;
  
  
  document.addEventListener('DOMContentLoaded', () => {
    container.classList.add('container');
    h1.classList.add('h1');
    h1.textContent = 'Игра "Выбери пару"';
    timerWrapper.classList.add('timer-wrapper');
    timerText.classList.add('timer-text');
    timerText.textContent = 'Время:';
    scoreBoard.classList.add('timer');
    scoreBoard.textContent = '60';
    p.classList.add('paragraph');
    p.textContent = 'Укажите размер поля по горизонтали / вертикали (четное, от 2 до 10):';
    form.classList.add('form');
    input.classList.add('input');
    input.setAttribute('type', 'number');
    input.setAttribute('placeholder', '?');
    doneButton.classList.add('donebutton');
    doneButton.textContent = 'Начать игру';
    gameField.classList.add('game-field');
    list.classList.add('ul');
    endWrapper.classList.add('end-wrapper');
    endTitle.classList.add('end-title');
    endButton.classList.add('end-btn');
    endButton.textContent = 'Играть заново!';
    
    body.append(container); //добавляем контейнер на страницу
    container.append(h1);
    container.append(p);
    container.append(form);
    form.append(input);
    form.append(doneButton);
      
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let cardsInRow = parseInt(input.value);
      if ((cardsInRow === NaN) || (cardsInRow % 2 !== 0) || (cardsInRow < 2) || (cardsInRow > 10)) {
        cardsInRow = 4;
      }

      if (cardsInRow >= 6) scoreBoard.textContent = '120';    
      
      const numberOfCards = Math.pow(cardsInRow, 2); //всего карт на поле
      p.style.display = 'none'; //убираем параграф
      form.style.display = 'none'; //убираем форму
      container.append(timerWrapper); //добавляем таймер
      timerWrapper.append(timerText);
      timerWrapper.append(scoreBoard); 
      container.append(gameField);   
      gameField.append(list); //добавляем список на страницу
      createCards(numberOfCards, cardsInRow); //создаем карты
      const cards = document.querySelectorAll('.button'); //массив (node-list) созданных карт
      
      start(); //запуск таймера
      searchCards(cards); //производим поиск
    })
    
    
    //--------------------------------- функция создания элементов списка (карт) ------------------------------------
    function createCards(number, row) {
      const resultArray = createArray(number / 2);
      
      for (let i = 1; i <= number; i++) {
        let item = document.createElement('li');
        let btn = document.createElement('button');

        gameField.classList.add(`game-field-${row}`);
        item.classList.add(`li-${row}`);
        btn.classList.add('button');
        btn.textContent = resultArray[i - 1];
        btn.setAttribute('data-init', 'attr-' + resultArray[i - 1]);
        list.append(item);
        item.append(btn);
      };
      return;
    };//-------------------------------------------------------------------------------------------------------------


    //--------------------------------- функция создания массива пар чисел ------------------------------------------
    function createArray(lengthArr) {
      for (i = 1; i <= lengthArr; i++) {
        initialArray.push(i, i); //добавляем два одинаковых элемента в массив (пара одинаковых цифр) 
      };

      initialArray.sort(() => Math.random() - 0.5); //сортировка элементов массива
      return initialArray;
      
      // while (initialArray.length > 0) {
      //   let index = Math.trunc(Math.random() * initialArray.length); //TRUNC отбрасывает дробную часть
      //   let elem = initialArray.splice(index, 1); //SPLICE вырезает и возвращает нам массив из одного элемента
      //   elem = elem[0]; //а нам нужен не массив, а сам элемент (т.е. число)
      //   resultArray.push(elem);
      // };
    };//-------------------------------------------------------------------------------------------------------------
    
    
    //--------------------------функция таймера--------------------------------------------------------
    function start() {
      clearInterval(nIntervId);
      nIntervId = setInterval(timer, 1000);
      function timer() {
        let number = parseInt(scoreBoard.textContent);
        if (number > 0) {
          number = number - 1;
          scoreBoard.textContent = number;
        };

        if (number < 10) {
          scoreBoard.style.cssText = 'color: red;'
        }
        
        if (number === 0) {
          clearInterval(nIntervId);
          endTitle.textContent = 'Вы проиграли...';
          gameOver();
        }  
      };
    };//-----------------------------------------------------------------------------------------------
    
    
    //---------------------функция поиска одинаковых пар карт------------------------------------------
    function searchCards(cardArray) {
      let openCards = []; //массив открытых карт по дефолту
      let countOpenCard = 0; //счетчик открытых карт на поле по дефолту
      cardArray.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.currentTarget.classList.add('card-is-open');
          btn.setAttribute('disabled', 'disabled');
          openCards.push(btn);
          if (openCards.length === 2) {
            if (openCards[0].dataset.init !== openCards[1].dataset.init) {       
              function closeCard() {
                for (let i = 0; i < openCards.length; i++) {
                  openCards[i].classList.remove('card-is-open');
                  openCards[i].removeAttribute('disabled');
                }
                openCards = [];
              }
              setTimeout(closeCard, 500);
            }else {
              for (let i = 0; i < openCards.length; i++) {
                openCards[i].disabled = 'disabled';
              }
              countOpenCard += 2;
              openCards = [];
              if (countOpenCard === cardArray.length) {
                clearInterval(nIntervId);
                endTitle.textContent = 'Вы выиграли!';
                gameOver();
              }
            }
          }
        });
      });
    }//------------------------------------------------------------------------------------------------

    //-----------------------------------функция окончания игры----------------------------------------
    function gameOver() {
      const cards = document.querySelectorAll('.button');
      cards.forEach((btn) => {
        btn.setAttribute('disabled', 'disabled');
      });
      container.style.opacity = '0.1';
      body.append(endWrapper);
      endWrapper.append(endTitle);
      endWrapper.append(endButton);
      endButton.setAttribute('type', 'button');
      body.style.cssText = 'overflow-y: hidden;';
      endButton.addEventListener('click', () => {
        window.history.go(0); //метод для загрузки определенной страницы из истории сеанса (0 - текущая страница)
      });
    };//-----------------------------------------------------------------------------------------------
  });
})();