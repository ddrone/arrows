import PatternEditor from "./PatternEditor"
import "bootstrap/dist/css/bootstrap.min.css";

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

const doubleChars = arrowChars.concat(arrowChars);

function App() {
  return (
    <div className="container">
      <h1>Five arrows (mostly ten, actually)</h1>
      <div className="row">
        <div className="col">
          <PatternEditor arrowChars={arrowChars} />
        </div>
        <div className="col">
          <PatternEditor arrowChars={doubleChars} />
        </div>
      </div>
    </div>
  )
}

export default App
