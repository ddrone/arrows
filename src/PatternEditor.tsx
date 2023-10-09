import { useState } from "react";

import './PatternEditor.css';
import { classNames } from "./utils/conditionalClasses";
import { replacing } from "./utils/array";

const downLeft = '↙️';
const upLeft = '↖️';
const center = '🟧';
const upRight = '↗️';
const downRight = '↘️';

const arrowChars = [
  downLeft,
  upLeft,
  center,
  upRight,
  downRight
];

const initialState = arrowChars.map(() => false);

function ArrowSelector() {
  const [arrows, setArrows] = useState(initialState);

  function renderArrow(active: boolean, i: number) {
    return (
      <button
        onClick={() => setArrows(replacing(arrows, i, !active))}
        className={classNames({
          hidden: !active
        })}
      >
        {arrowChars[i]}
      </button>
    );
  }

  return (
    <div>
      {arrows.map(renderArrow)}
    </div>
  );
}

function PatternEditor() {
  return <ArrowSelector />;
}

export default PatternEditor
