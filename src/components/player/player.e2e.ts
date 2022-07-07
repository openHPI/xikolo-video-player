import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';
import { getControlsElement } from '../../utils/testing-helpers';

describe('xm-player', () => {
  let page: E2EPage;
  let player: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
      <xm-player lang="en">
        <div name="ref"></div>
        <xm-presentation reference="ref" name="single" label="Generic stream"></xm-presentation>
      </xm-player>
    `);
    player = await page.find('xm-player');
  });

  test('should render', async () => {
    expect(player).toHaveClass('hydrated');
  });

  test('should render controls', async () => {
    const controls = player.shadowRoot.querySelector('xm-controls');
    expect(controls).not.toBeNull();
    expect(controls).toHaveClass('hydrated');
  });

  test('should fire play event', async () => {
    const playEvent = await player.spyOnEvent('control:play');

    const playButton: ElementHandle = await getControlsElement(
      page,
      '[aria-label="Play"]'
    );

    expect(playButton).toBeTruthy();

    await playButton.click();
    await page.waitForChanges();

    expect(playEvent).toHaveReceivedEvent();
  });

  test('should fire pause event if it was playing before', async () => {
    const pauseEvent = await player.spyOnEvent('control:pause');

    const playButton: ElementHandle = await getControlsElement(
      page,
      '[aria-label="Play"]'
    );

    expect(playButton).toBeTruthy();

    await playButton.click();
    await page.waitForChanges();

    const pauseButton: ElementHandle = await getControlsElement(
      page,
      '[aria-label="Pause"]'
    );

    await pauseButton.click();
    await page.waitForChanges();

    expect(pauseEvent).toHaveReceivedEvent();
  });

  it.todo('should fire seek event');
});

describe('xm-player with xm-presentation', () => {
  describe('configured as single stream', () => {
    let page: E2EPage;
    let player: E2EElement;

    beforeEach(async () => {
      page = await newE2EPage({
        html: `
      <xm-player>
        <div name="ref1"></div>
        <div name="ref2"></div>
        <div name="ref3"></div>
        <xm-presentation reference="ref1" name="single" label="Generic stream"></xm-presentation>
      </xm-player>
    `,
      });
      player = await page.find('xm-player');
    });

    it('should only flag one reference as active as single stream', async () => {
      const activeItems = await player.findAll('[name="ref1"][active="true"]');
      expect(activeItems.length).toBe(1);
    });

    test('should not render a resizable screen', async () => {
      const screen = player.shadowRoot.querySelector('xm-screen');
      expect(screen).toBeNull();
    });
  });

  describe('configured as dual stream', () => {
    let page: E2EPage;
    let player: E2EElement;

    beforeEach(async () => {
      page = await newE2EPage({
        html: `
      <xm-player>
        <div name="ref1"></div>
        <div name="ref2"></div>
        <div name="ref3"></div>
        <xm-presentation reference="ref1,ref2" name="dual" label="Generic stream"></xm-presentation>
      </xm-player>
    `,
      });
      player = await page.find('xm-player');
    });

    it('should flag two references as active in dual stream mode', async () => {
      const activeItems = await player.findAll('[active="true"]');
      expect(activeItems.length).toBe(2);
    });

    test('should render a resizable screen', async () => {
      const resizableScreen = player.shadowRoot.querySelector('xm-screen');
      expect(resizableScreen).toBeTruthy();
    });
  });
});
