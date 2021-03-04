import { Component, OnInit, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditorComponent } from '@progress/kendo-angular-editor';

@Component({
  selector: 'who-editor-settings',
  templateUrl: './editor-settings.component.html',
  styleUrls: ['./editor-settings.component.scss']
})
/*  Modal content for the settings of the editor widgets.
*/
export class WhoEditorSettingsComponent implements OnInit, AfterViewInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === TEMPLATE REFERENCE TO THE KENDO EDITOR ===
  @ViewChild('editor') public editor: EditorComponent;

  public data: Array<any> = [{
    text: 'Variable 1',
    icon: 'paste',
    click: () => { this.editor.exec('insertText', '<p>Variable 1</p>'); }
  }, {
    text: 'Variable 2',
    icon: 'paste',
    click: () => { this.editor.exec('insertText', '<p>Variable 2</p>'); }
  }];

  constructor(private formBuilder: FormBuilder) { }

  /*  Build the settings form, using the widget saved parameters.
  */
  ngOnInit(): void {
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: this.tile.settings.title,
      text: this.tile.settings.text
    });
    this.change.emit(this.tileForm);
  }

  /*  Detect the form changes to emit the new configuration.
  */
  ngAfterViewInit(): void {
    this.tileForm.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });
  }

  /*  Update the text of the editor.
  */
  updateText(): void {
    this.tileForm.setValue({ ...this.tileForm.value, text: this.editor.value });
  }

}
