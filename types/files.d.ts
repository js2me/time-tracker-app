declare module '*.ttf' {
  const font: string;
  export default font;
}

declare module '*.css' {
  const map: Record<string, string>;
  export default map;
}

declare module '*.scss' {
  // type ExportableSizes = {
  //   screenXs: string;
  //   screenS: string;
  //   screenM: string;
  //   screenL: string;
  //   screenXl: string;
  // };

  const map: Record<string, string>;
  export default map;
}

declare module '*.eot' {
  const font: string;
  export default font;
}

declare module '*.woff' {
  const font: string;
  export default font;
}

declare module '*.png' {
  const img: string;
  export default img;
}

declare module '*.svg' {
  const img: string;
  export default img;
}

declare module '*.jpg' {
  const img: string;
  export default img;
}
