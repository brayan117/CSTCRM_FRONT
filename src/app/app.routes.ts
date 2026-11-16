import { Routes } from '@angular/router';
import { authGuard, loginGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    title: 'Iniciar sesión · Comsatech ERP',
    loadComponent: () => import('./views/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'comsatelites/inventario' },

      // ---------- ADMIN · COMSATELITES ----------
      {
        path: 'comsatelites/inventario',
        canActivate: [roleGuard(['admin'])],
        title: 'Inventario · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/inventario/inventario').then(
            (m) => m.ComsatelitesInventario,
          ),
      },
      {
        path: 'comsatelites/moviles',
        canActivate: [roleGuard(['admin'])],
        title: 'Móviles · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/moviles/moviles').then((m) => m.ComsatelitesMoviles),
      },
      {
        path: 'comsatelites/equipos',
        canActivate: [roleGuard(['admin'])],
        title: 'Equipos · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/equipos/equipos').then((m) => m.ComsatelitesEquipos),
      },
      {
        path: 'comsatelites/simcards',
        canActivate: [roleGuard(['admin'])],
        title: 'Simcards · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/simcards/simcards').then((m) => m.ComsatelitesSimcards),
      },
      {
        path: 'comsatelites/tecnicos',
        canActivate: [roleGuard(['admin'])],
        title: 'Técnicos · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/tecnicos/tecnicos').then((m) => m.ComsatelitesTecnicos),
      },
      {
        path: 'comsatelites/operaciones',
        canActivate: [roleGuard(['admin'])],
        title: 'Operaciones · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/operaciones/operaciones').then(
            (m) => m.ComsatelitesOperaciones,
          ),
      },
      {
        path: 'comsatelites/agenda',
        canActivate: [roleGuard(['admin'])],
        title: 'Agenda · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/agenda/agenda').then((m) => m.ComsatelitesAgenda),
      },
      {
        path: 'comsatelites/hoja-vida',
        canActivate: [roleGuard(['admin'])],
        title: 'Hoja de vida · Comsatelites',
        loadComponent: () =>
          import('./views/admin/comsatelites/hoja-vida/hoja-vida').then((m) => m.HojaVida),
      },
      {
        path: 'comradios/inventario',
        canActivate: [roleGuard(['admin'])],
        title: 'Inventario · Comradios',
        loadComponent: () =>
          import('./views/admin/comradios/inventario/inventario').then((m) => m.ComradiosInventario),
      },
      {
        path: 'comradios/operaciones',
        canActivate: [roleGuard(['admin'])],
        title: 'Operaciones · Comradios',
        loadComponent: () =>
          import('./views/admin/comradios/operaciones/operaciones').then(
            (m) => m.ComradiosOperaciones,
          ),
      },
      {
        path: 'comradios/agenda',
        canActivate: [roleGuard(['admin'])],
        title: 'Agenda · Comradios',
        loadComponent: () =>
          import('./views/admin/comradios/agenda/agenda').then((m) => m.ComradiosAgenda),
      },
      {
        path: 'comstreaming/contenido',
        canActivate: [roleGuard(['admin'])],
        title: 'Contenido · Comstreaming',
        loadComponent: () =>
          import('./views/admin/comstreaming/contenido/contenido').then(
            (m) => m.ComstreamingContenido,
          ),
      },
      {
        path: 'comstreaming/operaciones',
        canActivate: [roleGuard(['admin'])],
        title: 'Operaciones · Comstreaming',
        loadComponent: () =>
          import('./views/admin/comstreaming/operaciones/operaciones').then(
            (m) => m.ComstreamingOperaciones,
          ),
      },
      {
        path: 'comstreaming/agenda',
        canActivate: [roleGuard(['admin'])],
        title: 'Agenda · Comstreaming',
        loadComponent: () =>
          import('./views/admin/comstreaming/agenda/agenda').then((m) => m.ComstreamingAgenda),
      },

      // ---------- ADMINISTRATIVO ----------
      { path: 'administrativo', pathMatch: 'full', redirectTo: 'administrativo/comsatelites/clientes' },
      {
        path: 'administrativo/comsatelites/clientes',
        canActivate: [roleGuard(['administrativo'])],
        title: 'Clientes · Administrativo',
        loadComponent: () =>
          import('./views/administrativo/comsatelites/clientes/clientes').then((m) => m.AdminClientes),
      },
      {
        path: 'administrativo/comsatelites/operaciones',
        canActivate: [roleGuard(['administrativo'])],
        title: 'Operaciones · Administrativo',
        loadComponent: () =>
          import('./views/administrativo/comsatelites/operaciones/operaciones').then(
            (m) => m.ComsatelitesOperaciones,
          ),
      },
      {
        path: 'administrativo/comsatelites/facturacion',
        canActivate: [roleGuard(['administrativo'])],
        title: 'Facturación · Administrativo',
        loadComponent: () =>
          import('./views/administrativo/comsatelites/facturacion/facturacion').then(
            (m) => m.AdminFacturacion,
          ),
      },
      {
        path: 'administrativo/comsatelites/historial',
        canActivate: [roleGuard(['administrativo'])],
        title: 'Historial · Administrativo',
        loadComponent: () =>
          import('./views/administrativo/comsatelites/historial/historial').then(
            (m) => m.AdminHistorial,
          ),
      },

      // ---------- CLIENTE ----------
      {
        path: 'cliente/inventario',
        canActivate: [roleGuard(['cliente'])],
        title: 'Inventario · Cliente',
        loadComponent: () =>
          import('./views/cliente/inventario/inventario').then((m) => m.ClienteInventario),
      },
      {
        path: 'cliente/operaciones',
        canActivate: [roleGuard(['cliente'])],
        title: 'Operaciones · Cliente',
        loadComponent: () =>
          import('./views/cliente/operaciones/operaciones').then((m) => m.ClienteOperaciones),
      },
      { path: 'cliente', pathMatch: 'full', redirectTo: 'cliente/inventario' },
      { path: 'cliente/**', redirectTo: 'cliente/inventario' },

      // ---------- TÉCNICO ----------
      {
        path: 'tecnico/asignaciones',
        canActivate: [roleGuard(['tecnico'])],
        title: 'Asignaciones · Técnico',
        loadComponent: () =>
          import('./views/tecnico/asignaciones/asignaciones').then((m) => m.TecnicoAsignaciones),
      },
      {
        path: 'tecnico/perfil',
        canActivate: [roleGuard(['tecnico'])],
        title: 'Perfil · Técnico',
        loadComponent: () =>
          import('./views/tecnico/perfil/perfil').then((m) => m.TecnicoPerfil),
      },
      { path: 'tecnico', pathMatch: 'full', redirectTo: 'tecnico/asignaciones' },
      { path: 'tecnico/**', redirectTo: 'tecnico/asignaciones' },
    ],
  },
  { path: '**', redirectTo: '' },
];
