import { FunctionalComponent, h } from '@stencil/core';

import { SettingsSubmenuStatus, Setting } from '../../utils/settings';
import * as icon from '../../utils/icon';

interface SubmenuProps {
  status: SettingsSubmenuStatus;
  onChangeSetting: (e: Event) => void;
  onCloseSubmenu: (e: Event) => void;
}

export const Submenu: FunctionalComponent<SubmenuProps> = (props) => {
  const setting = props.status.currentSetting;
  if (setting) {
    return (
      <div
        class={
          props.status.isOpen
            ? 'settings-menu__submenu menu menu--open'
            : 'settings-menu__submenu menu hide'
        }
      >
        <div class="settings-menu__submenu-header">
          <button
            class="settings-menu__button"
            onClick={props.onCloseSubmenu}
            aria-label={setting.label}
          >
            <span class="settings-menu__arrow settings-menu__arrow--left">
              <span class="svg" innerHTML={icon.ArrowLeft} />
            </span>
            <span
              class="settings-menu__button-label"
              innerHTML={setting.label}
            />
          </button>
        </div>
        <div class="settings-menu__submenu-content">
          {setting.values.map((value, index) => (
            <button
              class={
                value === setting.currentValue
                  ? 'settings-menu__button settings-menu__button--current'
                  : 'settings-menu__button'
              }
              onClick={() => props.onChangeSetting(value)}
              aria-label={
                setting.valueLabels?.[index]
                  ? setting.valueLabels[index]
                  : value
              }
              innerHTML={
                setting.valueLabels?.[index]
                  ? setting.valueLabels[index]
                  : value
              }
            />
          ))}
        </div>
      </div>
    );
  }
};

interface SubmenuToggleButtonProps {
  status: SettingsSubmenuStatus;
  setting: Setting<any>;
  onOpenSubmenu: (e: Event) => void;
  onCloseSubmenu: (e: Event) => void;
}

export const SubmenuToggleButton: FunctionalComponent<
  SubmenuToggleButtonProps
> = (props) => (
  <button
    class="settings-menu__button"
    aria-label={props.setting.label}
    onClick={props.status.isOpen ? props.onCloseSubmenu : props.onOpenSubmenu}
  >
    <span class="settings-menu__button-label">{props.setting.label} </span>
    <span class="settings-menu__button-value">
      {' '}
      {props.setting.valueLabels
        ? props.setting.valueLabels[
            props.setting.values.findIndex(
              (value) => props.setting.currentValue === value
            )
          ]
        : props.setting.currentValue}
    </span>
    <span class="settings-menu__arrow settings-menu__arrow--right">
      <span class="svg" innerHTML={icon.ArrowRight} />
    </span>
  </button>
);
