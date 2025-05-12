import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';
import {
  getControlsElement,
  getSettingsMenuElement,
} from '../../utils/testing-helpers';

describe('settings-menu', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
    <xm-player lang="en">
      <div name="ref"></div>
      <xm-text-track language="de" src="../../static/de.vtt" label="Deutsch" default></xm-text-track>
      <xm-text-track language="en" src="../../static/en.vtt" label="English"></xm-text-track>
      <xm-presentation reference="ref" name="single" label="Generic stream"></xm-presentation>
    </xm-player>
    `);
  });

  it('should exists', async () => {
    const settingsMenu = await getControlsElement(page, 'xm-settings-menu');
    expect(settingsMenu).toBeTruthy();
  });

  it.skip('should fire the text track change event', async () => {
    const player: E2EElement = await page.find('xm-player');
    // First step: open the settings menu
    const settingsButton: ElementHandle = await getControlsElement(
      page,
      '[aria-label="Settings"]',
    );
    const openMenuEvent = await player.spyOnEvent('control:openSettingsMenu');
    await settingsButton.click();
    await page.waitForChanges();
    expect(openMenuEvent).toHaveReceivedEvent();
    // Second step: open the subtitles submenu
    const subtitleButton: ElementHandle = await getSettingsMenuElement(
      page,
      '[aria-label="Subtitles"]',
    );
    expect(subtitleButton).toBeTruthy();
    await subtitleButton.click();
    await page.waitForChanges();
    // Third step: click on an other language as the default 'German' one
    const changeTextTrackEvent = await player.spyOnEvent(
      'setting:changeTextTrack',
    );
    const englishButton: ElementHandle = await getSettingsMenuElement(
      page,
      '[aria-label="English"]',
    );
    expect(englishButton).toBeTruthy();
    await englishButton.click();
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
  it.skip('should load and emit a `texttrack:loaded` event on load', async () => {
    const page = await newE2EPage();
    // const loadedEvent = await page.spyOnEvent('texttrack:loaded');
    await page.setContent(`
      <xm-player lang="en">
        <div slot="primary"></div>
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
  });
});
