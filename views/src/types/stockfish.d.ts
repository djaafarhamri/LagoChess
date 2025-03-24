declare module 'stockfish.js' {
  export class Stockfish {
    constructor();
    postMessage(message: string): void;
    onmessage: (event: { data: string }) => void;
  }
} 