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
} from "./save-survey-result-controller-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body);

      const surveyId = httpRequest.params?.surveyId;
      const surveyAnswer = httpRequest.body?.answer;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map(({ answer }) => answer.trim());
        if (!answers.includes(surveyAnswer?.trim())) {
          return forbidden(new InvalidParamError("answer"));
        }
      } else {
        return forbidden(new InvalidParamError("surveyId"));
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId: httpRequest.accountId,
        answer: surveyAnswer,
        surveyId,
        date: new Date(),
      });
      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
