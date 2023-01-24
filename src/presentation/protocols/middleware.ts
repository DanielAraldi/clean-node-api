import { HttpResponse } from '@/presentation/protocols';

export interface Middleware<T = any> {
  handle(request: T): Promise<HttpResponse>;
}
