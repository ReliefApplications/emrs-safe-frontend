import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import { fromEvent, merge, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { KtdGridComponent, KtdGridLayout, KtdGridLayoutItem, ktdTrackById } from '@katoid/angular-grid-layout';

@Component({
  selector: 'safe-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss']
})
export class SafeWidgetGridComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() widgets: any[] = [];
  @Input() canUpdate = false;

  // === EVENT EMITTER ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() addNewWidget: EventEmitter<any> = new EventEmitter();

  @ViewChild(KtdGridComponent, { static: true })

  // === DECALRE PARAMETERS OF THE GRID ===
  grid!: KtdGridComponent;
  trackById = ktdTrackById;
  cols = 8;
  phoneView = false;
  rowHeight = 75;
  compactType: 'vertical' | 'horizontal' | null = 'vertical';
  layout: KtdGridLayout = [];
  currentTransition = 'transform 500ms ease, width 500ms ease, height 500ms ease';
  dragStartThreshold = 0;
  disableDrag = true;
  disableResize = true;
  autoResize = true;
  resizeSubscription: Subscription = new Subscription();

  canModify = false;
  copyWidgets = [] as any;

  constructor(private ngZone: NgZone, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.layout = this.gridInitialisation(this.widgets);

    // Listen resize
    this.resizeSubscription = merge(
      fromEvent(window, 'resize'),
      fromEvent(window, 'orientationchange')
    ).pipe(
      debounceTime(50),
      filter(() => this.autoResize)
    ).subscribe(() => {
      this.grid.resize();
    });

    this.canModify = this.canUpdate;
    if ( this.canModify ) {
      this.disableResize = false;
    }
  }

  /*  Resize grid now and after 1 sec to adapt widgets to grid
  */
  ngAfterViewInit(): void {
    console.log('loaded');
    setTimeout(() => {  this.grid.resize(); }, 1000);
    this.grid.resize();
  }

  /* Check if a widget is in good format for the grid layout
  */
  transformItemIf(item: any): any {
    if ( item.hasOwnProperty('x') && item.hasOwnProperty('y') && item.hasOwnProperty('h') && item.hasOwnProperty('w') ) {
      return {
        ...item,
        id: String(item.id)
      };
    }
    else {
      return {
        ...item,
        x: 0,
        y: 0,
        w: item.defaultCols,
        h: item.defaultRows,
        id: String(item.id)
      };
    }
  }

  /*  Change display when windows size changes.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.setPhoneView(event.target.innerWidth);
  }

  private setPhoneView(width: number): void {
    if (width <= 800) {
      if (!this.phoneView){
        this.cols = 1;
        this.layout = this.reloadGrid(this.layout);
        this.phoneView = true;
        this.disableResize = true;
        this.disableDrag = true;
      }
    }
    else {
      if (this.phoneView){
        this.cols = 8;
        this.phoneView = false;
        this.layout = this.gridInitialisation(this.widgets);
        if ( this.canModify ) {
          this.disableResize = false;
        }
        this.disableDrag = true;
      }
    }
  }

  /* Reload the display of the grid for the phone display
  */
  reloadGrid(mygrid: any): any[] {
    const arrayCopy = [...mygrid];
    arrayCopy.forEach( (element: any) => {
      element.x = 0;
      element.y = 0;
      element.w = 1;
      element.h = 6;
    });
    return arrayCopy;
  }

  /* Initiate the grid from the DB
  */
  gridInitialisation(data: any): any[] {
    return data.map( (item: any) => (
      this.transformItemIf(item)
    ));
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  /* Update of the grid when a widget is moved or resized
  */
  onLayoutUpdated(layout: KtdGridLayout): void {
    this.layout = this.getNewLayout(layout);
    this.savePosition();
  }

  /* Create a new widget with combination of the widget object and his size
  */
  getNewLayout(newArray: any): any[] {
    const newCopy: any[] = [];
    let i = 0;
    newArray.forEach( (element: any) => {
      newCopy.push({
        ...this.layout[i],
        ...element
      });
      i += 1;
    });
    return newCopy;
  }

  /* Save all the grid in DB
  */
  savePosition(): void {
    this.update.emit(this.layout);
  }

  onEditWidget(e: any): void {
    this.edit.emit(e);
  }

  onDeleteWidget(e: any): void {
    this.delete.emit({id: e.id});
    this.removeItem(e.id);
  }

  /* Removes the item from the layout
  */
  removeItem(id: any): void {
    // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
    this.layout = this.ktdArrayRemoveItem(this.layout, (item: any) => item.id === id);
  }

  ktdArrayRemoveItem<T>(array: T[], condition: (item: T) => boolean): any[] {
    const arrayCopy = [...array];
    const index = array.findIndex((item) => condition(item));
    if (index > -1) {
        arrayCopy.splice(index, 1);
    }
    return arrayCopy;
  }

  /* Expand widget in full screen
  */
  onExpandWidget(e: any): void {
    const widget = this.widgets.find(x => x.id === e.id);
    const dialogRef = this.dialog.open(SafeExpandedWidgetComponent, {
      data: {
        widget
      },
      autoFocus: false,
      position: {
        bottom: '0',
        right: '0'
      },
      panelClass: 'expanded-widget-dialog'
    });
    dialogRef.componentInstance.goToNextStep.subscribe((event: any) => {
      this.goToNextStep.emit(event);
      dialogRef.close();
    });
  }

  onDisableDragChange(checked: boolean): void {
    this.disableDrag = checked;
  }

  /* Adds a grid item to the layout
  */
  addItemToLayout(newWidget: any): void {
    const maxId = this.layout.reduce( (acc: any, cur: any) => Math.max(acc, parseInt(cur.id, 10)), -1);
    const nextId = maxId + 1;
    const maxY = this.layout.reduce( (acc: any, cur: any) => Math.max(acc, parseInt(cur.y, 10)), -1);
    let newLayoutItem: KtdGridLayoutItem = {
      id: nextId.toString(),
      x: 0,
      y: maxY + 1,
      w: newWidget.defaultCols,
      h: newWidget.defaultRows * 2
    };
    newLayoutItem = {
      ...newLayoutItem,
      ...newWidget
    };
    // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
    this.addNewWidget.emit(newLayoutItem);
    if (!this.phoneView) {
      this.layout = [
        newLayoutItem,
        ...this.layout
      ];
    }
    // Diferant display size of new widget for phone screen but no differance in DB
    else {
      newLayoutItem.w = 1;
      newLayoutItem.h = 6;
      this.layout = [
        newLayoutItem,
        ...this.layout
      ];
    }
  }
}
