import { Arrow } from "./PatternEditor"
import { PatternType } from "./types"

import "./ButtonPad.css"

interface BPProps {
  patternType: PatternType,
  onClick: (arrId: number) => void;
}

function ButtonPad(props: BPProps) {
  function renderRow(rowLayout: number[]) {
    return (
      <tr>
        {rowLayout.map(id =>
          <td>
            {id >= 0 && <button onClick={() => props.onClick(id)} className="arrow-pad">
              <Arrow {...props.patternType.arrowChars[id]} />
            </button>}
          </td>
        )}
      </tr>
    )
  }

  return (
    <table>
      {props.patternType.buttonLayout.map(renderRow)}
    </table>
  )
}

export default ButtonPad
