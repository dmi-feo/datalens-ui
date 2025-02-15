import {ControlType, LoadStatus} from './types';

export const ELEMENT_TYPE = {
    SELECT: 'select',
    DATE: 'date',
    INPUT: 'input',
};
export const TYPE: Record<string, ControlType> = {
    SELECT: 'select',
    INPUT: 'input',
    DATEPICKER: 'datepicker',
    RANGE_DATEPICKER: 'range-datepicker',
    CHECKBOX: 'checkbox',
};

export const LOAD_STATUS: Record<string, LoadStatus> = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAIL: 'fail',
};

// This value is also used in charts
export const LIMIT = 1000;
