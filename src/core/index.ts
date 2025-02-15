import { UserCommandsHandlers } from './users/commands';
import { UserQueryHandlers } from './users/queries';

export const CommandHandlers = [...UserCommandsHandlers];

export const QueryHandlers = [...UserQueryHandlers];
