import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(m => m.HomeComponent)
  },

  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about')
        .then(m => m.About)
  },

  {
    path: 'programs',
    loadComponent: () =>
      import('./pages/programs-page/programs-page')
        .then(m => m.ProgramsPage)
  },

  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery')
        .then(m => m.Gallery)
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact')
        .then(m => m.Contact)
  },
  {
      path: 'register',
  loadComponent: () =>
    import('./pages/register/register')
      .then(m => m.Register)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
{
  path: 'admin',
  loadComponent: () =>
    import('./pages/admin/admin-layout/admin-layout')
      .then(m => m.AdminLayout),

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard')
            .then(m => m.AdminDashboard)
      },
      {
        path: 'parents',
        loadComponent: () =>
          import(
            './pages/admin/admin-parents/admin-parents'
          )
            .then(
              m => m.AdminParents
            )
      },
      {
        path: 'players',
        loadComponent: () =>
          import(
            './pages/admin/admin-players/admin-players'
          )
            .then(
              m => m.AdminPlayers
            )
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./pages/admin/admin-payments/admin-payments')
            .then(m => m.AdminPayments)
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('./pages/admin/admin-users/admin-users')
            .then(m => m.AdminUsers)
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/admin/admin-account/admin-account')
            .then(m => m.AdminAccount)
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];