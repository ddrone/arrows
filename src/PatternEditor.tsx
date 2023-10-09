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

interface ASProps {
  arrows: boolean[];
  onChange: (newState: boolean[]) => void;
}

function ArrowSelector(props: ASProps) {

  function updateState(newState: boolean[]) {
    props.onChange(newState);
  }

  function renderArrow(active: boolean, i: number) {
    return (
      <button
        key={i}
        onClick={() => updateState(replacing(props.arrows, i, !active))}
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
      {props.arrows.map(renderArrow)}
    </div>
  );
}

function PatternEditor() {
  const [arrows, setArrows] = useState(initialState);

  return <ArrowSelector arrows={arrows} onChange={setArrows} />;
}

export default PatternEditor
