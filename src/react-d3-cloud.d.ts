// src/types/react-d3-cloud.d.ts or types/react-d3-cloud.d.ts
declare module 'react-d3-cloud' {
  import * as React from 'react';

  export interface Word {
    text: string;
    value: number;
  }

  export interface WordCloudProps {
    data: Word[];
    height: number;
    font: string;
    fontSize: (word: Word) => number;
    rotate: number;
    padding: number;
    fill: string;
    onWordClick: (event: React.MouseEvent, word: Word) => void;
  }

  const D3WordCloud: React.FC<WordCloudProps>;

  export default D3WordCloud;
}
