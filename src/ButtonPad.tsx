import { Arrow } from "./PatternEditor"
import { PatternType } from "./types"

interface BPProps {
  patternType: PatternType
}

function ButtonPad(props: BPProps) {
  function renderRow(rowLayout: number[]) {
    return (
      <tr>
        {rowLayout.map(id =>
          <td>
            {id >= 0 && <button>
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
