import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WhoTileDisplayComponent } from './menu/tile-display/tile-display.component';
import { WhoTileDataComponent } from './menu/tile-data/tile-data.component';
import { WhoGridService } from '../../../services/grid.service';

@Component({
  selector: 'who-floating-options',
  templateUrl: './floating-options.component.html',
  styleUrls: ['./floating-options.component.scss']
})
/*  Button on top left of each widget, if user can see it, with menu of possible actions for that widget.
*/
export class WhoFloatingOptionsComponent implements OnInit {

  // === WIDGET ===
  @Input() widget: any;

  // === EMIT ACTION SELECTED ===
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();

  // === AVAILABLE ACTIONS ===
  public items: any[];

  constructor(
    public dialog: MatDialog,
    private gridService: WhoGridService
  ) { }

  /*  Set the list of available actions.
  */
  ngOnInit(): void {
    this.items = [
      {
        name: 'Display',
        icon: 'settings'
      },
      {
        name: 'Settings',
        icon: 'insert_chart',
        disabled: !this.widget || !this.widget.settings
      },
      {
        name: 'Delete',
        icon: 'delete'
      }
    ];
  }

  /*  Open a modal, or emit an event depending on the action clicked.
  */
  onClick(item: any): void {
    if (item.name === 'Display') {
      const dialogRef = this.dialog.open(WhoTileDisplayComponent, {
        data: {
          tile: this.widget
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        this.edit.emit({ type: 'display', id: this.widget.id, options: res});
      });
    }
    if (item.name === 'Settings') {
      const dialogRef = this.dialog.open(WhoTileDataComponent, {
        data: {
          tile: this.widget,
          template: this.gridService.findSettingsTemplate(this.widget)
        },
        // hasBackdrop: false,
        position: {
          bottom: '0',
          right: '0'
        },
        panelClass: 'tile-settings-dialog'
      });
      dialogRef.afterClosed().subscribe(res => {
        this.edit.emit({ type: 'data', id: this.widget.id, options: res });
      });
    }
    if (item.name === 'Delete') {
      this.delete.emit({id: this.widget.id});
    }
  }
}
