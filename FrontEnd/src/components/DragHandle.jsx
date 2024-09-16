import React from "react";
import { GripVertical } from "lucide-react";

export const DragHandle = ({ onMouseDown }) => (
  <div
    className="w-2 hover:bg-gray-300 cursor-col-resize flex items-center justify-center"
    onMouseDown={onMouseDown}
  >
    <GripVertical className="h-6 w-6 text-gray-400" />
  </div>
);
