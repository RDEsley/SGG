import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LotesOvosListComponent } from './pages/lotes-ovos/lotes-ovos-list.component';
import { LoteOvosFormWizardComponent } from './pages/lotes-ovos/lote-ovos-form-wizard.component';
import { ChocadeirasListComponent } from './pages/incubacao/chocadeiras-list.component';
import { AlocacaoFormComponent } from './pages/incubacao/alocacao-form.component';
import { LotesAvesListComponent } from './pages/lotes-aves/lotes-aves-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lotes-ovos', component: LotesOvosListComponent },
  { path: 'lotes-ovos/novo', component: LoteOvosFormWizardComponent },
  { path: 'lotes-ovos/editar/:id', component: LoteOvosFormWizardComponent },
  { path: 'incubacao', component: ChocadeirasListComponent },
  { path: 'incubacao/alocar', component: AlocacaoFormComponent },
  { path: 'lotes-aves', component: LotesAvesListComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
