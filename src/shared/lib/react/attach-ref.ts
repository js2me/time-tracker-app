import { Ref } from 'react';

export const attachRef = <Element>(
  ref: Ref<Element> | undefined | null,
  node: Element | null,
) => {
  if (!ref) return;
  if (typeof ref === 'object') {
    (ref as AnyObject).current = node;
  } else {
    ref(node);
  }
};
