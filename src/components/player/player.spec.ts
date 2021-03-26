import { newSpecPage } from '@stencil/core/testing';
import { Player } from './player';
import { Controls } from '../controls/controls';
import { defaultStatus } from '../../utils/status';
import { WebVTT } from '../../utils/webVTT';

describe('xm-player with props', () => {
  let page, controls;

  it('should build', () => {
    // Vimeo API is not working here, so we can not create/test the video component.
    expect(new Player()).toBeTruthy();
    expect(new Controls()).toBeTruthy();
  });

  beforeEach(async () => {
    page = await newSpecPage({
      html: `
      <xm-player lang="en" volume="0.3" playbackrate="2">
        <xm-video slot="primary" src="340196868"></xm-video>
        <xm-video slot="secondary" src="340196788"></xm-video>
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
    page.rootInstance.volume = 0;
    page.rootInstance.playbackrate = 1;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('should render with volume', async () => {
    expect(controls.shadowRoot.querySelector('.controls-volume')).toBeTruthy();
    let button = controls.shadowRoot.querySelector('.controls__mute');
    expect(button).not.toBeNull();
    page.rootInstance.volume = 0;
    await page.waitForChanges();
    expect(button).toHaveClass('controls__unmute');
    expect(page.root).toMatchSnapshot();
  });
});

describe('xm-player with subtitle props', () => {
  let page, controls, controlsInstance;

  beforeEach(async () => {
    page = await newSpecPage({
      html: `
      <xm-player lang="en" showsubtitle="true">
        <xm-video slot="primary" src="340196868"></xm-video>
        <xm-video slot="secondary" src="340196788"></xm-video>
        <xm-text-track language="de" src="../../static/de.vtt" label="Deutsch" default></xm-text-track>
        <xm-text-track language="en" src="../../static/en.vtt" label="English"></xm-text-track>
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
      controls.shadowRoot.querySelector('.controls__button')
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
    let ttlEvent = new CustomEvent('texttrack:loaded', {
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
