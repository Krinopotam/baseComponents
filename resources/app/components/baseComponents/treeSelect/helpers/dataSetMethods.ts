export const addNodeToDataSet = (nodes: ITreeSelectNode[], parentNode: ITreeSelectNode, newNode: ITreeSelectNode, keyField: string, childrenField: string) => {
    if (!parentNode) {
        nodes.push(newNode);
        return;
    }

    for (const node of nodes) {
        if (!node[keyField]) continue;
        if (node[keyField] === parentNode[keyField]) {
            if (!node.isLeaf) {
                if (!node[childrenField]) node[childrenField] = [];
                node[childrenField].push(newNode);
            } else {
                nodes.push(newNode);
            }
            return true;
        }

        if (!node[childrenField]) continue;
        if (addNodeToDataSet(node[childrenField], parentNode, newNode, keyField, childrenField)) return true;
    }
};

export const updateNodeInDataSet = (nodes: ITreeSelectNode[], updatedNode: ITreeSelectNode, keyField: string, childrenField: string) => {
    for (const node of nodes) {
        if (!node[keyField]) continue;
        if (node[keyField] === updatedNode[keyField]) {
            const prevChildren = node[childrenField];
            for (const key in updatedNode) node[key] = updatedNode[key];
            node[childrenField] = prevChildren;
            return true;
        }

        if (!node[childrenField]) continue;
        if (updateNodeInDataSet(node[childrenField], updatedNode, keyField, childrenField)) return true;
    }
};

export const removeNodesFromDataSet = (nodes: ITreeSelectNode[], removeNodes: ITreeSelectNode[], keyField: string, childrenField: string) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (!node[keyField]) continue;
        let removed = false;
        for (const remNode of removeNodes) {
            if (node[keyField] !== remNode[keyField]) continue;
            nodes.splice(i, 1);
            removed = true;
        }

        if (removed || !node[childrenField]) continue;
        removeNodesFromDataSet(node[childrenField], removeNodes, keyField, childrenField);
    }
};
