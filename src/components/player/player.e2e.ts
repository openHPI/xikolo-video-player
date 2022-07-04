import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';
import { getControlsElement } from '../../utils/testing-helpers';

describe('xm-player', () => {
  let page: E2EPage;
  let player: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
      <xm-player lang="en">
        <div slot="primary"></div>
      </xm-player>
    `);
    player = await page.find('xm-player');
  });

  test('should render', async () => {
    expect(player).toHaveClass('hydrated');
  });

  test('should render controls', async () => {
    const controls = player.shadowRoot.querySelector('xm-controls');
    expect(controls).not.toBeNull();
    expect(controls).toHaveClass('hydrated');
  });

  it('should fire play event', async () => {
    const playEvent = await player.spyOnEvent('control:play');

    const playButton: ElementHandle = await getControlsElement(
      page,
      '[aria-label="Play"]'
    );

    expect(playButton).toBeTruthy();

    await playButton.click();
    await page.waitForChanges();

    expect(playEvent).toHaveReceivedEvent();
  });

  // In our current setup, the video does not actually play.
  // There is an error instead of a proper "playing" state and we are unable to trigger a seek event
  it.todo('should fire pause event if player is playing');
  it.todo('should fire seek event');
});
