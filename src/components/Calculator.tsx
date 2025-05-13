import React, { useState, useEffect } from 'react';
import { formatNumber, getOperatorSymbol } from '../utils/calculatorUtils.ts';
import '../styles/index.css';

type Operation = '+' | '-' | '*' | '/' | null;

const Calculator: React.FC = () => {
  const [currentOperand, setCurrentOperand] = useState<string>('0');
  const [previousOperand, setPreviousOperand] = useState<string>('');
  const [operation, setOperation] = useState<Operation>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState<boolean>(false);
  const [history, setHistory] = useState<string>('');
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    return savedTheme === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches) 
      ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (/[0-9.]/.test(event.key)) {
        event.preventDefault();
        appendNumber(event.key);
      }

      if (['+', '-', '*', '/'].includes(event.key)) {
        event.preventDefault();
        chooseOperation(event.key as Operation);
      }

      if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        backspace();
      }

      if (event.key === 'Escape' || event.key === 'Delete') {
        event.preventDefault();
        clear();
      }

      if (event.key === '%') {
        event.preventDefault();
        percent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentOperand, previousOperand, operation, shouldResetDisplay]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const appendNumber = (number: string) => {
    if (shouldResetDisplay) {
      setCurrentOperand(number === '.' ? '0.' : number);
      setShouldResetDisplay(false);
      return;
    }
    
    if (number === '.' && currentOperand.includes('.')) return;
    
    setCurrentOperand(prev => {
      if (prev === '0' && number !== '.') return number;
      return prev + number;
    });
  };

  const chooseOperation = (op: Operation) => {
    if (currentOperand === 'Erro' || op === null) return;

    if (operation !== null && !shouldResetDisplay) {
      calculate();
    }

    setPreviousOperand(currentOperand);
    setOperation(op);
    setShouldResetDisplay(true);
    setHistory(`${currentOperand} ${getOperatorSymbol(op)}`);
  };

  const calculate = () => {
    if (operation === null || shouldResetDisplay || currentOperand === 'Erro') return;

    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    let result: number | string;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          result = 'Erro';
        } else {
          result = prev / current;
        }
        break;
      default:
        return;
    }

    setHistory(`${previousOperand} ${getOperatorSymbol(operation)} ${currentOperand} =`);

    if (result === 'Erro') {
      setCurrentOperand('Erro');
    } else {
      setCurrentOperand(formatNumber(result as number));
    }
    
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const clear = () => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(null);
    setShouldResetDisplay(false);
    setHistory('');
  };

  const backspace = () => {
    if (shouldResetDisplay || currentOperand === 'Erro') {
      clear();
      return;
    }

    setCurrentOperand(prev => {
      if (prev.length === 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const percent = () => {
    if (currentOperand === 'Erro') return;

    const current = parseFloat(currentOperand);
    let result: number;

    if (operation === '+' || operation === '-') {
      result = parseFloat(previousOperand) * (current / 100);
    } else {
      result = current / 100;
    }

    setCurrentOperand(formatNumber(result));
  };

  const squareRoot = () => {
    if (currentOperand === 'Erro') return;

    const current = parseFloat(currentOperand);

    if (current < 0) {
      setCurrentOperand('Erro');
    } else {
      const result = Math.sqrt(current);
      setCurrentOperand(formatNumber(result));
    }

    setShouldResetDisplay(true);
  };

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h1>Calculadora</h1>
        <button 
          id="theme-toggle" 
          className="theme-toggle" 
          aria-label="Alternar tema"
          onClick={toggleTheme}
        >
          <span className="material-icons light-icon">light_mode</span>
          <span className="material-icons dark-icon">dark_mode</span>
        </button>
      </div>
      
      <div className="calculator-history">
        <div className="history-display">{history}</div>
      </div>
      
      <div className="calculator-display">
        <div className="display">{currentOperand}</div>
      </div>
      
      <div className="calculator-buttons">
        <button className="btn btn-clear" onClick={clear}>C</button>
        <button className="btn btn-operation" onClick={backspace}>
          <span className="material-icons">backspace</span>
        </button>
        <button className="btn btn-operation" onClick={percent}>%</button>
        <button className="btn btn-operation" onClick={() => chooseOperation('/')}>÷</button>
        
        <button className="btn" onClick={() => appendNumber('7')}>7</button>
        <button className="btn" onClick={() => appendNumber('8')}>8</button>
        <button className="btn" onClick={() => appendNumber('9')}>9</button>
        <button className="btn btn-operation" onClick={() => chooseOperation('*')}>×</button>
        
        <button className="btn" onClick={() => appendNumber('4')}>4</button>
        <button className="btn" onClick={() => appendNumber('5')}>5</button>
        <button className="btn" onClick={() => appendNumber('6')}>6</button>
        <button className="btn btn-operation" onClick={() => chooseOperation('-')}>−</button>
        
        <button className="btn" onClick={() => appendNumber('1')}>1</button>
        <button className="btn" onClick={() => appendNumber('2')}>2</button>
        <button className="btn" onClick={() => appendNumber('3')}>3</button>
        <button className="btn btn-operation" onClick={() => chooseOperation('+')}>+</button>
        
        <button className="btn btn-operation" onClick={squareRoot}>√</button>
        <button className="btn" onClick={() => appendNumber('0')}>0</button>
        <button className="btn" onClick={() => appendNumber('.')}>.</button>
        <button className="btn btn-equals" onClick={calculate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;