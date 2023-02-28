/**
 * @useUpdateMessageBoxTheme
 * @description MessageBox uses an Antd Modal static object, which is launched in its own context.
 * In order to use the context (i.e. an theme) of the component in which MessageBox will be used, this hook must be called
 * @version 0.0.0.67
 * @link omegatester@gmail.com
 * @author Maksim Zaytsev
 * @license MIT
 */

import {App} from 'antd';
import messageBox from '../messageBox';

export const useUpdateMessageBoxTheme = () => {
    const {modal} = App.useApp();
    messageBox.updateThemedModal(modal);
};
