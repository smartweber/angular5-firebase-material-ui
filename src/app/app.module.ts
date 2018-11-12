import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/core';
import { global_variables } from '../environments/global_variables';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpModule } from '@angular/http';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatCardModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSidenavModule,
  MatListModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule,
  MatRadioModule,
  MatProgressBarModule
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';
import '../polyfills';

import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { PurehttpService } from './services/purehttp.service';
import { DataService } from './services/data.service';
import { EventService } from './services/event.service';
import { NotificationService } from './services/notification.service';
import { AuthguardService } from './services/authguard.service';
import { SpinnerService } from './components/spinner/spinner.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { UserModalComponent } from './modals/user-modal/user-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerMapComponent } from './customer/customer-map/customer-map.component';
import { CustomerTopbarComponent } from './customer/customer-topbar/customer-topbar.component';
import { ZoneComponent } from './zone/zone.component';
import { ZoneDetailComponent } from './zone/zone-detail/zone-detail.component';
import { ZoneListComponent } from './zone/zone-list/zone-list.component';
import { ZoneMapComponent } from './zone/zone-map/zone-map.component';
import { ZoneTopbarComponent } from './zone/zone-topbar/zone-topbar.component';
import { SensorComponent } from './sensor/sensor.component';
import { SensorDetailComponent } from './sensor/sensor-detail/sensor-detail.component';
import { SensorTopbarComponent } from './sensor/sensor-topbar/sensor-topbar.component';
import { SensorTypeComponent } from './sensor/sensor-type/sensor-type.component';
import { SensorTypeCategoryComponent } from './sensor/sensor-type-category/sensor-type-category.component';
import { SensorTypeDetailComponent } from './sensor/sensor-type-detail/sensor-type-detail.component';
import { SensorTypeInfoComponent } from './sensor/sensor-type-info/sensor-type-info.component';
import { SensorTypeListComponent } from './sensor/sensor-type-list/sensor-type-list.component';
import { PlotlyComponent } from './components/plotly/plotly.component';
import { InputComponent } from './components/input/input.component';
import { CommentComponent } from './components/comment/comment.component';
import { AnalyticDataFilterPipe } from './filters/analytic-data-filter.pipe';
import { SensortypeDetailPipe } from './filters/sensortype-detail.pipe';
import { CommentModalComponent } from './modals/comment-modal/comment-modal.component';
import { ConfigModalComponent } from './modals/config-modal/config-modal.component';
import { ConfigureComponent } from './configure/configure.component';
import { CreateComponent } from './create/create.component';
import { CreateCustomerComponent } from './create/create-customer/create-customer.component';
import { CreateSensorComponent } from './create/create-sensor/create-sensor.component';
import { CreateZoneComponent } from './create/create-zone/create-zone.component';
import { SensorMapComponent } from './embed/sensor-map/sensor-map.component';
import { VerifyComponent } from './verify/verify.component';
import { InviteModalComponent } from './modals/invite-modal/invite-modal.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SensorListComponent } from './sensor/sensor-list/sensor-list.component';
import { DailyTestModalComponent } from './modals/daily-test-modal/daily-test-modal.component';
import { AlertModalComponent } from './modals/alert-modal/alert-modal.component';
import { DetailViewerComponent } from './components/detail-viewer/detail-viewer.component';
import { NetworkPowerComponent } from './components/network-power/network-power.component';
import { StorageManagerService } from './services/storage-manager.service';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ResetComponent } from './reset/reset.component';
import { SystemParameterLogsComponent } from './sensor/system-parameter-logs/system-parameter-logs.component';
import { SensorCalibrationComponent } from './sensor/sensor-calibration/sensor-calibration.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: ':customerId/login', component: LoginComponent },
  { path: 'register', component: SignUpComponent },
  { path: ':customerId/register', component: SignUpComponent },
  { path: 'auth/:type', component: VerifyComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardService]
  },
  {
    path: ':customerId/dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'embed-map',
    component: SensorMapComponent
  },
  {
    path: 'configure/:sensorKey',
    component: ConfigureComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['staffs', 'customers'],
      roles: ['admin']
    }
  },
  { path: ':customId/admin',
    component: AdminComponent,
    canActivate: [AuthguardService],
    data: {roles: ['admin']}
  },
  {
    path: 'create/:name',
    component: CreateComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['staffs'],
      roles: ['admin', 'debugger', 'operator', 'viewer', 'developer']
    }
  },
  {
    path: 'zone',
    component: ZoneComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['staffs'],
      roles: ['admin', 'debugger', 'operator', 'viewer']
    }
  },
  {
    path: 'sensor_list',
    component: SensorListComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['staffs'],
      roles: ['admin', 'debugger', 'operator', 'viewer', 'developer']
    }
  },
  {
    path: ':customId/sensor_list',
    component: SensorListComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['customers'],
      roles: ['admin', 'debugger', 'operator', 'viewer']
    }
  },
  {
    path: ':customId/zone',
    component: ZoneComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['customers'],
      roles: ['admin', 'debugger', 'operator', 'viewer']
    }
  },
  {
    path: 'customer_detail/:id',
    component: CustomerDetailComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'zone_detail/:id',
    component: ZoneDetailComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'sensor/:id',
    component: SensorComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'sensor_type',
    component: SensorTypeComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['staffs'],
      roles: ['admin', 'developer']
    }
  },
  {
    path: 'sensor_type_list',
    component: SensorTypeListComponent,
    canActivate: [AuthguardService]
  },
  {
    path: ':customId/sensor_type_list',
    component: SensorTypeListComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'sensor_type_info/:id',
    component: SensorTypeInfoComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'reset',
    component: ResetComponent
  },
  {
    path: 'calibration/:sensorKey',
    component: SensorCalibrationComponent,
    canActivate: [AuthguardService],
    data: {
      types: ['staffs'],
      roles: ['admin', 'developer']
    }
  },
  { path: '**', redirectTo: '/dashboard' }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    TopBarComponent,
    DashboardComponent,
    AdminComponent,
    UserModalComponent,
    ConfirmModalComponent,
    CustomerComponent,
    CustomerDetailComponent,
    CustomerListComponent,
    CustomerMapComponent,
    CustomerTopbarComponent,
    ZoneComponent,
    ZoneDetailComponent,
    ZoneListComponent,
    ZoneMapComponent,
    ZoneTopbarComponent,
    SensorComponent,
    SensorDetailComponent,
    SensorTopbarComponent,
    SensorTypeComponent,
    SensorTypeCategoryComponent,
    SensorTypeDetailComponent,
    SensorTypeInfoComponent,
    SensorTypeListComponent,
    PlotlyComponent,
    InputComponent,
    CommentComponent,
    AnalyticDataFilterPipe,
    SensortypeDetailPipe,
    CommentModalComponent,
    ConfigModalComponent,
    ConfigureComponent,
    CreateComponent,
    CreateCustomerComponent,
    CreateSensorComponent,
    CreateZoneComponent,
    SensorMapComponent,
    VerifyComponent,
    InviteModalComponent,
    SignUpComponent,
    SensorListComponent,
    DailyTestModalComponent,
    AlertModalComponent,
    DetailViewerComponent,
    NetworkPowerComponent,
    ResetComponent,
    SystemParameterLogsComponent,
    SensorCalibrationComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBGH1Lmb_8OPJnadWq39AUglhyULkY8HZU'
    }),
    SimpleNotificationsModule.forRoot(),
    AngularFireModule.initializeApp(global_variables.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatRadioModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    HttpModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    HttpService,
    DataService,
    EventService,
    SpinnerService,
    NotificationService,
    AuthguardService,
    PurehttpService,
    StorageManagerService
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule
  ],
  entryComponents: [
    UserModalComponent,
    ConfirmModalComponent,
    CommentModalComponent,
    ConfigModalComponent,
    InviteModalComponent,
    DailyTestModalComponent,
    AlertModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
