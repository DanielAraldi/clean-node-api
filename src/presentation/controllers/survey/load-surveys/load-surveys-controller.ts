import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
  ok,
} from "./load-surveys-controller-protocols";

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load();
    return ok(surveys);
  }
}
