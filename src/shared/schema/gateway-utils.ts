import {Request, Response} from '@gravity-ui/expresskit';
import {ApiServiceActionConfig} from '@gravity-ui/gateway';
import {AppContext} from '@gravity-ui/nodekit';
import {GetAuthHeadersParams} from '@gravity-ui/gateway';

export const getAuthHeadersNone = () => undefined;

type GetAuthHeaders<AuthArgs = Record<string, unknown>> = (
    params: GetAuthHeadersParams<AuthArgs>,
) => Record<string, string> | undefined;

type AuthArgsData = {};

export const getAuthHeadersCookie: GetAuthHeaders<AuthArgsData> = ({requestHeaders}) => {
    return {
        cookie: requestHeaders.cookie,
    };
};

export function createAction<TOutput, TParams = undefined, TTransformed = TOutput>(
    config: ApiServiceActionConfig<AppContext, Request, Response, TOutput, TParams, TTransformed>,
) {
    return config;
}
