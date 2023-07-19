jest.mock('../../utils/helpers');

import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { Player } from './player';
import { Controls } from '../controls/controls';
import { defaultStatus, Mode } from '../../utils/status';
import { WebVTT } from '../../utils/webVTT';

describe('xm-player default functionality', () => {
  let player: Player;

  beforeEach(async () => {
    player = new Player();
    // Mock primary video slot, so initialization does not crash
    // @ts-ignore
    player.primary = player.el.appendChild(document.createElement('div'));
  });

  /*
   * Tests for public API
   */
  it('play will set the mode to playing', async () => {
    expect(player.status.mode).toEqual(Mode.PAUSED);
    await player.play();
    expect(player.status.mode).toEqual(Mode.PLAYING);
  });

  it('pause will set the mode to pause ', async () => {
    expect(player.status.mode).toEqual(Mode.PAUSED);
    await player.play();
    await player.pause();
    expect(player.status.mode).toEqual(Mode.PAUSED);
  });

  it('seeking on a paused player will not trigger playing mode', async () => {
    expect(player.status.mode).toEqual(Mode.PAUSED);
    await player.seek(10);
    expect(player.status.mode).toEqual(Mode.PAUSED);
  });

  it('seeking will trigger playing, if the player is in playing mode', async () => {
    await player.play();
    await player.seek(10);
    expect(player.status.mode).toEqual(Mode.PLAYING);
  });
});

describe('xm-player with props', () => {
  let page: SpecPage;
  let controls: HTMLXmControlsElement;

  it('should build', () => {
    // Vimeo API is not working here, so we can not create/test the video component.
    expect(new Player()).toBeTruthy();
    expect(new Controls()).toBeTruthy();
  });

  beforeEach(async () => {
    page = await newSpecPage({
      html: `
      <xm-player lang="en" volume="0.3" playbackrate="2">
        <div name="first-source"></div>
        <div name="second-source"></div>
        <xm-presentation reference="first-source,second-source" name="dual" label="Dual stream mode></xm-presentation>
      </xm-player>
    `,
      components: [Player, Controls],
    });

    // We need to render all child components manually for access to their shadow doms!
    controls = page.root.shadowRoot.querySelector('xm-controls');
    const controlsInstance = new Controls();
    controlsInstance.status = defaultStatus;
    controls.innerHTML = controlsInstance.render();
    await page.waitForChanges();
    expect(controls.shadowRoot).toBeTruthy();
  });

  it('should render', async () => {
    expect(page.root.shadowRoot).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.player')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('xm-controls')).toBeTruthy();
    expect(page.root.getAttribute('lang')).toBe('en');
    expect(page.root.getAttribute('volume')).toBe('0.3');
    expect(page.root.getAttribute('playbackrate')).toBe('2');
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('should render with ui language change', async () => {
    page.rootInstance.lang = 'de';
    await page.waitForChanges();
    expect(page.rootInstance.status.language).toBe('de');
    expect(page.root).toMatchSnapshot();
  });

  it('should fall back to English when the page has an unknown language', async () => {
    page.rootInstance.lang = 'fr';
    await page.waitForChanges();
    expect(page.rootInstance.status.language).toBe('en');
    expect(page.root).toMatchSnapshot();
  });

  it('should render with playback rate change', async () => {
    page.rootInstance.playbackrate = 1.75;
    await page.waitForChanges();
    expect(page.rootInstance.status.settings.playbackRate).toBe(1.75);
    expect(page.root).toMatchSnapshot();
  });

  it('should render with volume change', async () => {
    expect(controls.shadowRoot.querySelector('.controls-volume')).toBeTruthy();
    const button = controls.shadowRoot.querySelector('.controls__mute');
    expect(button).not.toBeNull();
    page.rootInstance.volume = 0;
    await page.waitForChanges();
    expect(page.rootInstance.status.volume).toBe(0);
    expect(page.rootInstance.status.muted).toBe(true);
    expect(button).toHaveClass('controls__unmute');
  });
});

describe('xm-player with subtitle props', () => {
  let page: SpecPage;
  let controls: HTMLXmControlsElement;
  let controlsInstance: Controls;

  beforeEach(async () => {
    page = await newSpecPage({
      html: `
      <xm-player lang="en" showsubtitle="true">
        <div name="first-source"></div>
        <div name="second-source"></div>
        <xm-text-track language="de" src="../../static/de.vtt" label="Deutsch" default></xm-text-track>
        <xm-text-track language="en" src="../../static/en.vtt" label="English"></xm-text-track>
        <xm-presentation reference="first-source,second-source" name="dual" label="Dual stream mode></xm-presentation>
      </xm-player>
    `,
      components: [Player, Controls],
    });

    // We need to render all child components manually for acces to their shadow doms!
    controls = page.root.shadowRoot.querySelector('xm-controls');
    controlsInstance = new Controls();
    controlsInstance.status = page.rootInstance.status;
    controlsInstance.textTracks = page.rootInstance.textTracks;
    controls.innerHTML = controlsInstance.render();
    await page.waitForChanges();
    expect(controls.shadowRoot).toBeTruthy();
  });

  it('should render with default text track and an active subtitle button', async () => {
    expect(page.root.shadowRoot).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.player')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('xm-controls')).toBeTruthy();
    expect(page.root.getAttribute('showsubtitle')).toBe('true');
    expect(
      controls.shadowRoot.querySelector('.controls__button'),
    ).not.toBeTruthy();
    // Mock a loaded textTrack file
    const vtt: WebVTT = {
      meta: {
        language: 'de',
        label: 'Deutsch',
      },
      cues: [
        {
          end: 1,
          identifier: '1',
          start: 1,
          styles: '',
          text: 'test',
        },
      ],
      strict: true,
      valid: true,
      index: 0,
    };
    // Trigger the texttrack:loaded event
    const ttlEvent = new CustomEvent('texttrack:loaded', {
      detail: {
        webVTT: vtt,
        total: 1,
        isDefault: true,
      },
    });
    page.root.dispatchEvent(ttlEvent);
    await page.waitForChanges();
    expect(page.rootInstance.status.subtitle.language).toBe('de');
    controlsInstance.status = page.rootInstance.status;
    controlsInstance.textTracks = page.rootInstance.textTracks;
    controls.innerHTML = controlsInstance.render();
    await page.waitForChanges();
    expect(controls.shadowRoot).toBeTruthy();
    // Finally test the rendered output
    expect(controls.shadowRoot.querySelector('.controls__button')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });
});
