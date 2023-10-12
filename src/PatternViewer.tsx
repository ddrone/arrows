import { Arrow } from "./PatternEditor";
import { range, repeat } from "./utils/array";
import { classNames } from "./utils/conditionalClasses";

import "./PatternViewer.css";
import { ArrowDescription } from "./types";

interface PVProps {
  arrowChars: ArrowDescription[];
  arrows: boolean[][];
  offset?: number;
}

const rowsToDisplay = 8;

function PatternViewer(props: PVProps) {
  const showFrom = props.offset ?? 0;

  function renderRow(i: number) {
    const row = props.arrows[i] ?? repeat(false, props.arrowChars.length);

    return (
      <tr>
        {row.map((v, j) => <td className={classNames({disabled: !v})}><Arrow {...props.arrowChars[j]} /></td>)}
      </tr>
    )
  }

  return (
    <table className="viewer">
      {range(showFrom, showFrom + rowsToDisplay).map(renderRow)}
    </table>
  )
}

export default PatternViewer
