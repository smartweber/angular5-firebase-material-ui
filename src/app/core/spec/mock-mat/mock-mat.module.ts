import {
  NgModule,
  Component,
  Input,
  Output,
  EventEmitter,
  Directive
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mat-card',
  template: '<p>Mock mat-card Component</p>'
})
export class MockMatCardComponent {
}

@Component({
  selector: 'mat-card-header',
  template: '<p>Mock mat-card-header Component</p>'
})
export class MockMatCardHeaderComponent {
}

@Component({
  selector: 'mat-card-title',
  template: '<p>Mock mat-card-title Component</p>'
})
export class MockMatCardTitleComponent {
}

@Component({
  selector: 'mat-card-subtitle',
  template: '<p>Mock mat-card-subtitle Component</p>'
})
export class MockMatCardSubTitleComponent {
}

@Component({
  selector: 'mat-card-content',
  template: '<p>Mock mat-card-content Component</p>'
})
export class MockMatCardContentComponent {
}

@Component({
  selector: 'mat-spinner',
  template: '<p>Mock mat-spinner Component</p>'
})
export class MockMatSpinnerComponent {
}

@Component({
  selector: 'mat-tab-group',
  template: '<p>Mock mat-tab-group Component</p>'
})
export class MockMatTabGroupComponent {
  @Input() selectedIndex: any;
  @Output() selectedIndexChange = new EventEmitter();
}

@Component({
  selector: 'mat-table',
  template: '<p>Mock mat-table Component</p>'
})
export class MockMatTableComponent {
  @Input() dataSource: any;
}

@Component({
  selector: 'mat-header-cell',
  template: '<p>Mock mat-header-cell Component</p>'
})
export class MockMatHeaderCellComponent {
}

@Component({
  selector: 'mat-cell',
  template: '<p>Mock mat-header-cell Component</p>'
})
export class MockMatCellComponent {
}

@Component({
  selector: 'ng-container',
  template: '<p>Mock ng-container Component</p>'
})
export class MockNgContainerComponent {
}

@Component({
  selector: 'mat-header-row',
  template: '<p>Mock mat-header-row Component</p>'
})
export class MockMatHeaderRowComponent {
}

@Component({
  selector: 'mat-row',
  template: '<p>Mock mat-row Component</p>'
})
export class MockMatRowComponent {
}

@Component({
  selector: 'mat-paginator',
  template: '<p>Mock mat-paginator Component</p>'
})
export class MockMatPaginatorComponent {
  @Input() pageSize: any;
  @Input() pageSizeOptions: any;
}

@Component({
  selector: 'app-config-modal',
  template: '<p>Mock config modal Component</p>'
})
export class MockConfigModalComponent {
}

@Component({
  selector: 'app-confirm-modal',
  template: '<p>Mock confirm modal Component</p>'
})
export class MockConfirmModalComponent {
}

@Component({
  selector: 'mat-form-field',
  template: '<p>Mock mat-form-field Component</p>'
})
export class MockMatFormFieldComponent {
}

@Component({
  selector: 'mat-list-item',
  template: '<p>Mock mat-list-item Component</p>'
})
export class MockMatListItemComponent {
}

@Component({
  selector: 'mat-sidenav-container',
  template: '<p>Mock mat-sidenav-container Component</p>'
})
export class MockMatSidenavContainerComponent {
}

@Component({
  selector: 'mat-sidenav',
  template: '<p>Mock mat-sidenav Component</p>'
})
export class MockMatSidenavComponent {
}

@Component({
  selector: 'mat-nav-list',
  template: '<p>Mock mat-nav-list Component</p>'
})
export class MockMatNavListComponent {
}

@Component({
  selector: 'mat-divider',
  template: '<p>Mock mat-divider Component</p>'
})
export class MockMatDividerComponent {
}

@Component({
  selector: 'mat-sidenav-content',
  template: '<p>Mock mat-sidenav-content Component</p>'
})
export class MockMatSidenavContentComponent {
}

@Component({
  selector: 'mat-card-actions',
  template: '<p>Mock mat-card-actions Component</p>'
})
export class MockMatCardActionsComponent {
}

@Component({
  selector: 'mat-checkbox',
  template: '<p>Mock mat-checkbox Component</p>'
})
export class MockMatCheckComponent {
}

@Component({
  selector: 'mat-input-container',
  template: '<p>Mock mat-input-container Component</p>'
})
export class MockMatInputContainerComponent {
}

