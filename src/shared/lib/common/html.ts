import insane from 'insane';

import { clamp } from 'lodash-es';
import { SyntheticEvent } from 'react';

/**
 * Вытаскивает rgb из цвета
 */
export const getComputedColor = (color?: string): string | null => {
  if (!color) return null;

  const d = document.createElement('div');
  d.style.color = color;
  document.body.appendChild(d);
  const rgbcolor = window.getComputedStyle(d).color;
  const match =
    /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[.d+]*)*\)/g.exec(rgbcolor);

  if (!match) return null;

  return `${match[1]}, ${match[2]}, ${match[3]}`;
};

export const skipEvent = (e: Event | SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();

  return false;
};

export const globalScrollIntoViewForY = (node: HTMLElement) => {
  const scrollContainer = document.body;
  const pageHeight = window.innerHeight;
  const nodeBounding = node.getBoundingClientRect();
  const scrollPagesCount = scrollContainer.scrollHeight / pageHeight;

  const scrollPageNumber = clamp(
    nodeBounding.top / pageHeight,
    1,
    scrollPagesCount,
  );

  window.scroll({
    top: scrollPageNumber * pageHeight,
    behavior: 'smooth',
  });
};

const insaneConfig = {
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    iframe: ['allowfullscreen', 'frameborder', 'src'],
    img: ['src'],
    span: ['class'],
    code: ['class'],
  },
  allowedClasses: {},
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedTags: [
    'a',
    'article',
    'b',
    'blockquote',
    'br',
    'caption',
    'code',
    'del',
    'details',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'ins',
    'kbd',
    'li',
    'main',
    'ol',
    'p',
    'pre',
    'section',
    'span',
    'strike',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ],
  filter: null,
  transformText: null,
};

export const sanitizeHtml = (html: Maybe<string>) => {
  return insane(html || '', insaneConfig);
};

export const checkElementHasParent = (
  element: HTMLElement | null,
  parent: Maybe<HTMLElement>,
) => {
  let node = element;

  if (!parent) return false;

  while (node != null) {
    if (node === parent) {
      return true;
    } else {
      node = node.parentElement;
    }
  }

  return false;
};
