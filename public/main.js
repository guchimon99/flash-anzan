var correct = null;
var input = "";

function showScene (name) {
  document.querySelectorAll('.scene').forEach(function(element){
    if (element.getAttribute('data-scene-name') === name) {
      element.classList.remove('scene--hidden');
    } else {
      element.classList.add('scene--hidden');
    }
  })
}

var readOptions = {
  easy: {
    min: 1,
    max: 9,
    count: 5,
    interval: 1000,
  },
  normal: {
    min: 11,
    max: 99,
    count: 5,
    interval: 1000,
  },
  hard: {
    min: 11,
    max: 999,
    count: 10,
    interval: 500,
  },
}

function startRead(mode) {
  var options = readOptions[mode];

  showReadText('スタート');

  var numbers = new Array(options.count).fill(null).map(function(){
    return Math.floor(Math.random() * (options.max - options.min)) + options.min;
  });

  correct = numbers.reduce(function(a,b){ return a + b; }, 0);

  numbers.forEach(function(number, i){
    setTimeout(function(){
      showReadText(number);
    }, i * options.interval + 500);
    setTimeout(function(){
      showReadText("");
    }, i * options.interval - 100 + 500);
  });

  setTimeout(function(){
    startInput();
    showScene('input');
  }, numbers.length * options.interval + 500);
}

function showReadText(text) {
  document.querySelector('#read-text').innerText = text;
}

function startInput() {
  input = "";
  showInputValue(input);
}

function showInputValue(text) {
  document.querySelector('#input-value').innerText = text;
}

function startResult(input, correct) {
  if (input == correct) {
    showResultDisplay('正解');
  } else {
    showResultDisplay('不正解');
  }
}

function showResultDisplay(text) {
  document.querySelector('#result-display').innerText = text;
}

function init () {
  showScene('start');

  document.querySelectorAll('.start__controls button').forEach(function(element){
    element.addEventListener('click', function(event){
      var mode = event.target.value;
      showScene('read');
      startRead(mode);
    });
  });

  document.querySelector('.read').addEventListener('click', function(event){
    showScene('input');
  });

  document.querySelector('#input-submit-button').addEventListener('click', function(event){
    startResult(correct, input);
    showScene('result');
  });

  document.querySelector('#result-replay-button').addEventListener('click', function(event){
    showScene('start');
  });

  document.querySelectorAll('.input__controls button:nth-child(-n+10)').forEach(function(element){
    element.addEventListener('click', function(event){
      var text = event.target.innerText;
      if (input == "0") {
        input = text;
      } else {
        input += text;
      }
      showInputValue(input);
    });
  });

  document.querySelector('#input-remove-button').addEventListener('click', function(){
    input = input.slice(0, -1);
    showInputValue(input);
  });

}

window.addEventListener('load', init);
