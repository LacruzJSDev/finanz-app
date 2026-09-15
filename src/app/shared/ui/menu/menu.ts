import { Component, Directive } from '@angular/core';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-menu',
  hostDirectives: [CdkMenu],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class AppMenu {}

@Directive({
  selector: '[appMenuTriggerFor]',
  hostDirectives: [{ directive: CdkMenuTrigger, inputs: ['cdkMenuTriggerFor: appMenuTriggerFor'] }],
})
export class AppMenuTrigger {}

@Component({
  selector: 'button[appMenuItem]',
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss',
  host: { type: 'button' },
})
export class AppMenuItem {}
