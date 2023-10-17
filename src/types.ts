export type ArrowDescription = {
  content: string;
  className?: string;
}

export interface PatternType {
  id: string;
  description: string;
  arrowChars: ArrowDescription[];
  buttonLayout: number[][];
  keybindings: string[];
}
