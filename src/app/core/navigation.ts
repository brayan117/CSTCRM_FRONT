export interface NavChild {
  label: string;
  route: string;
}

export interface NavItem {
  label: string;
  route: string;
  children?: NavChild[];
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  tag: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'csat',
    label: 'Comsatelites',
    icon: '🛰️',
    tag: 'Servicio',
    items: [
      {
        label: 'Inventario',
        route: '/comsatelites/inventario',
        children: [
          { label: 'Móviles (vehículos)', route: '/comsatelites/moviles' },
          { label: 'Equipos', route: '/comsatelites/equipos' },
          { label: 'Simcards', route: '/comsatelites/simcards' },
        ],
      },
      { label: 'Técnicos', route: '/comsatelites/tecnicos' },
      { label: 'Operaciones', route: '/comsatelites/operaciones' },
      { label: 'Agenda (matriz)', route: '/comsatelites/agenda' },
      { label: 'Hoja de vida de vehículos', route: '/comsatelites/hoja-vida' },
    ],
  },
  {
    id: 'crad',
    label: 'Comradios',
    icon: '📻',
    tag: 'Servicio',
    items: [
      { label: 'Inventario de radios', route: '/comradios/inventario' },
      { label: 'Operaciones', route: '/comradios/operaciones' },
      { label: 'Agenda', route: '/comradios/agenda' },
    ],
  },
  {
    id: 'cstr',
    label: 'Comstreaming',
    icon: '📺',
    tag: 'Servicio',
    items: [
      { label: 'Contenido y canales', route: '/comstreaming/contenido' },
      { label: 'Operaciones', route: '/comstreaming/operaciones' },
      { label: 'Agenda', route: '/comstreaming/agenda' },
    ],
  },
];

export interface Breadcrumb {
  section: string;
  module: string;
}

export function findBreadcrumb(url: string): Breadcrumb {
  const clean = url.split('?')[0];
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.route === clean) {
        return { section: section.label, module: item.label };
      }
      const child = item.children?.find((c) => c.route === clean);
      if (child) {
        return { section: section.label, module: `${item.label} · ${child.label}` };
      }
    }
  }
  return { section: 'Comsatech', module: 'ERP' };
}
