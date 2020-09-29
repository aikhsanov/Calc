"use strict";
let td = document.getElementsByTagName("td"),
    expressionNode = document.getElementById("ans"),
    equalButton = document.getElementById("equal"),
    bckspaceButton = document.getElementById("bckspace"),
    sqrootButton = document.getElementById("sqroot"),
    cleanButton = document.getElementById("clean"),
    percentButton = document.getElementById("percent"),
    historyRecord = document.getElementById("record"),
    historyNode = document.getElementById("history"),
    historyVisButton = document.getElementById("shhistory"),
    clearHistoryButton = document.getElementById("cehistory"),
    designButton = document.getElementById("design"),
    designStylesheet = document.getElementById("stylesheet"),
    counter = 0;

for(let i = 0; i < td.length; i++) {
  if(td[i].id === "") {
    td[i].addEventListener('click', () => {ButToAns(event)} );
  }
}
expressionNode.innerHTML = 0;
expressionNode.addEventListener('change', () => {CheckNaN()} );
equalButton.addEventListener('click', () => {ExpEqualParser()} );
bckspaceButton.addEventListener('click', () => {CharDel()} );
cleanButton.addEventListener('click', () => {ScrClean()});
sqrootButton.addEventListener('click', () => {GetSqRoot()});
percentButton.addEventListener('click', () => {GetPercent()});
historyVisButton.addEventListener('click', () => {ShowHistory()});
historyVisButton.onmousedown = (e) => {e.preventDefault()};
designButton.onmousedown = (e) => {e.preventDefault()};
clearHistoryButton.onmousedown = (e) => {e.preventDefault()};
clearHistoryButton.addEventListener('click', () => {historyRecord.innerHTML = ""});
designButton.addEventListener('click', () => {designStylesheet.href = designStylesheet.href.indexOf("styleClassicLook") === -1 ? 'styleClassicLook.css' : 'style.css'} );
designButton.addEventListener('click', () => {ResetFontSize()} );

/* designButton.addEventListener('click', () => {console.log(designStylesheet.href); designStylesheet.href = designStylesheet.href === 'style.css' ? 'styleClassicLook.css' : 'style.css'} ); */

let ButToAns = (event) => {
  let etarget = event.target,
      exp = expressionNode.innerHTML;
  if( (counter === 1) && (etarget.innerHTML === "+" || etarget.innerHTML === "-" ||
       etarget.innerHTML === "*" || etarget.innerHTML === "/") ) {
    expressionNode.innerHTML += " " + etarget.innerHTML + " ";
    counter = 0;
  } else if(parseInt(expressionNode.innerHTML) === 0 || counter === 1) {
    expressionNode.innerHTML = etarget.innerHTML;
    counter = 0;
  } else if( (etarget.innerHTML === "+" || etarget.innerHTML === "-" ||
              etarget.innerHTML === "*" || etarget.innerHTML === "/") && (isNaN ( parseInt(exp.charAt(exp.length - 1)) ) ) ){
    expressionNode.innerHTML = expressionNode.innerHTML.slice(0, exp.length - 3) + " " + etarget.innerHTML + " ";

  } else if(etarget.innerHTML === "+" || etarget.innerHTML === "-" ||
    etarget.innerHTML === "/" || etarget.innerHTML === "*") {
    expressionNode.innerHTML += " " + etarget.innerHTML + " ";
  } else if(etarget.innerHTML === "."  && exp.charAt(exp.length - 1) === ".") {
    expressionNode.innerHTML = expressionNode.innerHTML.slice(0, exp.length - 1) + etarget.innerHTML;
  } else if(etarget.innerHTML === "=") {
    return;
  } else {
    expressionNode.innerHTML += etarget.innerHTML;
  }
  CheckNaN();
  CheckLength();
};

