import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableResourceItem from './DraggableResourceItem';

const ModuleTopicResources = ({ 
  title, 
  resources = [], 
  onAdd, 
  onUpdate, 
  onRemove, 
  onReorder,
  resourceType,
  variant = 'module' // 'module' or 'topic'
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id);
      const newIndex = parseInt(over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div className={`mt-3 p-3 ${variant === 'topic' ? 'mb-2' : 'bg-gray-50 rounded-md'}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {title}:
        </label>
        <button
          onClick={onAdd}
          className={`px-2 py-1 ${variant === 'topic' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-white border border-gray-300'} text-gray-700 rounded-md text-xs hover:bg-gray-50`}
        >
          + Add {resourceType.slice(0, -1)}
        </button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={resources.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          {resources.map((item, index) => (
            <DraggableResourceItem
              key={index}
              id={index.toString()}
              item={item}
              onUpdate={(field, value) => onUpdate(index, field, value)}
              onRemove={() => onRemove(index)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ModuleTopicResources;
