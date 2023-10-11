import PatternEditor from "./PatternEditor"
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container">
      <h1>Five arrows (mostly ten, actually)</h1>
      <div className="row">
        <div className="col">
          <PatternEditor />
        </div>
        <div className="col">
          Modified patterns will go here
        </div>
      </div>
    </div>
  )
}

export default App
