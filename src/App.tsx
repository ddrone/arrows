import PatternEditor, { ArrowProps } from "./PatternEditor"
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const downLeft = '↙️';
const upLeft = '↖️';
const center = '🟧';
const upRight = '↗️';
const downRight = '↘️';

function simple(s: string): ArrowProps {
  return {
    content: s
  }
}

const arrowChars: ArrowProps[] = [
  simple(downLeft),
  { content: upLeft, className: 'red-arrow' },
  simple(center),
  { content: upRight, className: 'red-arrow' },
  simple(downRight)
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
