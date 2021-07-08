import { E2EPage } from '@stencil/core/testing';
import { ElementHandle } from 'puppeteer';

/**
 * Testing Helper Functions
 *
 * For the moment, these functions replaces the piercing selector for getting elements from the shadowRoot
 * from child components.
 *
 * Because there is a bug in the puppeteer page.find() function with multiple piercing selectors.
 * If it is used to find elements under more than one layer of shadowRoots, it returns the first shadowRoot.
 *
 * E.g. await page.find('xm-player >>> xm-controls >>> xm-settings-menu') returns the xm-control
 *
 * There is a workaround:
 * https://github.com/Esri/calcite-components/pull/1103
 */

export async function getSettingsMenuElement(
  page: E2EPage,
  selector: string
): Promise<ElementHandle> {
  return (
    await page.waitForFunction(
      (selector: string) => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector('xm-settings-menu')
          .shadowRoot.querySelector(selector);
      },
      {},
      [selector]
    )
  ).asElement();
}

export async function getControlsElement(
  page: E2EPage,
  selector: string
): Promise<ElementHandle> {
  return (
    await page.waitForFunction(
      (selector: string) => {
        return document
          .querySelector('xm-player')
          .shadowRoot.querySelector('xm-controls')
          .shadowRoot.querySelector(selector);
      },
      {},
      [selector]
    )
  ).asElement();
}
