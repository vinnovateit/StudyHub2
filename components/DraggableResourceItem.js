import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaRegTrashAlt, FaGripVertical } from "react-icons/fa";

const DraggableResourceItem = ({ id, item, onUpdate, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2 grid grid-cols-[auto_1fr] gap-1">
      <div
        {...attributes}
        {...listeners}
        className="flex items-center px-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <FaGripVertical />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <input
          type="text"
          value={item.url}
          onChange={(e) => onUpdate('url', e.target.value)}
          placeholder="URL"
          className="w-full p-1.5 border border-gray-300 rounded-md bg-white"
        />
        <div className="flex gap-1">
          <input
            type="text"
            value={item.text}
            onChange={(e) => onUpdate('text', e.target.value)}
            placeholder="Text"
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white"
          />
          <button
            onClick={onRemove}
            className="px-1.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            title="Remove item"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraggableResourceItem;
