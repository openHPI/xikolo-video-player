import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';

describe('xm-player', () => {
  let page: E2EPage;
  let player: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
      <xm-player lang="en">
        <xm-video slot="primary" src="340196868"></xm-video>
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

    const playButton: ElementHandle = await getPlayButton();

    expect(playButton).toBeTruthy();

    await playButton.click();
    await page.waitForChanges();

    expect(playEvent).toHaveReceivedEvent();
  });

  // In our current setup, the video does not actually play.
  // There is an error instead of a proper "playing" state and we are unable to trigger a seek event
  it.todo('should fire pause event if player is playing');
  it.todo('should fire seek event');

  /**
   * Helper Function
   *
   * There is a bug in the puppeteer page.find() function with multiple piercing selectors.
   * If it is used to find elements under more than one layer of shadowRoots, it returns the first shadowRoot.
   *
   * E.g. await page.find('xm-player >>> xm-controls >>> xm-settings-menu') returns the xm-control
   *
   * There is a workaround:
   * https://github.com/Esri/calcite-components/pull/1103
   */
  const getPlayButton = async (): Promise<ElementHandle> =>
    (
      await page.waitForFunction((label: string) =>
        document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Play"]')
      )
    ).asElement();
});
