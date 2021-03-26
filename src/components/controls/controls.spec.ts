import { newSpecPage } from '@stencil/core/testing';
import { Controls } from '../controls/controls';
import { SettingsMenu } from '../settings-menu/settings-menu';
import { defaultStatus } from '../../utils/status';
import { TextTrackList, WebVTT } from '../../utils/webVTT';
import { ToggleControlProps } from '../../utils/types';

describe.skip('xm-controls', () => {
  let page, textTracks: TextTrackList, shadowRoot, controls, settingsMenu;

  it('should build', () => {
    expect(new Controls()).toBeTruthy();
    expect(new SettingsMenu()).toBeTruthy();
  });

  beforeEach(async () => {
    page = await newSpecPage({
      html: `<div></div>`,
      components: [Controls, SettingsMenu],
      supportsShadowDom: true,
    });

    textTracks = new TextTrackList();
    controls = page.doc.createElement('xm-controls');
    controls.status = defaultStatus;
    controls.textTracks = textTracks;
    page.root.appendChild(controls);
    await page.waitForChanges();
    expect(page.rootInstance).toBeTruthy();
    expect(page.root.querySelector('xm-controls')).toBeTruthy();
    shadowRoot = page.root.querySelector('xm-controls').shadowRoot;
    expect(shadowRoot).toBeTruthy();

    // We need to render all child components manually for acces to their shadow doms!
    settingsMenu = shadowRoot.querySelector('xm-settings-menu');
    let settingsInstance = new SettingsMenu();
    settingsInstance.status = defaultStatus;
    settingsInstance.textTracks = textTracks;
    settingsMenu.innerHTML = settingsInstance.render();
    await page.waitForChanges();
    expect(settingsMenu.shadowRoot).toBeTruthy();
  });

  it('should render the settings-menu', async () => {
    const status = {
      ...controls.status,
      openedSettingsMenu: true,
    };
    expect(
      settingsMenu.shadowRoot.querySelector('.settings-menu')
    ).toBeTruthy();
    expect(
      settingsMenu.shadowRoot.querySelector('.settings-menu.menu--open')
    ).not.toBeTruthy();
    expect(
      shadowRoot.querySelector('.controls__settings-icon')
    ).not.toHaveClass('controls__settings-icon--open');
    let button = shadowRoot.querySelector('.controls__settings-icon')
      .parentNode;
    expect(button).toBeTruthy();
    button.click();
    controls.status = status;
    await page.waitForChanges();
    expect(shadowRoot.querySelector('.controls__settings-icon')).toHaveClass(
      'controls__settings-icon--open'
    );
    expect(
      settingsMenu.shadowRoot.querySelector('.settings-menu.menu--open')
    ).toBeTruthy();
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
    expect(
      shadowRoot.querySelector('.controls__subtitle-icon')
    ).not.toBeTruthy();
    let textTrackValue = settingsMenu.shadowRoot.querySelector(
      '.settings-menu__button-value'
    ).firstChild;
    expect(textTrackValue.nodeValue.trim()).toBe('Off');
    expect(settingsMenu.status.settings.textTrack).toBe('off');
    expect(textTracks.getTextTracks()).toBe(null);
    textTracks.addWebVTT(de, 1);
    await page.waitForChanges();
    expect(textTracks.getTextTracks().length).toBe(1);
    controls.status = status;
    await page.waitForChanges();
    expect(
      shadowRoot
        .querySelector('.controls__button')
        .querySelector('.controls__button-icon')
    ).toBeTruthy();
    expect(
      shadowRoot
        .querySelector('.controls__button')
        .querySelector('.controls__button-icon')
    ).toHaveClass('controls__button-icon--active');
    expect(settingsMenu.status.settings.textTrack).toBe('de');
    // must reselect it for testing !
    textTrackValue = settingsMenu.shadowRoot.querySelector(
      '.settings-menu__button-value'
    ).firstChild;
    expect(textTrackValue.nodeValue.trim()).toBe('Deutsch');
    const subtitleSubmenubutton = settingsMenu.shadowRoot.querySelector(
      '.settings-menu__button'
    ).firstChild;
    subtitleSubmenubutton.click();
    await page.waitForChanges();
    const submenu = settingsMenu.shadowRoot.querySelector(
      '.settings-menu__submenu-content'
    );
    expect(submenu.querySelector('.settings-menu__button')).toBeTruthy();
    expect(submenu.childNodes.length).toBe(2);
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

    let controls = page.doc.createElement('xm-controls');

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
