import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  InvalidParamError,
  forbidden,
  serverError,
  SaveSurveyResult,
  ok,
  Validation,
  badRequest,
} from './save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const surveyId = httpRequest.params?.surveyId;
      const answerId = httpRequest.body?.answerId;

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
        accountId: httpRequest.accountId,
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
