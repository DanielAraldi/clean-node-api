import { Controller, HttpResponse, Validation } from '@/presentation/protocols';
import { forbidden, serverError, ok, badRequest } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { accountId, answerId, surveyId } = request;

      const survey = await this.loadSurveyById.loadById(surveyId);

      if (survey) {
        const findedAnswer = survey.answers.find(
          answer => answer.answerId.toString() === answerId
        );
        if (!findedAnswer) {
          return forbidden(new InvalidParamError('answerId'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        answerId,
        surveyId,
        date: new Date(),
      });
      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string;
    answerId: string;
    accountId: string;
  };
}
