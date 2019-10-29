import { Component, Element, h, Prop, State, EventEmitter, Event } from '@stencil/core';

import { Submenu, SubmenuToggleButton } from './elements';
import { Status } from '../../utils/status';
import { SettingsSubmenuStatus, defaultSettingsSubmenuStatus, SettingNames, settingList } from '../../utils/settings';
import { bind } from '../../utils/bind';

@Component({
  tag: 'xm-settings-menu',
  styleUrl: 'settings-menu.scss',
  shadow: true
})
export class SettingsMenu {
  @Element() el: HTMLXmSettingsMenuElement;

  @Prop() status: Status;
  @Prop() isOpen: boolean;

  @State()
  private submenuStatus: SettingsSubmenuStatus = defaultSettingsSubmenuStatus;

  @Event({eventName: 'setting:changePlaybackRate'}) changePlaybackRateEvent: EventEmitter;

  public render() {
    return (
      <div class={this.isOpen ? "settings-menu menu menu--open" : "settings-menu menu"}>
          <Submenu
            status={this.submenuStatus}
            onChangeSetting={this._setSetting}
            onCloseSubmenu={this._onCloseSubmenu}
          />
          <div class={this.submenuStatus.isOpen ? "settings-menu__content hide": "settings-menu__content show"}>
            <SubmenuToggleButton
              status={this.submenuStatus}
              setting={this._getSetting(SettingNames.PLAYBACKRATE)}
              onOpenSubmenu={()=>this._onOpenSubmenu(SettingNames.PLAYBACKRATE)}
              onCloseSubmenu={this._onCloseSubmenu}
            />
          </div>
      </div>
    );
  }

  @bind()
  private _getSetting(settingName:string) {
    let setting = settingList.find(setting => setting.name === settingName);
    setting.currentValue = this.status.settings[settingName];
    return setting;
  }

  @bind()
  private _onOpenSubmenu(settingName:string) {
    this.submenuStatus = {
      isOpen: true,
      currentSetting: this._getSetting(settingName)
    };
  }

  @bind()
  private _onCloseSubmenu() {
    this.submenuStatus = {
      ...this.submenuStatus,
      isOpen: false
    };
  }

  @bind()
  private _setSetting(value: any) {
    switch(this.submenuStatus.currentSetting.name) {
      case SettingNames.PLAYBACKRATE: this._setPlaybackRate(value); break;
    }
    this._onCloseSubmenu();
  }

  @bind()
  private _setPlaybackRate(playbackRate: number) {
    this.changePlaybackRateEvent.emit({playbackRate: playbackRate});
  }
}
