import { Global, Module } from '@nestjs/common';
import { API_BASE_PATH, API_VERSION } from './configs/api.configs';
import {
  OPEN_API_DESCRIPTION,
  OPEN_API_PATH,
  OPEN_API_TITLE,
  OPEN_API_VERSION,
} from './configs/open-api.configs';
import { organizationsMock } from './mocks/organizations/mocks';
import { organizationsMethodsMock } from './mocks/organizations/methods.mocks';
import { userRoles } from './constants/user.roles';

@Global()
@Module({
  providers: [
    {
      provide: 'API_CONFIGS',
      useValue: {
        API_VERSION,
        API_BASE_PATH,
      },
    },
    {
      provide: 'OPEN_API_CONFIGS',
      useValue: {
        OPEN_API_TITLE,
        OPEN_API_DESCRIPTION,
        OPEN_API_VERSION,
        OPEN_API_PATH,
      },
    },
    {
      provide: 'MOCKS_OBJECTS',
      useValue: {
        organizationsMock,
      },
    },
    {
      provide: 'MOCKS_METHODS',
      useValue: {
        organizationsMethodsMock,
      },
    },
    {
      provide: 'USER_ROLES_CONSTANTS',
      useValue: userRoles,
    },
  ],
  exports: ['API_CONFIGS', 'OPEN_API_CONFIGS'],
})
export class SharedModule {}
