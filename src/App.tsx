import PatternEditor, { ArrowProps } from "./PatternEditor"
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";

const downLeft = '↙️';
const upLeft = '↖️';
const center = '🟧';
const upRight = '↗️';
const downRight = '↘️';

function simple(s: string): ArrowProps {
  return {
    content: s
  }
}

const arrowChars: ArrowProps[] = [
  simple(downLeft),
  { content: upLeft, className: 'red-arrow' },
  simple(center),
  { content: upRight, className: 'red-arrow' },
  simple(downRight)
];

interface PatternType {
  id: string;
  description: string;
  arrowChars: ArrowProps[];
}

const doubleChars = arrowChars.concat(arrowChars);

const patternTypes: PatternType[] = [
  {
    id: 'pump-double',
    description: 'Double',
    arrowChars: doubleChars
  },
  {
    id: 'pump-single',
    description: 'Single',
    arrowChars: arrowChars
  },
];

interface EWTSProps {
  patternTypes: PatternType[]
}

function EditorWithTypeSelector(props: EWTSProps) {
  const [patIndex, setPatIndex] = useState<number>(0);
  const patType = props.patternTypes[patIndex];

  return (
    <>
      <select value={patIndex} onChange={e => setPatIndex(Number(e.target.value))}>
        {props.patternTypes.map((p, index) => (
          <option value={index} key={index}>{p.description}</option>
        ))}
      </select>
      <PatternEditor arrowChars={patType.arrowChars} />
    </>
  );
}

function App() {
  return (
    <div className="container">
      <h1>Five arrows (mostly ten, actually)</h1>
      <div className="row">
        <div className="col">
          <EditorWithTypeSelector patternTypes={patternTypes} />
        </div>
        <div className="col">
          <PatternEditor arrowChars={arrowChars} />
        </div>
        <div className="col">
          <PatternEditor arrowChars={doubleChars} />
        </div>
      </div>
    </div>
  )
}

export default App
