import {render} from 'react-dom';
import {Options} from 'tabulator-tables';
import {IReactTabulatorProps} from 'baseComponents/tabulatorGrid/reactTabulator/reactTabulator';

function syncRender(component: JSX.Element, el: HTMLElement): Promise<HTMLElement> {
    return new Promise(function (resolve) {
        render(component, el, () => {
            resolve(el);
        });
    });
}

export const propsToOptions = async (props: IReactTabulatorProps) => {
    const output = {...props} as Options;
    if (typeof props['footerElement'] === 'object') {
        // convert from JSX to HTML string (tabulator's footerElement accepts string)
        const el = await syncRender(props['footerElement'], document.createElement('div'));
        output.footerElement = el.innerHTML;
        output.layout = props.layout || 'fitColumns';
    }
    return output;
};
