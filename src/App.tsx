import PatternEditor from "./PatternEditor"
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ChangeEvent, useState } from "react";
import { repeat } from "./utils/array";
import PatternViewer from "./PatternViewer";
import { ArrowDescription, PatternType } from "./types";
import ButtonPad from "./ButtonPad";

const downLeft = '↙️';
const upLeft = '↖️';
const center = '🟧';
const upRight = '↗️';
const downRight = '↘️';

function simple(s: string): ArrowDescription {
  return {
    content: s
  }
}

const arrowChars: ArrowDescription[] = [
  simple(downLeft),
  { content: upLeft, className: 'red-arrow' },
  simple(center),
  { content: upRight, className: 'red-arrow' },
  simple(downRight)
];

const doubleChars = arrowChars.concat(arrowChars);

const patternTypes: PatternType[] = [
  {
    id: 'pump-double',
    description: 'Double',
    arrowChars: doubleChars,
    buttonLayout: [
      [  1, -1,  3,  6, -1,  8 ],
      [ -1,  2, -1, -1,  7, -1 ],
      [  0, -1,  4,  5, -1,  9 ]
    ]
  },
  {
    id: 'pump-single',
    description: 'Single',
    arrowChars: arrowChars,
    buttonLayout: [
      [  1, -1,  3 ],
      [ -1,  2, -1 ],
      [  0, -1,  4 ]
    ]
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

  function isClearingOK(): boolean {
    const arrowsEmpty = arrows.every(row => row.every(x => !x));
    return arrowsEmpty || confirm('Current state will be replaced, are you sure?');
  }

  function updatePatternType(newIndex: number) {
    if (isClearingOK()) {
      setPatIndex(newIndex);
      setArrows(initArrows(props.patternTypes[newIndex]));
    }
  }

  function loadJson(json: unknown): true|string {
    if (typeof json !== 'object' || json === null || !('type' in json)) {
      return 'Not an object';
    }

    const type = json.type;
    const newIndex = props.patternTypes.findIndex(t => t.id === type);
    if (newIndex === -1) {
      return `Pattern type ${type} not found`;
    }

    if (!('arrows' in json)) {
      return 'No arrows field';
    }

    const newPatType = props.patternTypes[newIndex];
    const arrows = json.arrows;
    if (!Array.isArray(arrows)) {
      return 'Arrows is not an array';
    }

    const patWidth = newPatType.arrowChars.length;
    for (const row of arrows) {
      if (!Array.isArray(row)) {
        return 'One of the rows is not an array';
      }

      if (row.length !== patWidth) {
        return `Wrong length of array: expected ${patWidth}, got ${row.length}`;
      }

      for (const arrow of row) {
        if (typeof arrow !== 'boolean') {
          return 'One of elements is not a boolean';
        }
      }
    }

    if (isClearingOK()) {
      setPatIndex(newIndex);
      setArrows(arrows);
    }
    return true;
  }

  function openPattern(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files === null) {
      return;
    }

    if (files.length !== 1) {
      throw new Error("expected a single file");
    }
    const file = files[0];
    file.text().then(JSON.parse).then(json => {
      const loadStatus = loadJson(json)
      if (typeof loadStatus === 'string') {
        alert(`File parsing error: ${loadStatus}`);
      }
    });

    e.target.value = '';
  }

  return (
    <>
      <div className="col">
        <select value={patIndex} onChange={e => updatePatternType(Number(e.target.value))}>
          {props.patternTypes.map((p, index) => (
            <option value={index} key={index}>{p.description}</option>
          ))}
        </select>
        <PatternEditor arrowChars={patType.arrowChars} arrows={arrows} onUpdate={setArrows} />
        <div>
          <a href={encodeJsonDownloadLink({type: patType.id, arrows})} download="pattern.json">Download</a>
        </div>
        <input type="file" accept=".json" onChange={openPattern} />
      </div>
      <div className="col">
        <PatternViewer arrowChars={patType.arrowChars} arrows={arrows} />
        <ButtonPad patternType={patType} />
      </div>
    </>
  );
}

function App() {
  return (
    <div className="container">
      <h1>Five arrows (mostly ten, actually)</h1>
      <div className="row">
        <EditorWithTypeSelector patternTypes={patternTypes} />
      </div>
    </div>
  )
}

export default App
