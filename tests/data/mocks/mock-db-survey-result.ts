import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
} from '@/data/protocols/db';
import { mockSaveSurveyResultModel } from '@/../tests/domain/mocks';

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  saveSurveyResultParams: SaveSurveyResultRepository.Params;

  async save(data: SaveSurveyResultRepository.Params): Promise<void> {
    this.saveSurveyResultParams = data;
    return Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  result = mockSaveSurveyResultModel();
  surveyId: string;
  accountId: string;

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.result);
  }
}
