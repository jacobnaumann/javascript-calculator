import './index.css';
import React, { useState } from 'react';
import Display from './Display';
import Button from './Button';

const App = () => {
  const [input, setInput] = useState("0");  // This will store user's input
  const [formula, setFormula] = useState("");

  const handleNumberClick = (num) => {
    // If the current input is "0", we want to replace it with the new number unless it's a decimal point
    if (input === "0" && num !== '.') {
      setInput(num);
      setFormula(prev => prev + num);
    } else {
      // If the input is not "0", or it's a decimal point, we concatenate the number to the input and formula
      setInput(prev => prev + num);
      setFormula(prev => prev + num);
    }
  };
  
  const handleDecimalClick = () => {
    // If input is "0", we should also start the formula with "0."
    if (input === '0') {
      setInput('0.');
      setFormula(prev => prev === "" ? '0.' : prev + '.');
    } else if (!input.includes('.')) {
      setInput(prev => prev + ".");
      setFormula(prev => prev + ".");
    }
    // If input already has a decimal, we do nothing
  };  

  const handleOperatorClick = (op) => {
    // If the last character is an operator, we may replace it
    // Or if it's a minus sign after another operator, we may append it
    if (['+', '-', '*', '/'].includes(formula.slice(-1))) {
      if (op === '-' && formula.slice(-1) !== '-') {
        // Append if the last character is an operator (not a minus) and new operator is minus
        setInput(op);
        setFormula(prev => prev + op);
      } else if (formula.slice(-2, -1) !== '-' && formula.slice(-1) === '-') {
        // Replace the last character if it's a minus and the previous is not an operator
        setInput(op);
        setFormula(prev => prev.slice(0, -1) + op);
      } else if (formula.slice(-2, -1) === '-' && op !== '-') {
        // If there's a minus already and the previous character is an operator, replace both
        setInput(op);
        setFormula(prev => prev.slice(0, -2) + op);
      } else {
        // For all other cases, replace the last operator with the new one
        setInput(op);
        setFormula(prev => prev.slice(0, -1) + op);
      }
    } else {
      // If the last character is not an operator, simply append the new operator
      setInput(op);
      setFormula(prev => prev + op);
    }
  };
  
  
  const evaluateFormula = (formula) => {
    // Here we use new Function to evaluate the formula. This is a safer
    // alternative to eval, but it's still powerful and should be used with caution.
    try {
      const result = new Function('return ' + formula)();
      return formatNumber(result);
    } catch (error) {
      console.error('Error evaluating formula:', error);
      return 'Error'; // or any other error handling
    }
  };
  
  const performCalculation = () => {
    // If the last character in the formula is an operator, remove it before evaluation
    const cleanedFormula = formula.endsWith('+') || formula.endsWith('-') || formula.endsWith('*') || formula.endsWith('/')
      ? formula.slice(0, -1)
      : formula;
    
    const result = formatNumber(evaluateFormula(cleanedFormula));
    setInput(String(result));
    setFormula(cleanedFormula + "=" + result);
  };

  const formatNumber = (num) => {
    // Ensure the number is a float, format it to 6 decimal places, and remove trailing zeroes
    return parseFloat(parseFloat(num).toFixed(6)).toString();
  };

  const clearDisplay = () => {
    setInput("0");
    setFormula("");
  };

  const numberToWord = (num) => {
    const numberWords = {
      '0': 'zero',
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five',
      '6': 'six',
      '7': 'seven',
      '8': 'eight',
      '9': 'nine',
      '.': 'decimal'
    };
  
    return numberWords[num];
  };  

  return (
    <div className="calculator">
      <div className="formulaScreen">{formula}</div>
      <Display value={input} />
      <div className="buttons">
        {/* Numbers */}
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0'].map((num) => (
          <Button 
            key={num}
            id={numberToWord(num)}
            label={num}
            onClick={num === '.' ? handleDecimalClick : () => handleNumberClick(num)}
          />
        ))}
        
        {/* Operators */}
        {['+', '-', '*', '/'].map((op) => (
          <Button 
            key={op}
            id={op === '+' ? 'add' : op === '-' ? 'subtract' : op === '*' ? 'multiply' : 'divide'}
            label={op}
            onClick={() => handleOperatorClick(op)}
          />
        ))}

        <Button id="equals" label="=" onClick={performCalculation} />
        <Button id="clear" label="AC" onClick={clearDisplay} />
      </div>
    </div>
  );
}

export default App;

