import {
  AdminParent,
  AdminPayment,
  AdminPlayer,
  AdminUser
} from '../models/admin.model';


export const MOCK_ADMIN_PARENTS:
  AdminParent[] = [

  {
    id: 1,
    fullName: 'Juan Perez',
    email: 'juan@email.com',
    phone: '305-555-1001',
    status: 'ACTIVE'
  },

  {
    id: 2,
    fullName: 'Maria Lopez',
    email: 'maria@email.com',
    phone: '305-555-1002',
    status: 'ACTIVE'
  },

  {
    id: 3,
    fullName: 'Carlos Diaz',
    email: 'carlos@email.com',
    phone: '305-555-1003',
    status: 'ACTIVE'
  },

  {
    id: 4,
    fullName: 'Ana Rodriguez',
    email: 'ana@email.com',
    phone: '305-555-1004',
    status: 'ACTIVE'
  },

  {
    id: 5,
    fullName: 'Luis Martinez',
    email: 'luis@email.com',
    phone: '305-555-1005',
    status: 'ACTIVE'
  },

  {
    id: 6,
    fullName: 'Laura Garcia',
    email: 'laura@email.com',
    phone: '305-555-1006',
    status: 'ACTIVE'
  },

  {
    id: 7,
    fullName: 'Pedro Torres',
    email: 'pedro@email.com',
    phone: '305-555-1007',
    status: 'ACTIVE'
  },

  {
    id: 8,
    fullName: 'Sofia Hernandez',
    email: 'sofia@email.com',
    phone: '305-555-1008',
    status: 'INACTIVE'
  }

];


export const MOCK_ADMIN_PLAYERS:
  AdminPlayer[] = [

  {
    id: 101,
    parentId: 1,
    firstName: 'Mateo',
    lastName: 'Perez',
    program: 'Development',
    status: 'ACTIVE'
  },

  {
    id: 102,
    parentId: 1,
    firstName: 'Lucas',
    lastName: 'Perez',
    program: 'Competitive',
    status: 'ACTIVE'
  },

  {
    id: 103,
    parentId: 2,
    firstName: 'Daniel',
    lastName: 'Lopez',
    program: 'Foundations',
    status: 'ACTIVE'
  },

  {
    id: 104,
    parentId: 3,
    firstName: 'Sofia',
    lastName: 'Diaz',
    program: 'Development',
    status: 'ACTIVE'
  },

  {
    id: 105,
    parentId: 3,
    firstName: 'Emma',
    lastName: 'Diaz',
    program: 'Foundations',
    status: 'ACTIVE'
  },

  {
    id: 106,
    parentId: 4,
    firstName: 'Alex',
    lastName: 'Rodriguez',
    program: 'Competitive',
    status: 'ACTIVE'
  },

  {
    id: 107,
    parentId: 5,
    firstName: 'Gabriel',
    lastName: 'Martinez',
    program: 'Development',
    status: 'ACTIVE'
  },

  {
    id: 108,
    parentId: 6,
    firstName: 'Andrea',
    lastName: 'Garcia',
    program: 'Foundations',
    status: 'ACTIVE'
  },

  {
    id: 109,
    parentId: 7,
    firstName: 'Samuel',
    lastName: 'Torres',
    program: 'Competitive',
    status: 'ACTIVE'
  },

  {
    id: 110,
    parentId: 8,
    firstName: 'Leo',
    lastName: 'Hernandez',
    program: 'Development',
    status: 'INACTIVE'
  }

];


export const MOCK_ADMIN_PAYMENTS:
  AdminPayment[] = [

  {
    id: 1,
    playerId: 101,
    month: '2026-10',
    expectedAmount: 125,
    paidAmount: 125,
    status: 'PAID',
    paidAt: '2026-10-01'
  },

  {
    id: 2,
    playerId: 102,
    month: '2026-10',
    expectedAmount: 175,
    paidAmount: 175,
    status: 'PAID',
    paidAt: '2026-10-01'
  },

  {
    id: 3,
    playerId: 103,
    month: '2026-10',
    expectedAmount: 125,
    paidAmount: 75,
    status: 'PARTIAL',
    paidAt: '2026-10-01'
  },

  {
    id: 4,
    playerId: 104,
    month: '2026-10',
    expectedAmount: 125,
    paidAmount: 0,
    status: 'UNPAID'
  },

  {
    id: 5,
    playerId: 105,
    month: '2026-10',
    expectedAmount: 100,
    paidAmount: 100,
    status: 'PAID',
    paidAt: '2026-10-02'
  },

  {
    id: 6,
    playerId: 106,
    month: '2026-10',
    expectedAmount: 175,
    paidAmount: 100,
    status: 'PARTIAL',
    paidAt: '2026-10-02'
  },

  {
    id: 7,
    playerId: 107,
    month: '2026-10',
    expectedAmount: 125,
    paidAmount: 125,
    status: 'PAID',
    paidAt: '2026-10-01'
  },

  {
    id: 8,
    playerId: 108,
    month: '2026-10',
    expectedAmount: 100,
    paidAmount: 0,
    status: 'UNPAID'
  },

  {
    id: 9,
    playerId: 109,
    month: '2026-10',
    expectedAmount: 175,
    paidAmount: 175,
    status: 'PAID',
    paidAt: '2026-10-02'
  }

];

export const MOCK_ADMIN_USERS:
  AdminUser[] = [

  {
    id: 1000,
    fullName: 'La Cantera Admin',
    email: 'admin@demo.com',
    phone: '305-555-2001',
    status: 'ACTIVE'
  },

  {
    id: 1001,
    fullName: 'Maria Garcia',
    email: 'maria.admin@demo.com',
    phone: '305-555-2002',
    status: 'ACTIVE'
  },

  {
    id: 1002,
    fullName: 'Carlos Rodriguez',
    email: 'carlos.admin@demo.com',
    phone: '305-555-2003',
    status: 'INACTIVE'
  }

];