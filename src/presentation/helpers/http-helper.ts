import { HttpResponse } from "../protocols/http";
import { ServerError } from "../errors";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = ({ stack }: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(stack),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
