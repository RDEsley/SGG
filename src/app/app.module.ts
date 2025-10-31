import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { NgChartsModule } from 'ng2-charts';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LotesOvosListComponent } from './pages/lotes-ovos/lotes-ovos-list.component';
import { LoteOvosFormWizardComponent } from './pages/lotes-ovos/lote-ovos-form-wizard.component';
import { ChocadeirasListComponent } from './pages/incubacao/chocadeiras-list.component';
import { AlocacaoFormComponent } from './pages/incubacao/alocacao-form.component';
import { TransferenciaModalComponent } from './pages/incubacao/transferencia-modal.component';
import { LotesAvesListComponent } from './pages/lotes-aves/lotes-aves-list.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog.component';
import { MasksPipe } from './shared/masks.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LotesOvosListComponent,
    LoteOvosFormWizardComponent,
    ChocadeirasListComponent,
    AlocacaoFormComponent,
    TransferenciaModalComponent,
    LotesAvesListComponent,
    ConfirmDialogComponent,
    MasksPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    NgChartsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideHttpClient(),
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
