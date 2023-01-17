import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
} from '@/data/protocols/db';
import { SaveSurveyResultParams } from '@/domain/usecases';
import { SurveyResultModel } from '@/domain/models';
import { mockSaveSurveyResultModel } from '@/../tests/domain/mocks';

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  saveSurveyResultParams: SaveSurveyResultParams;

  async save(data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data;
    return Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  surveyResultModel = mockSaveSurveyResultModel();
  surveyId: string;
  accountId: string;

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.surveyResultModel);
  }
}