@Component({
  selector: 'mat-select',
  template: '<p>Mock mat-select Component</p>'
})
export class MockMatSelectComponent {
  @Input() value: any;
}

@Component({
  selector: 'mat-option',
  template: '<p>Mock mat-option Component</p>'
})
export class MockMatOptionComponent {
  @Input() value: any;
}

@Component({
  selector: 'mat-tab',
  template: '<p>Mock mat-tab Component</p>'
})
export class MockMatTabComponent {
  @Input() value: any;
  @Input() label: any;
}

@Component({
  selector: 'mat-radio-group',
  template: '<p>Mock mat-radio-group Component</p>'
})
export class MockMatRadioComponent {
}

@Component({
  selector: 'mat-radio-button',
  template: '<p>Mock mat-radio-button Component</p>'
})
export class MockMatRadioButtonComponent {
  @Input() value: any;
}

@Component({
  selector: 'mat-icon',
  template: '<p>Mock Mat Icon Component</p>'
})
export class MockMatIconComponent {
}

@Directive({
  selector: '[matHeaderRowDef]',
})

export class MockMatHeaderRowDefDirective {
  @Input() set matHeaderRowDef(context: any) {

  }
}

@Directive({
  selector: '[matRowDefColumns]',
})

export class MockMatRowDefColumnsDirective {
  @Input() set matRowDefColumns(context: any) {

  }
}

@Directive({
  selector: '[matRowDef]',
})

export class MockMockMatRowDefDirective {
  @Input() set matRowDef(context: any) {

  }
}

@Directive({
  selector: '[matTooltip]',
})

export class MockMatTooltipDirective {
  @Input() matTooltip: any;
}

@Directive({
  selector: '[matInput]',
})

export class MockMatInputDirective {
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MockConfigModalComponent,
    MockConfirmModalComponent,
    MockMatCardComponent,
    MockMatCardTitleComponent,
    MockMatCardSubTitleComponent,
    MockMatCardContentComponent,
    MockMatSpinnerComponent,
    MockMatTabGroupComponent,
    MockMatTabComponent,
    MockMatTableComponent,
    MockMatHeaderCellComponent,
    MockMatCellComponent,
    MockNgContainerComponent,
    MockMatHeaderRowComponent,
    MockMatRowComponent,
    MockMatPaginatorComponent,
    MockMatFormFieldComponent,
    MockMatListItemComponent,
    MockMatSidenavContainerComponent,
    MockMatSidenavComponent,
    MockMatNavListComponent,
    MockMatDividerComponent,
    MockMatSidenavContentComponent,
    MockMatCheckComponent,
    MockMatCardActionsComponent,
    MockMatInputContainerComponent,
    MockMatSelectComponent,
    MockMatOptionComponent,
    MockMatRadioComponent,
    MockMatRadioButtonComponent,
    MockMatIconComponent,
    MockMatCardHeaderComponent,
    MockMatHeaderRowDefDirective,
    MockMockMatRowDefDirective,
    MockMatRowDefColumnsDirective,
    MockMatTooltipDirective,
    MockMatInputDirective
  ],
  exports: [
    MockConfigModalComponent,
    MockConfirmModalComponent,
    MockMatCardComponent,
    MockMatCardTitleComponent,
    MockMatCardSubTitleComponent,
    MockMatCardContentComponent,
    MockMatSpinnerComponent,
    MockMatTabGroupComponent,
    MockMatTabComponent,
    MockMatTableComponent,
    MockMatHeaderCellComponent,
    MockMatCellComponent,
    MockNgContainerComponent,
    MockMatHeaderRowComponent,
    MockMatRowComponent,
    MockMatPaginatorComponent,
    MockMatFormFieldComponent,
    MockMatListItemComponent,
    MockMatSidenavContainerComponent,
    MockMatSidenavComponent,
    MockMatNavListComponent,
    MockMatDividerComponent,
    MockMatSidenavContentComponent,
    MockMatCheckComponent,
    MockMatCardActionsComponent,
    MockMatInputContainerComponent,
    MockMatSelectComponent,
    MockMatOptionComponent,
    MockMatRadioComponent,
    MockMatRadioButtonComponent,
    MockMatIconComponent,
    MockMatCardHeaderComponent,
    MockMatHeaderRowDefDirective,
    MockMockMatRowDefDirective,
    MockMatRowDefColumnsDirective,
    MockMatTooltipDirective,
    MockMatInputDirective
  ]
})
export class MockMatModule { }
