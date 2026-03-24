import { Role } from '@/core/auth/enums/roles.enum';
import { ModuleRbacPolicy } from '@musanzi/nestjs-session-auth';

export const PROJECTS_RBAC_POLICY: ModuleRbacPolicy = {
  module: 'projects',
  grants: [
    {
      roles: [Role.STAFF],
      actions: ['manage'],
      resources: ['projects', 'projectCategories', 'phases', 'indicators']
    }
  ]
};
