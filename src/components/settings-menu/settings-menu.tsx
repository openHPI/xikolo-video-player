import {
  Component,
  Element,
  h,
  Prop,
  State,
  EventEmitter,
  Event,
  Watch,
} from '@stencil/core';

import { Submenu, SubmenuToggleButton } from './elements';
import { Status } from '../../utils/status';
import {
  SettingsSubmenuStatus,
  defaultSettingsSubmenuStatus,
  SettingNames,
  settingList,
} from '../../utils/settings';
import { bind } from '../../utils/bind';
import { TextTrackList } from '../../utils/webVTT';
import locales from '../../utils/locales';

@Component({
  tag: 'xm-settings-menu',
  styleUrl: 'settings-menu.scss',
  shadow: true,
})
export class SettingsMenu {
  @Element() el: HTMLXmSettingsMenuElement;

  @Prop({ mutable: true }) status: Status;
  @Prop({ mutable: true }) textTracks: TextTrackList;

  @State()
  private submenuStatus: SettingsSubmenuStatus = defaultSettingsSubmenuStatus;

  @Event({ eventName: 'setting:changePlaybackRate' })
  changePlaybackRateEvent: EventEmitter;
  @Event({ eventName: 'setting:changeTextTrack' })
  changeTextTrackEvent: EventEmitter;

  public render() {
    let classes = 'settings-menu menu';
    if (this.status.fullscreen) {
      classes += ' settings-menu--fullscreen-mode';
    }
    if (this.status.openedSettingsMenu) {
      classes += ' menu--open';
    }
    return (
      <div
        class={classes}
        onClick={(e) => e.stopPropagation()}
        data-test-id="settingsMenu"
        role="menu"
        tabindex="0"
      >
        <Submenu
          status={this.submenuStatus}
          onChangeSetting={this._setSetting}
          onCloseSubmenu={this._onCloseSubmenu}
        />
        <div
          class={
            this.submenuStatus.isOpen
              ? 'settings-menu__content hide'
              : 'settings-menu__content show'
          }
        >
          <SubmenuToggleButton
            status={this.submenuStatus}
            setting={this._getSetting(SettingNames.TEXTTRACK)}
            onOpenSubmenu={() => this._onOpenSubmenu(SettingNames.TEXTTRACK)}
            onCloseSubmenu={this._onCloseSubmenu}
          />
          <SubmenuToggleButton
            status={this.submenuStatus}
            setting={this._getSetting(SettingNames.PLAYBACKRATE)}
            onOpenSubmenu={() => this._onOpenSubmenu(SettingNames.PLAYBACKRATE)}
            onCloseSubmenu={this._onCloseSubmenu}
          />
        </div>
      </div>
    );
  }

  @bind()
  private _getSetting(settingName: string) {
    let setting = settingList.find((setting) => setting.name === settingName);
    setting.currentValue = this.status.settings[settingName];
    setting.label = locales[this.status.language][settingName];
    if (settingName === SettingNames.TEXTTRACK) {
      setting.values = this.textTracks.getTextTrackValues();
      setting.valueLabels = this.textTracks.getTextTrackLabels(
        this.status.language
      );
    }
    return setting;
  }

  @bind()
  private _onOpenSubmenu(settingName: string) {
    this.submenuStatus = {
      isOpen: true,
      currentSetting: this._getSetting(settingName),
    };
  }

  @bind()
  private _onCloseSubmenu() {
    this.submenuStatus = {
      ...this.submenuStatus,
      isOpen: false,
    };
  }

  @Watch('status')
  protected _checkSettingsMenuOpenningState(newState, oldState) {
    if (!newState.openedSettingsMenu) {
      this._onCloseSubmenu();
    }
  }

  @bind()
  private _setSetting(value: any) {
    switch (this.submenuStatus.currentSetting.name) {
      case SettingNames.PLAYBACKRATE:
        this._setPlaybackRate(value);
        break;
      case SettingNames.TEXTTRACK:
        this._setTextTrack(value);
        break;
    }
    this._onCloseSubmenu();
  }

  @bind()
  private _setPlaybackRate(playbackRate: number) {
    this.changePlaybackRateEvent.emit({ playbackRate: playbackRate });
  }

  @bind()
  private _setTextTrack(textTrack: string) {
    this.changeTextTrackEvent.emit({ textTrack: textTrack });
  }
}
