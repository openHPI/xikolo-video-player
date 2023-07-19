import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { SlidePreviewBar } from './slide-preview-bar';

describe('Slide Preview Bar', () => {
  let page: SpecPage;

  beforeEach(async () => {
    const slidesSrc = [
      { thumbnail: 'https://www.fillmurray.com/200/200', startPosition: 10 },
      { thumbnail: 'https://www.fillmurray.com/200/200', startPosition: 23 },
      { thumbnail: 'https://www.fillmurray.com/200/200', startPosition: 50 },
      { thumbnail: 'https://www.fillmurray.com/200/200', startPosition: 100 },
    ];

    const slidesJSON = JSON.stringify(slidesSrc);
    const duration = 100;

    page = await newSpecPage({
      components: [SlidePreviewBar],
      html: `<xm-slide-preview-bar slides-src=${slidesJSON} duration={${duration}}></xm-slide-preview-bar>`,
    });
  });

  it('should render provided slides', async () => {
    const slidePreviewBar = await page.body.querySelector(
      'xm-slide-preview-bar',
    );
    const slides = slidePreviewBar.shadowRoot.querySelectorAll('.slide');

    expect(slides.length).toBe(4);
  });
});
