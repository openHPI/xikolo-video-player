import { FunctionalComponent, h } from '@stencil/core';

import { SettingsSubmenuStatus, Setting } from '../../utils/settings';
import * as icon from '../../utils/icon';

interface SubmenuProps {
  status: SettingsSubmenuStatus;
  onChangeSetting: (e: Event) => void;
  onCloseSubmenu: (e: Event) => void;
}

export const Submenu: FunctionalComponent<SubmenuProps> = props => {
  if(props.status.currentSetting) {
    return (
      <div class={props.status.isOpen ? "settings-menu__submenu menu menu--open" : "settings-menu__submenu menu hide"}>
        <div class="settings-menu__submenu-header">
          <button class="settings-menu__button" onClick={props.onCloseSubmenu}>
            <span class="settings-menu__arrow settings-menu__arrow--left" innerHTML={icon.ArrowLeft} />
            <span class="settings-menu__button-label" innerHTML={props.status.currentSetting.label} />
            <span class="settings-menu__button-value" innerHTML={props.status.currentSetting.currentValue} />
          </button>
        </div>
        <div class="settings-menu__submenu-content">
          { props.status.currentSetting.values.map((value) => (
            <button
              class={value === props.status.currentSetting.currentValue ? "settings-menu__button settings-menu__button--current" : 'settings-menu__button'}
              onClick={()=>props.onChangeSetting(value)} innerHTML={value}
            />
          )) }
        </div>
      </div>
    );
  }
}

interface SubmenuToggleButtonProps {
  status: SettingsSubmenuStatus;
  setting: Setting;
  onOpenSubmenu: (e: Event) => void;
  onCloseSubmenu: (e: Event) => void;
}

export const SubmenuToggleButton: FunctionalComponent<SubmenuToggleButtonProps> = props => {
  return (
    <button class="settings-menu__button" onClick={props.status.isOpen ? props.onCloseSubmenu : props.onOpenSubmenu}>
      <span class="settings-menu__button-label" innerHTML={props.setting.label} />
      <span class="settings-menu__button-value" innerHTML={props.setting.currentValue} />
      <span class="settings-menu__arrow settings-menu__arrow--right" innerHTML={icon.ArrowRight} />
    </button>
  )
}
