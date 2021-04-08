import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';

describe('controls', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <xm-player>
      <xm-video slot="primary" src="340196868"></xm-video>
    </xm-player>
    `);
  });

  /**
   * Test presence of control elements
   */
  it('should render the controls', async () => {
    const controls: E2EElement = await page.find('xm-player >>> xm-controls');
    expect(controls).toBeTruthy();
  });

  it('should render a controls toolbar', async () => {
    const controls: E2EElement = await page.find('xm-player >>> xm-controls');
    const controlsToolbar: HTMLElement = controls.shadowRoot.querySelector(
      '[data-test-id="controlsToolbar"]'
    );
    expect(controlsToolbar).toBeTruthy();
  });

  /**
   * Test presence of Buttons
   */
  it('should render the play button', async () => {
    const controls: E2EElement = await page.find('xm-player >>> xm-controls');
    const playButton: HTMLElement = controls.shadowRoot.querySelector(
      '[aria-label="Play"]'
    );
    expect(playButton).toBeTruthy();
  });

  it('should render a settings menu toggle button', async () => {
    const controls: E2EElement = await page.find('xm-player >>> xm-controls');
    const settingsButton: HTMLElement = controls.shadowRoot.querySelector(
      '[aria-label="Settings"]'
    );
    expect(settingsButton).toBeTruthy();
  });

  it('should render the settings menu', async () => {
    const settingsMenu = await getSettingsMenu();
    expect(settingsMenu).toBeTruthy();
  });

  /**
   * Functional Tests
   */
  it('should fire play event', async () => {
    const player: E2EElement = await page.find('xm-player');
    const playEvent = await player.spyOnEvent('control:play');

    const playButton: ElementHandle = await getPlayButton();

    expect(playButton).toBeTruthy();

    playButton.click();
    await page.waitForChanges();

    expect(playEvent).toHaveReceivedEvent();
  });

  it('should emit the settings menu open event', async () => {
    const player: E2EElement = await page.find('xm-player');
    const settingsButton: ElementHandle = await getSettingsButton();

    const openMenuEvent = await player.spyOnEvent('control:openSettingsMenu');

    // Open Setting via Button
    settingsButton.click();
    await page.waitForChanges();
    expect(openMenuEvent).toHaveReceivedEvent();
  });

  /**
   * Helper Functions
   *
   * There is a bug in the puppeteer page.find() function with multiple piercing selectors.
   * If it is used to find elements under more than one layer of shadowRoots, it returns the first shadowRoot.
   *
   * E.g. await page.find('xm-player >>> xm-controls >>> xm-settings-menu') returns the xm-control
   *
   * There is a workaround:
   * https://github.com/Esri/calcite-components/pull/1103
   */

  const getPlayButton = async (): Promise<ElementHandle> => {
    const playButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Play"]');
      })
    ).asElement();
    return playButton;
  };

  const getSettingsMenu = async (): Promise<ElementHandle> => {
    const settingsMenu: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('xm-settings-menu');
      })
    ).asElement();
    return settingsMenu;
  };

  const getSettingsButton = async (): Promise<ElementHandle> => {
    const settingsButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('body > xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Settings"]');
      })
    ).asElement();
    return settingsButton;
  };
});
