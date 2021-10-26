import {
  AddSurvey,
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
  noContent,
  serverError,
  Validation,
} from "./add-survey-controller-protocols";

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({
        question,
        answers,
      });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
