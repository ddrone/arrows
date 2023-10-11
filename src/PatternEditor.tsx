import { useState } from "react";

import './PatternEditor.css';
import { classNames } from "./utils/conditionalClasses";
import { replacing } from "./utils/array";


interface ASProps {
  arrows: boolean[];
  arrowChars: string[];
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
        {props.arrowChars[i]}
      </button>
    );
  }

  return (
    <div>
      {props.arrows.map(renderArrow)}
    </div>
  );
}

interface PEProps {
  arrowChars: string[];
}

function PatternEditor(props: PEProps) {
  const [arrows, setArrows] = useState<boolean[][]>(Array(4).fill(props.arrowChars.map(() => false)));

  function updateArrows(moment: boolean[], i: number) {
    const newArrows = replacing(arrows, i, moment);
    const arrowsToAdd = Math.max(0, i + 4 - arrows.length);
    for (let j = 0; j < arrowsToAdd; j++) {
      newArrows.push(props.arrowChars.map(() => false));
    }

    setArrows(newArrows);
  }

  function renderMoment(moment: boolean[], i: number) {
    return <ArrowSelector
      key={i} // Using index an key is only OK while I don't have an abitily to remove moments
      arrows={moment}
      onChange={a => updateArrows(a, i)}
      arrowChars={props.arrowChars}
    />
  }

  return (
    <>
      {arrows.map(renderMoment)}
    </>
  )
}

export default PatternEditor
