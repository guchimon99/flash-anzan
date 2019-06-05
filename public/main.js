var correct = null;
var input = "";
var numbers = [];
var status = null;
var stage = null;

var STORAGE_KEY = 'v1/status'

function loadStatus () {
  var json = localStorage.getItem(STORAGE_KEY);
  if (!json) return { stages: {} };
  var status = JSON.parse(json);
  if (typeof status != "object") return { stages: {} };
  return status;
}

function writeStatus (status) {
  var json = JSON.stringify(status);
  localStorage.setItem(STORAGE_KEY, json);
}

function showScene (name) {
  document.querySelectorAll('.scene').forEach(function(element){
    if (element.getAttribute('data-scene-name') === name) {
      element.classList.remove('scene--hidden');
    } else {
      element.classList.add('scene--hidden');
    }
  })
}

function initStart (status) {
  var stages = status.stages||{};
  Object.keys(stages).forEach(function(key){
    if (!stages[key]) return;
    document.querySelector('.start__stages button[value="' + key + '"]').classList.add('button--primary')
  });
}

var stageOptions = {
  1: { min: 1, max: 9, count: 5, interval: 1500 },
  2: { min: 1, max: 9, count: 5, interval: 1300 },
  3: { min: 1, max: 9, count: 5, interval: 1100 },
  4: { min: 1, max: 9, count: 5, interval: 900 },
  5: { min: 1, max: 9, count: 10, interval: 1500 },
  6: { min: 1, max: 9, count: 10, interval: 1300 },
  7: { min: 1, max: 9, count: 10, interval: 1100 },
  8: { min: 1, max: 9, count: 10, interval: 900 },
  9: { min: 10, max: 20, count: 5, interval: 1500 },
  10: { min: 10, max: 20, count: 5, interval: 1300 },
  11: { min: 10, max: 20, count: 5, interval: 1100 },
  12: { min: 10, max: 20, count: 5, interval: 900 },
  13: { min: 10, max: 20, count: 10, interval: 1500 },
  14: { min: 10, max: 20, count: 10, interval: 1300 },
  15: { min: 10, max: 20, count: 10, interval: 1100 },
  16: { min: 10, max: 20, count: 10, interval: 900 },
};

function initRead(stage) {

  var options = stageOptions[stage];
  numbers = new Array(options.count).fill(null).map(function(){
    return Math.floor(Math.random() * (options.max - options.min)) + options.min;
  });

  correct = numbers.reduce(function(a,b){ return a + b; }, 0);

  showReadText('スタート');

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

function initResult(input, correct, numbers) {
  if (input == correct) {
    showResultDisplay('正解', correct, numbers);
  } else {
    showResultDisplay('不正解', correct, numbers);
  }
}

function showResultDisplay(message, correct, numbers) {
  document.querySelector('#result-message').innerText = message;
  document.querySelector('#result-correct').innerText = numbers.join(" + ") + " = " + correct;
}

function init () {

  initStart(loadStatus());
  showScene('start');

  document.querySelectorAll('.start__stages button').forEach(function(element){
    element.addEventListener('click', function(event){
      stage = event.target.value;
      showScene('read');
      initRead(stage);
    });
  });

  document.querySelector('.read').addEventListener('click', function(event){
    showScene('input');
  });

  document.querySelector('#input-submit-button').addEventListener('click', function(event){

    var status = loadStatus();
    status.stages = Object.assign((status.stages||{}), {
      [stage]: input == correct
    });
    writeStatus(status);

    initResult(correct, input, numbers);
    showScene('result');
  });

  document.querySelector('#result-replay-button').addEventListener('click', function(event){
    initStart(loadStatus());
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
