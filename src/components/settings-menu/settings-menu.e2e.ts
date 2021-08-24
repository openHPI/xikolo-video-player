import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';
import {
  getControlsElement,
  getSettingsMenuElement,
} from '../../utils/testing-helpers';

/**
 * Hint: The seetings menu will be removed and changed to a new language menu for controls.
 * */
describe('settings-menu', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <xm-player lang="en">
      <xm-video slot="primary" src="340196868"></xm-video>
      <xm-text-track language="de" src="../../static/de.vtt" label="Deutsch" default></xm-text-track>
      <xm-text-track language="en" src="../../static/en.vtt" label="English"></xm-text-track>
    </xm-player>
    `);
  });

  it('should exists', async () => {
    const settingsMenu = await getControlsElement(page, 'xm-settings-menu');
    expect(settingsMenu).toBeTruthy();
  });

  it('should fire the text track change event', async () => {
    const player: E2EElement = await page.find('xm-player');
    // First step: open the settings menu
    const settingsButton: ElementHandle = await getControlsElement(
      page,
      '[aria-label="Settings"]'
    );
    const openMenuEvent = await player.spyOnEvent('control:openSettingsMenu');
    settingsButton.click();
    await page.waitForChanges();
    expect(openMenuEvent).toHaveReceivedEvent();
    // Second step: open the subtitles submenu
    const subtitleButton: ElementHandle = await getSettingsMenuElement(
      page,
      '[aria-label="Subtitles"]'
    );
    expect(subtitleButton).toBeTruthy();
    subtitleButton.click();
    await page.waitForChanges();
    // Third step: click on an other language as the default 'German' one
    const changeTextTrackEvent = await player.spyOnEvent(
      'setting:changeTextTrack'
    );
    const englishButton: ElementHandle = await getSettingsMenuElement(
      page,
      '[aria-label="English"]'
    );
    expect(englishButton).toBeTruthy();
    englishButton.click();
    await page.waitForChanges();
    expect(changeTextTrackEvent).toHaveReceivedEventDetail({
      textTrack: 'en',
    });
  });
});

/**
 * Does not work at the moment, tbd later
 */
describe.skip('text track', () => {
  it.todo(
    'should load and emit a `texttrack:loaded` event on load',
    async () => {
      const page = await newE2EPage();
      // const loadedEvent = await page.spyOnEvent('texttrack:loaded');
      await page.setContent(`
      <xm-player lang="en">
        <xm-video slot="primary" src="340196868"></xm-video>
        <xm-text-track
            language="de"
            src="../../static/de.vtt"
            label="Deutsch"
            default
          >
        </xm-text-track>
      </xm-player>
    `);
      await page.waitForEvent('texttrack:loaded');
      expect(true).toBeTruthy();
    }
  );
});
