import { getCore } from '@/core-wrapper';
import { LogType } from './enums';

const core = getCore();
const { logger } = core;
// const { LogType } = core.enums;

export default logger;
export { LogType };
