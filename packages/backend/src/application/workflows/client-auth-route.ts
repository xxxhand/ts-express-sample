import { ParameterizedContext, Next } from 'koa';
import Router from '@koa/router';
import { injectable } from 'inversify';
import {
	CustomClassBuilder,
	CustomResult,
	defaultContainer,
	lazyInject,
	TNullable,
	CustomUtils,
	LOGGER,
} from '@demo/app-common';
import { IStateResult } from '../../domain/types';
import { InjectorCodes } from '../../domain/enums/injector-codes';
import { IClientRepository } from '../../domain/repositories/i-client-repository';
import { RegisterClientRequest } from '../../domain/value-objects/register-client-request';
import { ClientEntity } from '../../domain/entities/client-entity';

@injectable()
export class ClientAuthRoute {

    @lazyInject(InjectorCodes.I_CLIENT_REPO)
    private _repo: TNullable<IClientRepository>;

    public create = async (ctx: ParameterizedContext<IStateResult>, next: Next): Promise<void> => {

    	const mReq = CustomClassBuilder.build(RegisterClientRequest, ctx.request.body)?.checkRequired();
    	LOGGER.info(`Create new client for ${mReq?.name}`);
    	const entity = <ClientEntity>CustomClassBuilder.build(ClientEntity, mReq);
    	entity.clientId = CustomUtils.generateUniqueId();
    	entity.clientSecret = CustomUtils.generateUniqueId();
    	await this._repo?.save(entity);

    	ctx.state.result = new CustomResult().withResult(entity);
    	await next();
    }

    public static build(): Router {
    	defaultContainer.bind(ClientAuthRoute).toSelf().inSingletonScope();
    	const _ctrl = defaultContainer.get(ClientAuthRoute);
    	return new Router()
    		.prefix('/client-auth')
    		.post('/', _ctrl.create);
    }
}

