import domtoimage from 'dom-to-image';
import hljs from 'highlight.js/lib/core';
import cssConfig from 'highlight.js/lib/languages/css';
import javascriptConfig from 'highlight.js/lib/languages/javascript';
import xmlConfig from 'highlight.js/lib/languages/xml';
import { Plugin } from 'prettier';
import prettier from 'prettier/standalone';

import { scopeElement } from '@/shared/config/dom';
// disabled eslint because WebStorm crashes ESLint because of prettier

const FALLBACK_LANGUAGE = 'js';
const DEFAULT_PRINT_WIDTH = 80;

type FormatCodeOptions = {
  code: string;
  printWidth?: number;
  language?: string;
};

const pluginLoaders = {
  estree: async () => (await import('prettier/plugins/estree')).default,
  babel: async () => (await import('prettier/plugins/babel')).default,
  html: async () => (await import('prettier/plugins/html')).default,
  postcss: async () => (await import('prettier/plugins/postcss')).default,
  typescript: async () => (await import('prettier/plugins/typescript')).default,
} satisfies Record<string, () => Promise<Plugin>>;

const PARSERS_BY_LANGUAGE: Record<
  Required<FormatCodeOptions>['language'],
  { parser: string; plugins: () => Promise<Plugin[]> }
> = {
  js: {
    parser: 'babel',
    plugins: async () => [
      await pluginLoaders.babel(),
      await pluginLoaders.estree(),
    ],
  },
  ts: {
    parser: 'typescript',
    plugins: async () => [
      await pluginLoaders.estree(),
      await pluginLoaders.babel(),
      await pluginLoaders.typescript(),
    ],
  },
  html: { parser: 'html', plugins: async () => [await pluginLoaders.html()] },
  css: { parser: 'css', plugins: async () => [await pluginLoaders.postcss()] },
};

export const formatCode = async ({
  code,
  printWidth = DEFAULT_PRINT_WIDTH,
  language = FALLBACK_LANGUAGE,
}: FormatCodeOptions) => {
  const { parser, plugins } = PARSERS_BY_LANGUAGE[language];

  return (
    (await prettier?.format(code.trim(), {
      parser,
      plugins: await plugins(),
      printWidth,
    })) || code
  );
};

const createCodeContainer = (code: string) => {
  const codeEl = document.createElement('div');
  codeEl.className = `language-javascript text-base hljs m-0 flex overflow-hidden break-words whitespace-pre-wrap rounded-md font-mono overflow-hidden`;
  const spanEl = document.createElement('span');
  spanEl.className = `hljs p-2 text-base rounded-md overflow-hidden`;
  // spanEl.style.width = "100%";

  spanEl.innerHTML = code;

  codeEl.appendChild(spanEl);

  return codeEl;
};

export const renderCodeToImage = async ({
  code,
  language,
  printWidth = 80,
  target,
}: {
  code: string;
  language?: string;
  printWidth?: number;
  target?: HTMLImageElement | null;
}): Promise<string> => {
  if (target) {
    target.dataset.state = 'loading';
  }

  const highlightjsCode = await highlightCode({
    code,
    language,
    printWidth,
    format: true,
  });
  const codeContainer = createCodeContainer(highlightjsCode);

  scopeElement.appendChild(codeContainer);

  const node = codeContainer.children[0] as HTMLElement;
  const { offsetWidth: width, offsetHeight: height } = node;

  if (target) {
    target.width = width + 10;
    target.height = height;
  }

  // const scale = (width < height ? window.innerHeight / height : window.innerWidth / width) * 0.9;
  // const scale = 1.3;
  //
  // const data = await domtoimage.toBlob(node, {
  //   height: height * scale,
  //   width: (width + 10) * scale,
  //   quality: 1,
  //   cacheBust: true,
  //   style: {
  //     transform: `scale3d(${scale},${scale},${scale})`,
  //     transformOrigin: "top left",
  //     width: `${width + 10}px`,
  //     height: `${height}px`,
  //   },
  // });
  const data = await domtoimage.toBlob(node, {
    height,
    width: width + 10,
    quality: 1,
    cacheBust: true,
    style: {
      width: `${width + 10}px`,
      height: `${height}px`,
    },
  });

  const value = URL.createObjectURL(data);

  scopeElement.innerHTML = '';

  if (target) {
    target.src = value;
    target.dataset.state = 'ready';
  }

  return value;
};

const languages = [
  { alias: 'js', config: javascriptConfig },
  { alias: 'html', config: xmlConfig },
  { alias: 'css', config: cssConfig },
];

languages.forEach((language) => {
  hljs.registerLanguage(language.alias, language.config);
});

hljs.configure({
  languages: languages.map((language) => language.alias),
});

type HighlightCodeProps = {
  code?: string;
  language?: string;
  printWidth?: number;
  format?: boolean;
};

export const highlightCode = async ({
  code,
  language = 'js',
  printWidth,
  format,
}: HighlightCodeProps) => {
  if (!code) return '';

  let usedCode = code;

  if (format) {
    usedCode = (
      await formatCode({
        code,
        printWidth: printWidth || 120,
        language,
      })
    ).replace(/\/\/\s{0,}prettier-ignore/g, '');
  }

  const { value: codeHtml } = hljs.highlight(usedCode, {
    language,
    ignoreIllegals: true,
  });

  return codeHtml;
};
