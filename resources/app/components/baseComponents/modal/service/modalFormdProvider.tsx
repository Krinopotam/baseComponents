/**
 * @ModalFormsProvider
 * @version 0.0.0.8
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import React, {createContext} from 'react';
import dispatcher, {FormsDispatcher} from './formsDispatcher';

export const FormsDispatcherContext = createContext<FormsDispatcher | undefined>(undefined); // as React.Context<FormsDispatcher>;
export const ModalFormsProvider = ({children}: {children: React.ReactNode}): React.ReactElement => {
    return <FormsDispatcherContext.Provider value={dispatcher}>{children}</FormsDispatcherContext.Provider>;
};
