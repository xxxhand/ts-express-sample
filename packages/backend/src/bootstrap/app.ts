import * as path from 'path';
import express from 'express';
import { TNullable } from '@demo/app-common';
import { AppInitializer } from './app-initializer';
import { AppInterceptor } from './app-interceptor';
import * as appTracer from './app-request-tracer';
import {V1Router } from '../application/workflows/v1-router';

const _PUBLIC_PATH = '../../../../public';

export class App {

	private _app: TNullable<express.Application> = null;

	constructor() {
		this._app = express();
		this._init();
	}

	get app(): express.Application {
		if (!this._app) {
			throw new Error('Application is null');
		}
		return this._app;
	}

	public static tryInitial = async () => {
		await AppInitializer.tryDbClient();
		await AppInitializer.tryRedis();
		AppInitializer.tryInjector();
	}

	private _init(): void {
		if (!this._app) {
			throw new Error('Application is null');
		}
		this._app.use('/api-docs', express.static(path.resolve(<string>require.main?.path || __dirname, `${_PUBLIC_PATH}/api-docs`)));
		this._app.use(express.json({ limit: '10mb' }));
		this._app.use(express.urlencoded({ extended: false }));
		this._app.use(appTracer.handle());
		this._app.use(AppInterceptor.beforeHandler);
		
		const v1Router = new V1Router();
		this._app.use(v1Router.prefix, v1Router.router);

		this._app.use(AppInterceptor.completeHandler);
		this._app.use(AppInterceptor.notFoundHandler);
		this._app.use(AppInterceptor.errorHandler);
	}
}
