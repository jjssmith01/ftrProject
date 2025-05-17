import { useEffect, useState, useRef } from 'react'
import './App.css'
import { Timer } from './Timer'
function App() {
  const [outputFrequency, setOutputFrequency] = useState(0);
  const [frequencyInput, setFrequencyInput] = useState(0);

  const [numberInput, setNumberInput] = useState(0);
  const numberFrequency = useRef(new Map<number, number>());
  const [frequencyText, setFrequencyText] = useState('');

  //Generate first 1000 fibonacci numbers into set.
  const fibbonaciList = useRef(new Set());

  const calculateFibonacci = () => {
    let a = 0;
    let b = 1;

    fibbonaciList.current.add(a);
    fibbonaciList.current.add(b);

    for (let i = 2; i <= 1000; i++) {
      const c = a + b;
      a = b;
      b = c;
      fibbonaciList.current.add(c);
    }

    return b;
  }
  
  calculateFibonacci();

  //useRef to stop timer restarting on new render.
  const timerRef = useRef<Timer | null>(null);
  if (!timerRef.current) {
    timerRef.current = new Timer();
  }
  const timer = timerRef.current;

  const displayNumbers = () => {
    const sortedMap = new Map([...numberFrequency.current.entries()].sort((a,b) => b[1] - a[1]));
    let formattedNumbers = '';

    if (sortedMap.size !== 0){
      for (const [key, value] of sortedMap){
        formattedNumbers += `${key}:${value}, `
      }
    }
    setFrequencyText(formattedNumbers.trimEnd().slice(0,-1));
  }

  const handleSubmit = () => {
    if (!isNaN(numberInput)){
      if (fibbonaciList.current.has(numberInput)){
        window.alert('FIB!');
      }
      const currentFrequency = numberFrequency.current.get(numberInput);
      if (currentFrequency){
        numberFrequency.current.set(numberInput, currentFrequency + 1);
      } else {
        numberFrequency.current.set(numberInput, 1);
      }
    }
  }

  const handleQuit = () => {
    timer.stopTimer();
    setOutputFrequency(0);
    setNumberInput(0);
    setFrequencyText('');
    numberFrequency.current.clear();
    alert('Thanks for playing, press ok to exit.');
  }

  useEffect(() => {
    if (outputFrequency !== 0) {
      timer.startTimer(displayNumbers, outputFrequency);
    }
  }, [outputFrequency, timer])

  return (
    <>
      <h2>Number Frequency Calculator</h2>
      {outputFrequency === 0 &&
        <>
          <p>Please input the amount of time in seconds between emitting numbers and their frequency</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
            <input
              type="number"
              min="0"
              defaultValue={0}
              onChange={e => setFrequencyInput(parseInt(e.target.value))}
            />
            <button onClick={() => setOutputFrequency(frequencyInput)}>Set frequency</button>
          </div>
        </>
      }
      {outputFrequency !== 0 &&
        <div>
          {numberFrequency.current.size === 0 ? <p>Please enter the first number</p> : <p>Please enter the next number</p>}
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
            <input
              style={{display: 'flex', justifySelf: 'center'}}
              type="number"
              min="0"
              value={numberInput}
              onChange={e => setNumberInput(parseInt(e.target.value))}
            />
            <button onClick={() => handleSubmit()}>Submit</button>
          </div>
          <p>{frequencyText}</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px', paddingTop: "2em"}}>
            <button onClick={() => timer.resumeTimer(displayNumbers)}>Resume</button>
            <button onClick={() => timer.pauseTimer()}>Halt</button>
            <button onClick={() => handleQuit()}>Quit</button>
          </div>
        </div>
      }
    </>
  )
}

export default App
