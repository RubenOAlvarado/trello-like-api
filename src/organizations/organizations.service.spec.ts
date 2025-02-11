import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import { organizationsMethodsMock } from '../shared/mocks/organizations/methods.mocks';
import { organizationsMock } from '../shared/mocks/organizations/mocks';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: PrismaService,
          useValue: {
            organization: organizationsMethodsMock,
          },
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new organization', async () => {
    const spyCreate = jest.spyOn(prismaService.organizations, 'create');
    const organization = await service.create({ name: 'Organization 1' });
    expect(spyCreate).toHaveBeenCalled();
    expect(organization).toEqual(organizationsMock[0]);
    expect(spyCreate).toHaveBeenCalledWith({
      data: { name: 'Organization 1' },
    });
  });

  it('should find all organizations', async () => {
    const spyFindMany = jest.spyOn(prismaService.organizations, 'findMany');
    const organizations = await service.findAll();
    expect(spyFindMany).toHaveBeenCalled();
    expect(organizations).toEqual(organizationsMock);
  });

  it('should find one organization', async () => {
    const spyFindUnique = jest.spyOn(prismaService.organizations, 'findUnique');
    const organization = await service.findOne(1);
    expect(spyFindUnique).toHaveBeenCalled();
    expect(organization).toEqual(organizationsMock[0]);
    expect(spyFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update an organization', async () => {
    const spyFindOne = jest.spyOn(service, 'findOne');
    const spyUpdate = jest.spyOn(prismaService.organizations, 'update');
    const organization = await service.update(2, { name: 'Organization 2' });
    expect(spyFindOne).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
    expect(organization).toEqual(organizationsMock[3]);
    expect(spyUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Organization 2' },
    });
  });

  it('should remove an organization', async () => {
    const spyFindOne = jest.spyOn(service, 'findOne');
    const spyDelete = jest.spyOn(prismaService.organizations, 'delete');
    const organization = await service.remove(3);
    expect(spyFindOne).toHaveBeenCalled();
    expect(spyDelete).toHaveBeenCalled();
    expect(organization).toEqual(organizationsMock[3]);
    expect(spyDelete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
