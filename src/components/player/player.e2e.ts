import { newE2EPage, E2EPage } from '@stencil/core/testing';

describe('xm-player', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    page.on('error', (e) => console.warn(`Error in browser context:\n  ${e}`));
  });

  test('render', async () => {
    await page.setContent(`
      <xm-player>
        <xm-video slot="primary" src="340196868"></xm-video>
      </xm-player>
    `);

    const player = await page.find('xm-player');
    expect(player).toHaveClass('hydrated');
  });

  test('render controls', async () => {
    await page.setContent(`
      <xm-player controls>
        <xm-video slot="primary" src="340196868"></xm-video>
      </xm-player>
    `);

    const player = await page.find('xm-player');
    const controls = player.shadowRoot.querySelector('xm-controls');
    expect(controls).not.toBeNull();
    expect(controls).toHaveClass('hydrated');
  });
});
