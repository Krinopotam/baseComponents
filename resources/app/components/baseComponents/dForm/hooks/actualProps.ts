import {useRef, useState} from "react";

/**
 * Returns relevant props and props update function. The props can be changed both by the parent component and API function
 * @param props
 * @returns
 */

export const useGetActualProps = <T,>(props: T): [T, (props: T) => void] => {
    const curPropsRef = useRef(props); // props, changed by parent component
    const curExtPropsRef = useRef(props); // props, changed by api function

    const updateModal = useGetUpdateMethod();
    const updateModalFormProps = (props: T) => {
        curExtPropsRef.current = props;
        updateModal();
    };

    if (curPropsRef.current !== props) {
        //props changed by parent component
        curPropsRef.current = props;
        curExtPropsRef.current = props;
        return [curPropsRef.current, updateModalFormProps]; //returns props, changed by parent component
    }

    return [curExtPropsRef.current, updateModalFormProps]; //returns props, changed by api
};

/** Get rerender modal form method */
const useGetUpdateMethod = () => {
    const [, setUpdateModal] = useState({});
    return () => setUpdateModal({});
};