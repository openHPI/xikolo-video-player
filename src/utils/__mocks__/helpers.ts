/**
 * Returns a configuration that is usually provided by `xm-presentation` components in the DOM.
 * On spec pages, we do not have access to deeper nested custom elements which prevents us from using markup.
 */
export const getPresentationNodes = () => [
  {
    reference: 'first-source,second-source',
    label: 'Dual stream mode',
    name: 'dual',
  },
];

export const getVideoElement = () => {
  return document.createElement('div');
};
