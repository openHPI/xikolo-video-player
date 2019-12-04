import { newSpecPage } from "@stencil/core/testing";
import { Player } from './player';
import { Controls } from '../controls/controls';
import { defaultStatus } from '../../utils/status';

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
      <xm-player volume="0.3" lang="en">
        <xm-video slot="primary" src="340196868"></xm-video>
        <xm-video slot="secondary" src="340196788"></xm-video>
      </xm-player>
    `,
      components: [Player, Controls],
      supportShadowDom: true
    });
    // We need to render all child components manually for acces to their shadow doms!
    controls =  page.root.shadowRoot.querySelector('xm-controls');
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
    expect(page.root.getAttribute('volume')).toBe('0.3');
    page.rootInstance.volume = 0;
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
