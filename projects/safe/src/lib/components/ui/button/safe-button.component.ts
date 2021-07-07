import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

export class ButtonType {
  static BASIC = 'mat-button';
  static RAISED = 'mat-raised-button';
  static STROKED = 'mat-stroked-button';
  static FLAT = 'mat-flat-button';
  static ICON = 'mat-icon-button';
  static FAB = 'mat-fab';
  static MINI_FAB = 'mat-mini-fab';
  static MENU_ITEM = 'mat-menu-item';
}

@Component({
  selector: 'safe-button',
  templateUrl: './safe-button.component.html',
  styleUrls: ['./safe-button.component.css']
})
export class SafeButtonComponent implements OnInit {

  @Input()
  text?: string;

  @Input()
  color?: ThemePalette;

  @Input()
  disableRipple = false;

  @Input()
  disabled = false;

  @Input()
  buttonType: ButtonType = ButtonType.BASIC;

  @Input()
  icon?: string;

  @Input()
  customClass?: string;

  constructor() {
  }

  ngOnInit(): void {
    this.assertButton();
  }

  private assertButton(): void {
    if ((this.buttonType === ButtonType.ICON ||
      this.buttonType === ButtonType.FAB || this.buttonType === ButtonType.MINI_FAB) && !this.icon) {
      throw(new Error('Required input [icon] not provided.'));
    }
  }

}
