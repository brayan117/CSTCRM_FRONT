import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    title: 'Iniciar sesión · Comsatech ERP',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'comsatelites/inventario' },
      {
        path: 'comsatelites/inventario',
        title: 'Inventario · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/inventario/inventario').then(
            (m) => m.ComsatelitesInventario,
          ),
      },
      {
        path: 'comsatelites/moviles',
        title: 'Móviles · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/moviles/moviles').then((m) => m.ComsatelitesMoviles),
      },
      {
        path: 'comsatelites/equipos',
        title: 'Equipos · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/equipos/equipos').then((m) => m.ComsatelitesEquipos),
      },
      {
        path: 'comsatelites/simcards',
        title: 'Simcards · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/simcards/simcards').then((m) => m.ComsatelitesSimcards),
      },
      {
        path: 'comsatelites/tecnicos',
        title: 'Técnicos · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/tecnicos/tecnicos').then((m) => m.ComsatelitesTecnicos),
      },
      {
        path: 'comsatelites/operaciones',
        title: 'Operaciones · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/operaciones/operaciones').then(
            (m) => m.ComsatelitesOperaciones,
          ),
      },
      {
        path: 'comsatelites/agenda',
        title: 'Agenda · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/agenda/agenda').then((m) => m.ComsatelitesAgenda),
      },
      {
        path: 'comsatelites/hoja-vida',
        title: 'Hoja de vida · Comsatelites',
        loadComponent: () =>
          import('./features/comsatelites/hoja-vida/hoja-vida').then((m) => m.HojaVida),
      },
      {
        path: 'comradios/inventario',
        title: 'Inventario · Comradios',
        loadComponent: () =>
          import('./features/comradios/inventario/inventario').then((m) => m.ComradiosInventario),
      },
      {
        path: 'comradios/operaciones',
        title: 'Operaciones · Comradios',
        loadComponent: () =>
          import('./features/comradios/operaciones/operaciones').then(
            (m) => m.ComradiosOperaciones,
          ),
      },
      {
        path: 'comradios/agenda',
        title: 'Agenda · Comradios',
        loadComponent: () =>
          import('./features/comradios/agenda/agenda').then((m) => m.ComradiosAgenda),
      },
      {
        path: 'comstreaming/contenido',
        title: 'Contenido · Comstreaming',
        loadComponent: () =>
          import('./features/comstreaming/contenido/contenido').then(
            (m) => m.ComstreamingContenido,
          ),
      },
      {
        path: 'comstreaming/operaciones',
        title: 'Operaciones · Comstreaming',
        loadComponent: () =>
          import('./features/comstreaming/operaciones/operaciones').then(
            (m) => m.ComstreamingOperaciones,
          ),
      },
      {
        path: 'comstreaming/agenda',
        title: 'Agenda · Comstreaming',
        loadComponent: () =>
          import('./features/comstreaming/agenda/agenda').then((m) => m.ComstreamingAgenda),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
