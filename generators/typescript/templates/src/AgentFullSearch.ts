declare const require: (module: string) => any;
require('sass/AgentFullSearch.scss');

export * from './<%= capitalizeCustomerSafeName %>Core';

import { swapVar } from './SwapVar';
swapVar(this);
