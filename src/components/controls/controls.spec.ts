import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Controls } from '../controls/controls';
import { SettingsMenu } from '../settings-menu/settings-menu';
import { defaultStatus } from '../../utils/status';
import { TextTrackList, WebVTT } from '../../utils/webVTT';
import { ToggleControlProps } from '../../utils/types';

describe('xm-controls', () => {
  let page: SpecPage;
  let textTracks: TextTrackList;
  let controls;
  let settingsMenu;

  beforeEach(async () => {
    page = await newSpecPage({
      html: `<div></div>`,
      components: [Controls, SettingsMenu],
    });

    textTracks = new TextTrackList();

    // Render controls
    controls = page.doc.createElement('xm-controls');
    controls.status = defaultStatus;
    controls.textTracks = textTracks;
    page.root.appendChild(controls);
    await page.waitForChanges();

    settingsMenu = controls.shadowRoot.querySelector('xm-settings-menu');
  });

  it('should render opened settings-menu with openedSettingsMenu status', async () => {
    expect(page.root).toMatchSnapshot();

    const status = {
      ...controls.status,
      openedSettingsMenu: true,
    };
    controls.status = status;
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should show a list of texttracks', async () => {
    const de: WebVTT = {
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
    const status = {
      ...controls.status,
      subtitle: {
        ...controls.status.textTrack,
        enabled: true,
        language: 'de',
      },
      settings: {
        ...controls.status.settings,
        textTrack: 'de',
      },
    };

    // Check default
    expect(settingsMenu.status.settings.textTrack).toBe('off');
    expect(textTracks.getTextTracks()).toBe(null);
    expect(page.root).toMatchSnapshot();

    // Set text tracks via function
    textTracks.addWebVTT(de, 1);
    await page.waitForChanges();

    expect(textTracks.getTextTracks().length).toBe(1);

    // Set another language via status and enable it
    controls.status = status;
    await page.waitForChanges();

    expect(settingsMenu.status.settings.textTrack).toBe('de');
    expect(textTracks.getTextTrackValues().length).toBe(2);
    expect(page.root).toMatchSnapshot();
  });
});

describe('xm-controls with control-toggle', () => {
  it('should match snapshot', async () => {
    const pageConfig = {
      html: `<div></div>`,
      components: [Controls],
    };
    const page = await newSpecPage(pageConfig);

    const controls = page.doc.createElement('xm-controls');

    const toggleControlProps: Array<ToggleControlProps> = [
      {
        name: 'test',
        title: 'test title',
        active: true,
      },
    ];

    controls.toggleControlButtons = toggleControlProps;
    controls.status = defaultStatus;
    page.root.appendChild(controls);

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
