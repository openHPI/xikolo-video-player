import { newSpecPage } from "@stencil/core/testing";
import { Controls } from '../controls/controls';
import { SettingsMenu } from "../settings-menu/settings-menu";
import { defaultStatus } from '../../utils/status';
import { TextTrack, WebVTT } from '../../utils/webVTT';

describe('xm-controls', () => {
  let page, textTrack: TextTrack, shadowRoot, controls, settingsMenu;

  it('should build', () => {
    expect(new Controls()).toBeTruthy();
    expect(new SettingsMenu()).toBeTruthy();
  });

  beforeEach(async () => {
    page = await newSpecPage({
      html: `<div></div>`,
      components: [Controls, SettingsMenu],
      supportsShadowDom: true
    });

    textTrack = new TextTrack();
    controls = page.doc.createElement('xm-controls');
    controls.status = defaultStatus;
    controls.textTrack = textTrack;
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
    settingsInstance.isOpen = false;
    settingsInstance.textTrack = textTrack;
    settingsMenu.innerHTML = settingsInstance.render();
    await page.waitForChanges();
    expect(settingsMenu.shadowRoot).toBeTruthy();
  });

  it('should render the settings-menu', async () => {
    const status = {
      ...controls.status,
      openedSettingsMenu: true,
    };
    expect(settingsMenu.shadowRoot.querySelector('.settings-menu')).toBeTruthy();
    expect(settingsMenu.shadowRoot.querySelector('.settings-menu.menu--open')).not.toBeTruthy();
    expect(shadowRoot.querySelector('.controls__settings-icon')).not.toHaveClass('controls__settings-icon--open');
    let button = shadowRoot.querySelector('.controls__settings-icon').parentNode;
    expect(button).toBeTruthy();
    button.click();
    controls.status = status;
    await page.waitForChanges();
    expect(shadowRoot.querySelector('.controls__settings-icon')).toHaveClass('controls__settings-icon--open');
    expect(settingsMenu.shadowRoot.querySelector('.settings-menu.menu--open')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('should show a list of texttracks', async () =>{
    const de: WebVTT = {
      meta: {
        language: 'de',
        label: 'Deutsch',
      },
      cues: [{
        end: 1,
        identifier: '1',
        start:1,
        styles: '',
        text: 'test',
      }],
      strict: true,
      valid: true,
    };
    const status = {
      ...controls.status,
      subtitle: {
        ...controls.status.subtitle,
        enabled: true,
        language: 'de',
      },
      settings: {
        ...controls.status.settings,
        textTrack: 'de',
      }
    };
    expect(shadowRoot.querySelector('.controls__subtitle-icon')).not.toBeTruthy();
    let textTrackValue = settingsMenu.shadowRoot.querySelector('.settings-menu__button-value').firstChild;
    expect(textTrackValue.nodeValue.trim()).toBe('Off');
    expect(settingsMenu.status.settings.textTrack).toBe('off');
    expect(textTrack.getTextTracks()).toBe(null);
    textTrack.addWebVTT(de);
    await page.waitForChanges();
    expect(textTrack.getTextTracks().length).toBe(1);
    controls.status = status;
    await page.waitForChanges();
    expect(shadowRoot.querySelector('.controls__subtitle-button').querySelector('.controls__shortcut-icon')).toBeTruthy();
    expect(shadowRoot.querySelector('.controls__subtitle-button').querySelector('.controls__shortcut-icon')).toHaveClass('controls__shortcut-icon--active');
    expect(settingsMenu.status.settings.textTrack).toBe('de');
    // must reselect it for testing !
    textTrackValue = settingsMenu.shadowRoot.querySelector('.settings-menu__button-value').firstChild;
    expect(textTrackValue.nodeValue.trim()).toBe('Deutsch');
    const subtitleSubmenubutton = settingsMenu.shadowRoot.querySelector('.settings-menu__button').firstChild;
    subtitleSubmenubutton.click();
    await page.waitForChanges();
    const submenu = settingsMenu.shadowRoot.querySelector('.settings-menu__submenu-content');
    expect(submenu.querySelector('.settings-menu__button')).toBeTruthy();
    expect(submenu.childNodes.length).toBe(2);
    expect(textTrack.getTextTrackValues().length).toBe(2);
    expect(page.root).toMatchSnapshot();
  });

});
