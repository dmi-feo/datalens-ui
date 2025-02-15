import React from 'react';

import block from 'bem-cn-lite';
import {i18n} from 'i18n';
import {get, isEmpty, omit} from 'lodash';
import {Feature} from 'shared';
import {formatBytes, formatDuration} from 'shared/modules/format-units/formatUnit';

import {DL} from '../../../../../../../../../../../../constants/common';
import Utils from '../../../../../../../../../../../../utils';
import {
    SourcesConfig,
    SourceSuccess as TSourceSuccess,
} from '../../../../../../../../../../modules/data-provider/charts';
import {DetailsContent, Source, SourceDetails, getParams} from '../Source/Source';

const b = block('chartkit-inspector-sources');

const BASELINE = {
    LATENCY: {
        WARNING: {
            limit: 5000,
            message: () => '',
        },
        DANGER: {
            limit: 10000,
            message: () => '',
        },
    },
    SIZE: {
        WARNING: {
            limit: 5242880, // 5 MB
            message: () => '',
        },
        DANGER: {
            limit: 10485760, // 10 MB
            message: () => '',
        },
    },
};

type SourceSuccessProps = {
    source: TSourceSuccess;
    config: SourcesConfig | null;
    isCollapsible?: boolean;
};

export const SourceSuccess: React.FC<SourceSuccessProps> = ({source, config, isCollapsible}) => {
    const {size, latency, dataUrl, data, sourceId, info, hideInInspector} = source;

    const dataUrlObj = dataUrl ? new URL(dataUrl) : null;
    const dataUrlParams = dataUrlObj ? getParams(dataUrlObj.searchParams) : null;

    const latencyWarning = latency > BASELINE.LATENCY.WARNING.limit;
    const latencyDanger = latency > BASELINE.LATENCY.DANGER.limit;

    const sizeWarning = Boolean(size && size > BASELINE.SIZE.WARNING.limit);
    const sizeDanger = Boolean(size && size > BASELINE.SIZE.DANGER.limit);

    const queryInfo: string = get(info, 'query', '') || get(data, 'sql_query', '');
    const withoutQueryInfo = omit(info, 'query');
    const hasInfo = !isEmpty(queryInfo) || !isEmpty(withoutQueryInfo);
    const showData = data && Utils.isEnabledFeature(Feature.ShowInspectorDetails);
    const showRequestQuery = dataUrlParams && Boolean(Object.keys(dataUrlParams).length);
    const lang = DL.USER_LANG;

    if (hideInInspector) {
        return null;
    }

    return (
        <Source
            key={sourceId}
            config={config}
            source={source}
            isCollapsible={isCollapsible}
            header={
                <React.Fragment>
                    <span className={b('metric', {warning: latencyWarning, danger: latencyDanger})}>
                        {formatDuration(latency, {precision: 'auto', lang})}
                    </span>
                    <span className={b('metric', {warning: sizeWarning, danger: sizeDanger})}>
                        {size ? formatBytes(size, {precision: 'auto', lang}) : <span>&mdash;</span>}
                    </span>
                </React.Fragment>
            }
            content={
                <React.Fragment>
                    {hasInfo && (
                        <div className={b('source-details')}>
                            <div className={b('details-title')}>
                                {i18n('chartkit.menu.inspector', 'label_source-info')}
                            </div>
                            {queryInfo && <DetailsContent value={queryInfo} />}
                            {!isEmpty(withoutQueryInfo) && (
                                <DetailsContent value={JSON.stringify(withoutQueryInfo, null, 2)} />
                            )}
                        </div>
                    )}
                    {showRequestQuery && (
                        <SourceDetails
                            title={i18n('chartkit.menu.inspector', 'label_source-request-query')}
                            value={JSON.stringify(dataUrlParams, null, 2)}
                        />
                    )}
                    {showData && (
                        <SourceDetails
                            title={i18n('chartkit.menu.inspector', 'label_source-request-data')}
                            value={JSON.stringify(data, null, 2)}
                        />
                    )}
                    {dataUrlObj && (
                        <SourceDetails
                            title={i18n('chartkit.menu.inspector', 'label_source-request-result')}
                            value={`${dataUrlObj.origin}${dataUrlObj.pathname}`}
                        />
                    )}
                </React.Fragment>
            }
        />
    );
};
