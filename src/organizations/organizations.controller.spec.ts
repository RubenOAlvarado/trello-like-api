import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import { organizationsMethodsMock } from '../shared/mocks/organizations/methods.mocks';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
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

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new organization', async () => {
    const spyCreate = jest.spyOn(controller['organizationsService'], 'create');
    await controller.create({ name: 'Organization 1' });
    expect(spyCreate).toHaveBeenCalled();
    expect(spyCreate).toHaveBeenCalledWith({ name: 'Organization 1' });
  });

  it('should find all organizations', async () => {
    const spyFindAll = jest.spyOn(
      controller['organizationsService'],
      'findAll',
    );
    await controller.findAll();
    expect(spyFindAll).toHaveBeenCalled();
  });

  it('should find one organization', async () => {
    const spyFindOne = jest.spyOn(
      controller['organizationsService'],
      'findOne',
    );
    await controller.findOne('1');
    expect(spyFindOne).toHaveBeenCalled();
    expect(spyFindOne).toHaveBeenCalledWith(1);
  });

  it('should update an organization', async () => {
    const spyUpdate = jest.spyOn(controller['organizationsService'], 'update');
    await controller.update('2', { name: 'Organization 2' });
    expect(spyUpdate).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledWith(2, { name: 'Organization 2' });
  });

  it('should remove an organization', async () => {
    const spyRemove = jest.spyOn(controller['organizationsService'], 'remove');
    await controller.remove('3');
    expect(spyRemove).toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalledWith(3);
  });
});
