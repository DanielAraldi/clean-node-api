import { RefreshTokenController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeRefreshTokenValidation } from '@/main/factories/controllers';
import { makeLogControllerDecorator } from '@/main/factories/decorators';
import { makeDbRefreshToken } from '@/main/factories/usecases';

export const makeRefreshTokenController = (): Controller => {
  const controller = new RefreshTokenController(
    makeRefreshTokenValidation(),
    makeDbRefreshToken()
  );
  return makeLogControllerDecorator(controller);
};
