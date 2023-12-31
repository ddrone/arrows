import './PatternEditor.css';
import { classNames } from "./utils/conditionalClasses";
import { replacing } from "./utils/array";
import { ArrowDescription } from './types';

export function Arrow(props: ArrowDescription) {
  return (
    <span className={props.className}>
      {props.content}
    </span>
  );
}

interface ASProps {
  arrows: boolean[];
  arrowChars: ArrowDescription[];
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
          hidden: !active,
          ['arrow-btn']: true,
        })}
      >
        <Arrow {...props.arrowChars[i]} />
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
  arrows: boolean[][];
  onUpdate: (newArrows: boolean[][]) => void;
  arrowChars: ArrowDescription[];
}

function PatternEditor(props: PEProps) {
  const arrows = props.arrows;

  function updateArrows(moment: boolean[], i: number) {
    const newArrows = replacing(arrows, i, moment);
    const arrowsToAdd = Math.max(0, i + 4 - arrows.length);
    for (let j = 0; j < arrowsToAdd; j++) {
      newArrows.push(props.arrowChars.map(() => false));
    }

    props.onUpdate(newArrows);
  }

  function renderMoment(moment: boolean[], i: number) {
    if (moment.length !== props.arrowChars.length) {
      throw new Error(`internal error: wrong number of arrows (${moment.length})`);
    }

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
