import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
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

    const playButton = await getControlsElement(page, '[aria-label="Play"]');

    expect(playButton).toBeTruthy();

    await playButton.click();
    await page.waitForChanges();

    expect(playEvent).toHaveReceivedEvent();
  });

  test('should handle external play event', async () => {
    const externalPlayEvent = await player.spyOnEvent('play');

    await page.evaluate(() => {
      const playerEl = document.querySelector('xm-player');
      const event = new CustomEvent('play');
      playerEl?.dispatchEvent(event);
    });
    await page.waitForChanges();

    expect(externalPlayEvent).toHaveReceivedEvent();
  });

  test('should fire pause event if it was playing before', async () => {
    const pauseEvent = await player.spyOnEvent('control:pause');

    const playButton = await getControlsElement(page, '[aria-label="Play"]');

    expect(playButton).toBeTruthy();

    await playButton.click();
    await page.waitForChanges();

    const pauseButton = await getControlsElement(page, '[aria-label="Pause"]');

    await pauseButton.click();
    await page.waitForChanges();

    expect(pauseEvent).toHaveReceivedEvent();
  });

  test('should handle external pause event', async () => {
    const externalPauseEvent = await player.spyOnEvent('pause');

    await page.evaluate(() => {
      const playerEl = document.querySelector('xm-player');
      const event = new CustomEvent('pause');
      playerEl?.dispatchEvent(event);
    });
    await page.waitForChanges();

    expect(externalPauseEvent).toHaveReceivedEvent();
  });
});

it.todo('should fire seek event');

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

describe('xm-player with toggle control', () => {
  it('can trigger an external function', async () => {
    const page = await newE2EPage({
      html: `
    <xm-player>
      <div name="ref"></div>
      <xm-presentation reference="ref" name="single" label="Generic stream"></xm-presentation>

      <xm-toggle-control
      slot="toggleControl"
      name="toggleControl"
      title="Custom Control"
    >
      <svg slot="icon" viewBox="0 0 32 32" role="presentation" focusable="false">
        <path
          d="M0 2h32v4h-32zM0 8h20v4h-20zM0 20h20v4h-20zM0 14h32v4h-32zM0 26h32v4h-32z"
        ></path>
      </svg>
    </xm-toggle-control>
    </xm-player>

    <div id="customControlledElement">This is a text</div>
  `,
    });

    const player = await page.find('xm-player');
    const customControlledElement = await page.find('#customControlledElement');
    const toggleEvent = await player.spyOnEvent(
      'control:changeToggleControlActiveState',
    );

    const toggleButton = await getControlsElement(
      page,
      'button[title="Custom Control"]',
    );

    // Attach external function to player which listens to toggle control event
    await page.evaluate(() => {
      const playerEl = document.querySelector('xm-player');
      playerEl.addEventListener(
        'control:changeToggleControlActiveState',
        (event: any) => {
          if (event.detail.name === 'toggleControl') {
            customControlledElement.innerHTML = `The feature is ${
              event.detail.active ? 'enabled' : 'disabled'
            }`;
          }
        },
      );
    });

    // Click on button inside of player to activate and deactivate feature

    await toggleButton.click();
    await page.waitForChanges();
    let text = customControlledElement.innerHTML;

    expect(text).toBe('The feature is enabled');
    expect(toggleEvent).toHaveReceivedEventTimes(1);

    await toggleButton.click();
    await page.waitForChanges();
    text = customControlledElement.innerHTML;

    expect(text).toBe('The feature is disabled');
    expect(toggleEvent).toHaveReceivedEventTimes(2);
  });
});
