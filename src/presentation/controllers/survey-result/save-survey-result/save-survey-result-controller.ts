import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  InvalidParamError,
  forbidden,
  serverError,
} from "./save-survey-result-controller-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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
      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
