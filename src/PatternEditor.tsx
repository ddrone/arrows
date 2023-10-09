const downLeft = '↙️';
const upLeft = '↖️';
const center = '🟧';
const upRight = '↗️';
const downRight = '↘️';

const arrows = [
  downLeft,
  upLeft,
  center,
  upRight,
  downRight
];

function PatternEditor() {
  return arrows.join('');
}

export default PatternEditor
