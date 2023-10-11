import PatternEditor, { ArrowProps } from "./PatternEditor"
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";
import { repeat } from "./utils/array";

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

function initArrows(patType: PatternType): boolean[][] {
  return repeat(repeat(false, patType.arrowChars.length), 4);
}

function encodeJsonDownloadLink(value: unknown): string {
  return `data:application/json,${JSON.stringify(value)}`;
}

function EditorWithTypeSelector(props: EWTSProps) {
  const [patIndex, setPatIndex] = useState<number>(0);
  const patType = props.patternTypes[patIndex];
  const [arrows, setArrows] = useState<boolean[][]>(initArrows(patType));

  function updatePatternType(newIndex: number) {
    const arrowsEmpty = arrows.every(row => row.every(x => !x));
    if (arrowsEmpty || confirm('Current state will be cleared, are you sure?')) {
      setPatIndex(newIndex);
      setArrows(initArrows(props.patternTypes[newIndex]));
    }
  }

  return (
    <>
      <select value={patIndex} onChange={e => updatePatternType(Number(e.target.value))}>
        {props.patternTypes.map((p, index) => (
          <option value={index} key={index}>{p.description}</option>
        ))}
      </select>
      <PatternEditor arrowChars={patType.arrowChars} arrows={arrows} onUpdate={setArrows} />
      <a href={encodeJsonDownloadLink({type: patType.id, arrows})} download="pattern.json">Download</a>
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
      </div>
    </div>
  )
}

export default App
