import * as path from 'path';
import Koa from 'koa';
import koaBody from 'koa-body';
import mount from 'koa-mount';
import serve from 'koa-static';
import { TNullable } from '@demo/app-common';
import { AppInterceptor } from './app-interceptor';
import * as appTracer from './app-request-tracer';
import v1Route from '../application/workflows/v1-route';

const _PUBLIC_PATH = '../../../../public';

export class App {

  private _app: TNullable<Koa> = null;

  constructor() {
  	this._app = new Koa();
  	this._init();
  }

  get app() {
  	return this._app?.callback();
  }

  private _init() {
  	this._app?.use(mount('/api-docs', serve(path.resolve(<string>require.main?.path || __dirname, `${_PUBLIC_PATH}/api-docs`))));
  	this._app?.use(koaBody({ jsonLimit: '10mb' }));
  	this._app?.use(appTracer.forKoa());
  	this._app?.use(AppInterceptor.beforeHandler);
  	this._app?.use(AppInterceptor.errorHandler);
  	this._app?.use(v1Route.routes());
  	this._app?.use(AppInterceptor.completeHandler);
  	this._app?.use(AppInterceptor.notFoundHandler);
  }
}