let SplitByDiv = (expression) => {
  let parsedArDiv = expression.split("/");
  let numberArDiv = parsedArDiv.map(noStr => +noStr);
  const result = numberArDiv.reduce((acc, no) => acc / no);
  return result;
};
let SplitByMulti = (expression) => {
  let parsedArMulti = expression.split("*");
  let numberArMulti = parsedArMulti.map(noStr => SplitByDiv(noStr));
  const initialValue = 1.0;
  const result = numberArMulti.reduce((acc, no) => acc * no, initialValue);
  return result;
};
let SplitByMinus = (expression) => {
  let parsedArMinus = expression.split("-");
  let numberArMinus = parsedArMinus.map(noStr => SplitByMulti(noStr));
  const initialValue = numberArMinus[0];
  const result = numberArMinus.slice(1).reduce((acc, no) => acc - no, initialValue);
  return result;
};
let SplitByPlus = (expression) => {
  let parsedArPlus = expression.split("+");
  let numberArPlus = parsedArPlus.map(noStr => SplitByMinus(noStr));
  const initialValue = 0.0;
  const result = numberArPlus.reduce((acc, no) => acc + no, initialValue);
  return result;
};

let GetPercent = () => {
  let expression = expressionNode.innerHTML;
  console.log(expression);
  if(expression.indexOf("/") != -1) {
    let parsedAr = expression.split("/");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc / (acc / 100 * no));
  } else if(expression.indexOf("*") != -1) {
    let parsedAr = expression.split("*");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc * (acc / 100 * no));
  } else if(expression.indexOf("-") != -1) {
    let parsedAr = expression.split("-");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc - (acc / 100 * no));
  } else if(expression.indexOf("+") != -1) {
    let parsedAr = expression.split("+");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc + (acc / 100 * no));
  }
  historyRecord.innerHTML += expression + "%" + "<br>";
  CheckNaN();
};

let GetSqRoot = () => {
  let expression = expressionNode.innerHTML;
  if(expression.indexOf("/") != -1) {
    let parsedAr = expression.split("/");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc / Math.sqrt(no));
  } else if(expression.indexOf("*") != -1) {
    let parsedAr = expression.split("*");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc * Math.sqrt(no));
  } else if(expression.indexOf("-") != -1) {
    let parsedAr = expression.split("-");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc - Math.sqrt(no));
  } else if(expression.indexOf("+") != -1) {
    let parsedAr = expression.split("+");
    let numberAr = parsedAr.map(noStr => +noStr);
    expressionNode.innerHTML = numberAr.reduce((acc, no) => acc + Math.sqrt(no));
  } else {
    expressionNode.innerHTML = Math.sqrt(expression);
  }
  historyRecord.innerHTML += "sqrt(" + expression + ")" + "<br>";
  CheckNaN();
};


let ExpEqualParser = () => {
  let expression = expressionNode.innerHTML;
  expressionNode.innerHTML = SplitByPlus(expression);
  historyRecord.innerHTML += expression + "<br>";
  counter = 1;
  CheckNaN();
};

let CharDel = () => {
  let exp = expressionNode.innerHTML;
  console.log(exp.indexOf("+"));
  if(exp.charAt(exp.length - 1) === " ") {
    expressionNode.innerHTML = exp.slice(0, exp.length - 3);
  } else if(exp.length === 1) {
    expressionNode.innerHTML = "0";
  } else {
    expressionNode.innerHTML = exp.slice(0, exp.length - 1);
  }
};

let ScrClean = () => {
  expressionNode.innerHTML = 0;
  ResetFontSize();
};

