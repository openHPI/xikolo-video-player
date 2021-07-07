import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';

describe('controls', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <xm-player lang="en">
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

  it('should not render the textrack button', async () => {
    const controls: E2EElement = await page.find('xm-player >>> xm-controls');
    const texTrackButton: HTMLElement = controls.shadowRoot.querySelector(
      '[aria-label="Enable subtitles"]'
    );
    expect(texTrackButton).toBeFalsy();
  });

  /**
   * Functional Tests
   */

  it('should emit the settings menu open event', async () => {
    const player: E2EElement = await page.find('xm-player');
    const settingsButton: ElementHandle = await getSettingsButton();

    const openMenuEvent = await player.spyOnEvent('control:openSettingsMenu');

    // Open Setting via Button
    settingsButton.click();
    await page.waitForChanges();
    expect(openMenuEvent).toHaveReceivedEvent();
  });

  it('should emit the mute and unmute events', async () => {
    const player: E2EElement = await page.find('xm-player');
    const muteButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Mute"]');
      })
    ).asElement();

    const muteEvent = await player.spyOnEvent('control:mute');

    // Change mute state via Button
    muteButton.click();
    await page.waitForChanges();
    expect(muteEvent).toHaveReceivedEvent();

    const unmuteEvent = await player.spyOnEvent('control:unmute');

    // Change unmute state via Button
    muteButton.click();
    await page.waitForChanges();
    expect(unmuteEvent).toHaveReceivedEvent();
  });

  it('should emit the enter fullscreen event', async () => {
    const player: E2EElement = await page.find('xm-player');
    const fullscreenButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('body > xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Enter full screen"]');
      })
    ).asElement();

    const enterFullscreenEvent = await player.spyOnEvent(
      'control:enterFullscreen'
    );

    // Enable fullscreen via Button
    fullscreenButton.click();
    await page.waitForChanges();
    expect(enterFullscreenEvent).toHaveReceivedEvent();
  });

  /**
   *  At the moment the headful mode can not be used with our GitLab CI. Thats why we need to skip this
   *  test. The fullscreen event does not work without a browser head.
   **/
  it.todo('should emit exit fullscreen event');

  it('should emit the show and hide playback rate events', async () => {
    const player: E2EElement = await page.find('xm-player');
    const playbackRateButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Playback rate"]');
      })
    ).asElement();

    const showPlaybackRateEvent = await player.spyOnEvent(
      'control:showPlaybackRate'
    );

    // Show playback rate menu via Button
    playbackRateButton.click();
    await page.waitForChanges();
    expect(showPlaybackRateEvent).toHaveReceivedEvent();

    const hidePlaybackRateEvent = await player.spyOnEvent(
      'control:hidePlaybackRate'
    );

    // Hide playback rate menu via Button
    playbackRateButton.click();
    await page.waitForChanges();
    expect(hidePlaybackRateEvent).toHaveReceivedEvent();
  });

  it('should emit the change playback rate event', async () => {
    const player: E2EElement = await page.find('xm-player');

    const playbackRateButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Playback rate"]');
      })
    ).asElement();

    // Open playback rate menu
    playbackRateButton.click();
    await page.waitForChanges();

    // Select first playback rate value on the list and save value
    const playbackRateValueButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('.controls__playback-rate__button');
      })
    ).asElement();

    const playbackRateValue = await page.evaluate(
      (playbackRateValueButton) => playbackRateValueButton.textContent,
      playbackRateValueButton
    );

    const changePlaybackRateEvent = await player.spyOnEvent(
      'control:changePlaybackRate'
    );

    // Change playback rate value
    playbackRateValueButton.click();
    await page.waitForChanges();
    expect(changePlaybackRateEvent).toHaveReceivedEvent();

    expect(changePlaybackRateEvent.lastEvent.detail).toEqual({
      playbackRate: parseFloat(playbackRateValue),
    });
  });

  it('should emit the change volume event', async () => {
    const player: E2EElement = await page.find('xm-player');

    const volumeSlider: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Control volume"]');
      })
    ).asElement();
    const changeVolumeEvent = await player.spyOnEvent('control:changeVolume');

    // Click volume slider to change volume
    await volumeSlider.click();
    await page.waitForChanges();
    expect(changeVolumeEvent).toHaveReceivedEvent();
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

describe('controls with text track', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <xm-player lang="en">
      <xm-video slot="primary" src="340196868"></xm-video>
      <xm-text-track
          language="de"
          src="/static/de.vtt"
          label="Deutsch"
          default
        >
      </xm-text-track>
    </xm-player>
    `);
  });

  /**
   * Test presence of Buttons
   */
  it('should render the textrack button', async () => {
    const controls: E2EElement = await page.find('xm-player >>> xm-controls');
    const texTrackButton: HTMLElement = controls.shadowRoot.querySelector(
      '[aria-label="Enable subtitles"]'
    );
    expect(texTrackButton).toBeTruthy();
  });

  /**
   * Functional Tests
   */
  it('should emit the enable and disable text track events', async () => {
    const player: E2EElement = await page.find('xm-player');
    const textTrackButton: ElementHandle = (
      await page.waitForFunction(() => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('[aria-label="Enable subtitles"]');
      })
    ).asElement();

    const enableTextTrackEvent = await player.spyOnEvent(
      'control:enableTextTrack'
    );

    // Enable subtitles via Button
    textTrackButton.click();
    await page.waitForChanges();
    expect(enableTextTrackEvent).toHaveReceivedEvent();

    const disableTextTrackEvent = await player.spyOnEvent(
      'control:disableTextTrack'
    );

    // Disable subtitles via Button
    textTrackButton.click();
    await page.waitForChanges();
    expect(disableTextTrackEvent).toHaveReceivedEvent();
  });
});
