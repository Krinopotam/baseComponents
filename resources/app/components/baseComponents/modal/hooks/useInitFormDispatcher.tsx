/**
 * @Modal
 * @version 0.0.0.3
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {useEffect} from 'react';
import dispatcher from '../service/formsDispatcher';

export const useInitFormDispatcher = (formId: string, isFormOpen: boolean) => {
    useEffect(() => {
        if (isFormOpen) dispatcher.pushToStack(formId);
        else dispatcher.removeFromStack(formId);

        return () => {
            dispatcher.removeFromStack(formId);
        };
    }, [isFormOpen, formId]);
};
