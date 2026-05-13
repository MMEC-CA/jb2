class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.history = [];
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else if (this.shouldResetScreen) {
            this.currentOperand = number.toString();
            this.shouldResetScreen = false;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
        this.addToHistory(expression, computation);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    scientificCommand(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        let result;
        let expression = '';

        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180); // Assuming Degrees
                expression = `sin(${current}°)`;
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                expression = `cos(${current}°)`;
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                expression = `tan(${current}°)`;
                break;
            case 'log':
                result = Math.log10(current);
                expression = `log10(${current})`;
                break;
            case 'ln':
                result = Math.log(current);
                expression = `ln(${current})`;
                break;
            case 'sqrt':
                if (current < 0) {
                    alert("Invalid input for square root");
                    return;
                }
                result = Math.sqrt(current);
                expression = `√(${current})`;
                break;
            case 'pow':
                this.chooseOperation('^');
                return;
            case 'abs':
                result = Math.abs(current);
                expression = `|${current}|`;
                break;
            case 'exp':
                result = Math.exp(current);
                expression = `exp(${current})`;
                break;
            case 'fact':
                result = this.factorial(current);
                expression = `${current}!`;
                break;
            default:
                return;
        }

        this.addToHistory(expression, result);
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    setConstant(constant) {
        switch (constant) {
            case 'PI':
                this.currentOperand = Math.PI.toString();
                break;
            case 'E':
                this.currentOperand = Math.E.toString();
                break;
        }
        this.shouldResetScreen = true;
    }

    addToHistory(expression, result) {
        this.history.push({ expression, result });
        this.updateHistoryUI();
    }

    updateHistoryUI() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        this.history.slice().reverse().forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="expr">${item.expression} =</span> ${item.result}`;
            historyList.appendChild(li);
        });
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// UI Initialization
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const scientificButtons = document.querySelectorAll('[data-function]');
const constantButtons = document.querySelectorAll('[data-constant]');
const utilityButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-operator="="]');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const toggleHistoryBtn = document.getElementById('toggle-history');
const historyPanel = document.getElementById('history-panel');
const clearHistoryBtn = document.getElementById('clear-history');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    if (button.dataset.operator === '=') return;
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

scientificButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.scientificCommand(button.dataset.function);
        calculator.updateDisplay();
    });
});

constantButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.setConstant(button.dataset.constant);
        calculator.updateDisplay();
    });
});

utilityButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'all-clear') {
            calculator.clear();
        } else if (action === 'delete') {
            calculator.delete();
        }
        calculator.updateDisplay();
    });
});

toggleHistoryBtn.addEventListener('click', () => {
    historyPanel.classList.toggle('hidden');
    historyPanel.classList.toggle('visible');
});

clearHistoryBtn.addEventListener('click', () => {
    calculator.history = [];
    calculator.updateHistoryUI();
});

// Handle special case for Power (x^y)
Calculator.prototype.compute = function() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': 
            if (current === 0) { alert("Cannot divide by zero"); this.clear(); return; }
            computation = prev / current; 
            break;
        case '^': computation = Math.pow(prev, current); break;
        default: return;
    }

    const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
    this.addToHistory(expression, computation);

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
};
