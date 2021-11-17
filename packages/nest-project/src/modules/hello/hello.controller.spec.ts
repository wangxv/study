import { HelloController } from './hello.controller';
import { Test } from '@nestjs/testing';

describe('HelloController', () => {
  let helloController: HelloController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Add
      controllers: [], // Add
      providers: [], // Add
    }).compile();

    helloController = moduleRef.get<HelloController>(HelloController);
  });

  it('should be defined', () => {
    expect(helloController).toBeDefined();
  });
});
