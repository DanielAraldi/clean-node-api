import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
  ok,
  serverError,
} from "./load-surveys-controller-protocols";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
