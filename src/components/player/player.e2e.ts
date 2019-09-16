import { newE2EPage } from '@stencil/core/testing';

describe('xm-player', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<xm-player></xm-player>');
    const element = await page.find('xm-player');
    expect(element).toHaveClass('hydrated');
  });
});
