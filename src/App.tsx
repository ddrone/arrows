import PatternEditor from "./PatternEditor"
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ChangeEvent, useEffect, useState } from "react";
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
    ],
    keybindings: [
      'k', '0', '\'', '2', 'o', 'e', '3', 'p', '5', 'i'
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
    ],
    keybindings: [
      'k', '0', '\'', '2', 'o'
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

interface PMProps {
  patternType: PatternType;
  arrows: boolean[][];
}

function PracticeMode(props: PMProps) {
  const [offset, setOffset] = useState(0);
  const [lastPressedKey, setLastPressedKey] = useState<string>('');
  const patType = props.patternType;

  function handleKeyDown(e: KeyboardEvent) {
    setLastPressedKey(e.key);
    // TODO: need to figure out how to not prevent every single keyboard event
    e.preventDefault();
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  useEffect(() => {
    const keyIndex = props.patternType.keybindings.indexOf(lastPressedKey);
    if (keyIndex !== -1) {
      advance(keyIndex);
    }
  }, [lastPressedKey, props.patternType.keybindings]);

  function advance(id: number) {
    if (offset >= props.arrows.length) {
      return;
    }

    const row = props.arrows[offset];
    const correct = row.every((present, index) => present === (index === id));
    if (correct) {
      setOffset(offset + 1);
    }
  }

  return (
    <>
      <PatternViewer arrowChars={patType.arrowChars} arrows={props.arrows} offset={offset} />
      <ButtonPad patternType={patType} onClick={advance} />
      <button onClick={() => setOffset(0)}>Restart</button>
    </>
  );
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
        <PracticeMode patternType={patType} arrows={arrows} />
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
