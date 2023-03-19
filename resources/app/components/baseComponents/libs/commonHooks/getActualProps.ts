import {useRef, useState} from "react";

/**
 * Returns relevant props and props update function. The props can be changed both by the parent component and API function
 * @param props
 * @returns
 */

export const useGetActualProps = <T,>(props: T): [T, (props: T) => void] => {
    const curPropsRef = useRef<T>(props); // props, changed by parent component
    const curExtPropsRef = useRef<T>(props); // props, changed by api function

    const rerender = useGetRerender();
    const updateProps = (props: T) => {
        curExtPropsRef.current = props;
        rerender();
    };

    if (curPropsRef.current !== props) {
        //props changed by parent component
        curPropsRef.current = props;
        curExtPropsRef.current = props;
        return [curPropsRef.current, updateProps]; //returns props, changed by parent component
    }

    return [curExtPropsRef.current, updateProps]; //returns props, changed by api
};

/** Get rerender modal form method */
const useGetRerender = () => {
    const [, setUpdateModal] = useState({});
    return () => setUpdateModal({});
};