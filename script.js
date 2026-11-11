
const calculator = document.getElementById('calculator');
const calc = document.getElementById('calc');
const output = document.getElementById('output');
const dragHandle = document.getElementById('dragHandle');


let currentString = '0';
let shouldResetDisplay = false;




calc.addEventListener('click', function(event) {
    if (event.target.tagName !== 'BUTTON') return; 
    
    const value = event.target.value;

   
    if (value === 'AC') {
        currentString = '0';
        output.innerText = currentString;
        return;
    }
    if (value === 'C') {
        currentString = currentString.slice(0, -1);
        if (currentString === '') currentString = '0';
        output.innerText = currentString;
        return;
    }

    
    if (value === '=') {
        try {

            let expression = currentString.replace(/×/g, '*').replace(/÷/g, '/');
            let result = new Function('return ' + expression)();
            
            if (result % 1 !== 0) {
                result = result.toFixed(4).replace(/\.?0+$/, '');
            }
            
            currentString = String(result);
            output.innerText = currentString;
            shouldResetDisplay = true;
        } catch (error) {
            output.innerText = 'Ошибка';
            currentString = '0';
            shouldResetDisplay = true;
        }
        return;
    }

    
    if (value === '+/-') {
        if (currentString.startsWith('-')) {
            currentString = currentString.substring(1);
        } else if (currentString !== '0') {
            currentString = '-' + currentString;
        }
        output.innerText = currentString;
        return;
    }

    
    if (shouldResetDisplay && !isNaN(value)) {
        currentString = value;
        shouldResetDisplay = false;
    } else {
        if (currentString === '0' && !isNaN(value)) {
            currentString = value;
        } else {
            const lastChar = currentString.slice(-1);
            const operators = ['+', '-', '*', '/', '%'];
            if (operators.includes(lastChar) && operators.includes(value)) {
                currentString = currentString.slice(0, -1) + value;
            } else {
                currentString += value;
            }
        }
    }

    output.innerText = currentString;
});

let isDragging = false;
let offsetX, offsetY;


const startDrag = (e) => {
    isDragging = true;
    calculator.style.transform = 'none'; 

    const rect = calculator.getBoundingClientRect();
    calculator.style.left = rect.left + 'px';
    calculator.style.top = rect.top + 'px';
    calculator.style.margin = '0';

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
};


const onDrag = (e) => {
    if (!isDragging) return;
    if (e.type.includes('touch')) e.preventDefault(); 

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    calculator.style.left = (clientX - offsetX) + 'px';
    calculator.style.top = (clientY - offsetY) + 'px';
};
const stopDrag = () => {
    isDragging = false;
};

dragHandle.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);