document.addEventListener('keydown', function(event) {
	let key = event.key,
      keyCode = event.code,
      exp = expressionNode.innerHTML;
  if(key === "0" && (keyCode === "Digit0" || keyCode === "Numpad0") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "1" && (keyCode === "Digit1" || keyCode === "Numpad1") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "2" && (keyCode === "Digit2" || keyCode === "Numpad2") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "3" && (keyCode === "Digit3" || keyCode === "Numpad3") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "4" && (keyCode === "Digit4" || keyCode === "Numpad4") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "5" && (keyCode === "Digit5" || keyCode === "Numpad5") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "6" && (keyCode === "Digit6" || keyCode === "Numpad6") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "7" && (keyCode === "Digit7" || keyCode === "Numpad7") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "8" && (keyCode === "Digit8" || keyCode === "Numpad8") ) {
    if(parseInt(expressionNode.innerHTML) != 0 && counter != 1) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
      counter = 0;
    }
  }
  if(key === "9" && (keyCode === "Digit9" || keyCode === "Numpad9") ) {
    if(parseInt(expressionNode.innerHTML) === 0 || counter === 1) {
      console.log("count= " + counter);
      expressionNode.innerHTML = key;
      counter = 0;
    } else {
      expressionNode.innerHTML += key;

    }
  }
  if(key === "*" && (keyCode === "Digit8" || keyCode === "NumpadMultiply") ) {
    if((isNaN ( parseInt(exp.charAt(exp.length - 1)) ) ) ){
      expressionNode.innerHTML = exp.slice(0, exp.length - 3) + " " + key + " ";
    } else if (parseInt(expressionNode.innerHTML) != 0) {
      expressionNode.innerHTML += " " + key + " ";
      counter = 0;
    } else {
      expressionNode.innerHTML = key;
    }
  }
  if(key === "+" && (keyCode === "Equal" || keyCode === "NumpadAdd") ) {
    if((isNaN ( parseInt(exp.charAt(exp.length - 1)) ) ) ){
      expressionNode.innerHTML = exp.slice(0, exp.length - 3) + " " + key + " ";
    } else if(parseInt(expressionNode.innerHTML) != 0) {
      expressionNode.innerHTML += " " + key + " ";
      counter = 0;
    } else {
      expressionNode.innerHTML = key;
    }
  }
  if(key === "/" && (keyCode === "Slash" || keyCode === "NumpadDivide") ) {
    if((isNaN ( parseInt(exp.charAt(exp.length - 1)) ) ) ){
      expressionNode.innerHTML = exp.slice(0, exp.length - 3) + " " + key + " ";
    } else if(parseInt(expressionNode.innerHTML) != 0) {
      expressionNode.innerHTML += " " + key + " ";
      counter = 0;
    } else {
      expressionNode.innerHTML = key;
    }
  }
  if(key === "-" && (keyCode === "Minus" || keyCode === "NumpadSubtract") ) {
    if((isNaN ( parseInt(exp.charAt(exp.length - 1)) ) ) ){
      expressionNode.innerHTML = exp.slice(0, exp.length - 3) + " " + key + " ";
    } else if(parseInt(expressionNode.innerHTML) != 0) {
      expressionNode.innerHTML += " " + key + " ";
      counter = 0;
    } else {
      expressionNode.innerHTML = key;
    }
  }
  if( (key === "." && keyCode === "Slash") || (key === "," && keyCode === "NumpadDecimal") ||
      (key === "." && keyCode === "Period") || (key === "." && keyCode === "NumpadDecimal") ) {
    if((isNaN ( parseInt(exp.charAt(exp.length - 1)) ) ) ){
      expressionNode.innerHTML = exp.slice(0, exp.length - 3) + key;
    } else if(parseInt(expressionNode.innerHTML) != 0) {
      expressionNode.innerHTML += key;
    } else {
      expressionNode.innerHTML = key;
    }
  }
  if( (key === "=" && keyCode === "Equal") || (key === "Enter" && keyCode === "NumpadEnter") ) {
      ExpEqualParser();
    }
  if(key === "Escape") {
      ScrClean();
    }
  if(key === "Backspace") {
      CharDel();
    }
  CheckLength();
  CheckNaN();
}) ;

let CheckNaN = () => {
  if(expressionNode.innerHTML === "NaN") {
    alert("OH SHIT, I'M SORRY!");
  }
};
let CheckLength = () => {
  let exp = expressionNode.innerHTML;
  if(exp.length > 12) {
    expressionNode.style.fontSize = "105%";
  }
};

let ResetFontSize = () => {
  expressionNode.style.fontSize = designStylesheet.href.indexOf("styleClassicLook") === -1 ? '2rem' : '3rem';
};

let ShowHistory = () => {
  if(historyNode.style.visibility === "visible") {
    historyNode.style.visibility = "hidden";
  } else {
    historyNode.style.visibility = "visible";
  }
};
