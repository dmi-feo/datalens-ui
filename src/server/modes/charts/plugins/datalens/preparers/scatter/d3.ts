import {SymbolType} from '@gravity-ui/chartkit/build/constants';
import type {
    ChartKitWidgetData,
    ScatterSeries,
    ScatterSeriesData,
} from '@gravity-ui/chartkit/build/types/widget-data';

import {ServerField, WizardVisualizationId, getFakeTitleOrTitle} from '../../../../../../../shared';
import {PointCustomData, ScatterSeriesCustomData} from '../../../../../../../shared/types/chartkit';
import {getAxisType} from '../helpers/axis';
import {PrepareFunctionArgs} from '../types';

import {ScatterGraph, prepareScatter} from './prepareScatter';

type MapScatterSeriesArgs = {
    x?: ServerField;
    y?: ServerField;
    graph: ScatterGraph;
};

function mapScatterSeries(args: MapScatterSeriesArgs): ScatterSeries<PointCustomData> {
    const {x, y, graph} = args;

    const series: ScatterSeries<PointCustomData> = {
        type: 'scatter',
        name: graph.name || '',
        color: typeof graph.color === 'string' ? graph.color : undefined,
        data:
            graph.data?.map((item, index) => {
                const point = item;
                const pointData: ScatterSeriesData<PointCustomData> = {
                    radius: point.marker?.radius,
                    custom: {
                        name: point.name,
                        xLabel: point.xLabel,
                        yLabel: point.yLabel,
                        cLabel: point.cLabel,
                        sLabel: point.sLabel,
                        sizeLabel: point.sizeLabel,
                    },
                };

                if (
                    getAxisType({
                        field: x,
                        visualizationId: WizardVisualizationId.ScatterD3,
                        sort: [],
                    }) === 'category'
                ) {
                    pointData.x = typeof item.x === 'number' ? item.x : index;
                } else {
                    pointData.x = item.x;
                }

                if (
                    getAxisType({
                        field: y,
                        visualizationId: WizardVisualizationId.ScatterD3,
                        sort: [],
                    }) === 'category'
                ) {
                    pointData.y = typeof item.y === 'number' ? item.y : index;
                } else {
                    pointData.y = item.y;
                }

                return pointData;
            }) || [],
    };

    if (graph.marker?.symbol) {
        series.symbolType = graph.marker?.symbol as SymbolType;
    }

    return series;
}

export function prepareD3Scatter(
    options: PrepareFunctionArgs,
): ChartKitWidgetData<PointCustomData> {
    const {categories: preparedXCategories, graphs, x, y, z, color, size} = prepareScatter(options);
    const xCategories = (preparedXCategories || []).map(String);
    const seriesCustomData: ScatterSeriesCustomData = {
        xTitle: getFakeTitleOrTitle(x),
        yTitle: getFakeTitleOrTitle(y),
        pointTitle: getFakeTitleOrTitle(z),
        colorTitle: getFakeTitleOrTitle(color),
        sizeTitle: getFakeTitleOrTitle(size),
    };

    const config: ChartKitWidgetData = {
        series: {
            data: graphs.map((graph) => ({
                ...mapScatterSeries({graph, x, y}),
                custom: seriesCustomData,
            })),
        },
    };

    if (
        getAxisType({
            field: x,
            visualizationId: WizardVisualizationId.ScatterD3,
            sort: [],
        }) === 'category'
    ) {
        config.xAxis = {
            categories: xCategories,
        };
    }

    if (config.series.data.length <= 1) {
        config.legend = {enabled: false};
    }

    return config;
}
