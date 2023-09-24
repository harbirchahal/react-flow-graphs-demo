import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  EdgeChange,
  NodeChange,
  Edge,
  EdgeMarker,
  Connection,
  Node,
  MarkerType,
} from "reactflow";

import { Direction } from "./types";
import graphSlice from "../store/graphSlice";

const useGraphFlow = () => {
  const dispatch = useDispatch();
  const nodes = useSelector(graphSlice.select.getNodes) ?? [];
  const edges = useSelector(graphSlice.select.getEdges) ?? [];
  const edgeOptions = useSelector(graphSlice.select.getEdgeOptions);

  const selectedEdge = useMemo(() => {
    return edges.find((e) => e.selected);
  }, [edges]);

  const direction = useMemo(() => {
    const type = (edgeOptions.markerEnd as EdgeMarker)?.type;
    return type === MarkerType.ArrowClosed
      ? Direction.DIRECTED
      : Direction.UNDIRECTED;
  }, [edgeOptions]);

  const onAddNode = (node: Node) => {
    dispatch(graphSlice.actions.addNode(node));
  };

  const onRemoveNode = (id: string) => {
    dispatch(graphSlice.actions.removeNode(id));
  };

  const onRemoveEdge = (id: string) => {
    dispatch(graphSlice.actions.removeEdge(id));
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdges = addEdge(params, edges);
      dispatch(graphSlice.actions.setEdges(newEdges));
    },
    [edges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      dispatch(graphSlice.actions.setNodes(newNodes));
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, edges);
      dispatch(graphSlice.actions.setEdges(newEdges));
    },
    [edges]
  );

  const onDirectionChange = (dir: Direction) => {
    const markerEnd = {
      type: dir === Direction.DIRECTED ? MarkerType.ArrowClosed : undefined,
    };
    dispatch(
      graphSlice.actions.setEdgeOptions({ key: "markerEnd", value: markerEnd })
    );
    dispatch(
      graphSlice.actions.setEdges(
        edges.map((e) => ({
          ...e,
          markerEnd,
        }))
      )
    );
  };

  return {
    nodes,
    edges,
    direction,
    edgeOptions,
    selectedEdge,
    onAddNode,
    onRemoveNode,
    onRemoveEdge,
    onConnect,
    onNodesChange,
    onEdgesChange,
    onDirectionChange,
  };
};

export default useGraphFlow;
