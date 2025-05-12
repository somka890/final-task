let historyBox = document.getElementById('history');
let screenBox = document.getElementById('screen');
let allButtons = document.getElementById('buttons');

let currentText = '';
let lastNumber = '';
let mathSymbol = '';

// viska istrina
function makeEverythingEmpty() {
    currentText = '';
    lastNumber = '';
    mathSymbol = '';
    historyBox.textContent = '';
    screenBox.textContent = '0';
}

//istrina paskutini skaiciu
function deleteLastNumber() {
    if (currentText.length > 0) {
        currentText = currentText.slice(0, currentText.length - 1);
        if (currentText === '') {
            screenBox.textContent = '0';
        } else {
            screenBox.textContent = currentText;
        }
    }
}


//skaiciuoja
function doMath(n1, n2, symbol) {
    if (symbol === '+') {
        return n1 + n2;
    }
    if (symbol === '-') {
        return n1 - n2;
    }
    if (symbol === '*' || symbol === 'x') {
        return n1 * n2;
    }
    if (symbol === '/' || symbol === '÷') {
        return n1 / n2;
    }
}

// reaguoja i mygtuku paspaudimus
allButtons.addEventListener('click', function (event) {
    let clicked = event.target;

    // Tikrina ar paspaustas mygtukas
    if (clicked.tagName !== 'BUTTON') {
        return;
    }

    let whatWasClicked = clicked.textContent;

    // jei paspaustas c - isvalo viska
    if (whatWasClicked === 'C') {
        makeEverythingEmpty();
        return;
    }

    // jei paspaustas DEL - istrina paskutini skaiciu
    if (whatWasClicked === 'DEL') {
        deleteLastNumber();
        return;
    }

    // Jei spaustas veiksmas (+ - * /)
    if (whatWasClicked === '+' || whatWasClicked === '-' || whatWasClicked === '*' || whatWasClicked === '/' || whatWasClicked === '÷') {
        // neleidzia ivesti veiksmo be skaiciaus
        if (currentText === '') {
            return;
        }

        // tarpinis rezultatas
        if (lastNumber !== '') {
            let num1 = parseFloat(lastNumber);
            let num2 = parseFloat(currentText);
            let result = doMath(num1, num2, mathSymbol);
            lastNumber = result;
        } else {
            // isaugom pirmo skaiciaus reiksme
            lastNumber = currentText;
        }

        // rodo veiksma
        mathSymbol = whatWasClicked;
        currentText = '';
        historyBox.textContent = lastNumber + ' ' + mathSymbol;
        screenBox.textContent = '0';
        return;
    }

    // skaiciuoja galutini rezultata
    if (whatWasClicked === '=') {

        // arba nieko nedarom
        if (lastNumber === '' || currentText === '') {
            return;
        }

        // daro galutini skaiciavima
        let num1 = parseFloat(lastNumber);
        let num2 = parseFloat(currentText);
        let finalAnswer = doMath(num1, num2, mathSymbol);

        // atsakymas
        screenBox.textContent = finalAnswer;

        // rodo visa veiksma
        historyBox.textContent = lastNumber + ' ' + mathSymbol + ' ' + currentText + ' =';

        // rezultata naudoja kaip nauja skaiciu
        currentText = finalAnswer;
        lastNumber = '';
        mathSymbol = '';
        return;
    }

    // neleidzia ivesti du kartus tasko
    if (whatWasClicked === '.' && currentText.includes('.')) {
        return;
    }

    // paspausta skaiciu prideda esamo
    currentText = currentText + whatWasClicked;
    screenBox.textContent = currentText;
});

makeEverythingEmpty();