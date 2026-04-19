import { useRef, useState } from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DOCUMENT_UPLOAD_ACCEPT,
  getDocumentUploadError,
  isAllowedDocumentUpload,
} from "@/lib/documentUpload";
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
import ConfirmActionModal from './ConfirmActionModal';

const ModuleTopicResources = ({ 
  title, 
  resources = [], 
  onAdd, 
  onUpdate, 
  onRemove, 
  onReorder,
  onRename,
  resourceType,
  variant = 'module', // 'module' or 'topic'
  uploadable = false,
  onUploadFiles,
}) => {
  const fileInputRef = useRef(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    onConfirm: null,
  });
  const DELETE_CONFIRM_MESSAGE =
    'Delete this item? This action cannot be undone, and deletion activity is logged.';
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const acceptedFiles = files.filter((file) => isAllowedDocumentUpload(file));
    const rejectedFiles = files.filter((file) => !isAllowedDocumentUpload(file));

    if (rejectedFiles.length) {
      alert(getDocumentUploadError(rejectedFiles[0]));
    }

    setPendingFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        name: file.name,
      })),
    ]);

    event.target.value = "";
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPendingFiles = async () => {
    if (!onUploadFiles || pendingFiles.length === 0) {
      return;
    }

    try {
      setIsUploading(true);
      await onUploadFiles(pendingFiles);
      setPendingFiles([]);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message || "Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const removePendingFile = (index) => {
    setConfirmDialog({
      isOpen: true,
      onConfirm: () => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== index));
        setConfirmDialog({
          isOpen: false,
          onConfirm: null,
        });
      },
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id);
      const newIndex = parseInt(over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div
      className={`mt-3 rounded-xl border border-gray-200 ${
        variant === "topic" ? "mb-2 bg-white/70" : "bg-gray-50"
      } p-3`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="block text-sm font-semibold text-gray-700">
          {title}:
        </label>
        {uploadable ? (
          <div className="flex items-center gap-2">
            <label
            className={`inline-flex cursor-pointer items-center rounded-full px-3 py-2 text-xs font-medium transition ${
                variant === "topic"
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>Attach Files</span>
              <input
                ref={fileInputRef}
                type="file"
                accept={DOCUMENT_UPLOAD_ACCEPT}
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <button
              type="button"
              onClick={uploadPendingFiles}
              disabled={isUploading || pendingFiles.length === 0}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                isUploading || pendingFiles.length === 0
                  ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
                  : "border border-blue-200 bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isUploading
                ? "Uploading..."
                : pendingFiles.length === 0
                  ? "Upload"
                  : `Upload ${pendingFiles.length} ${
                      pendingFiles.length === 1 ? "File" : "Files"
                    }`}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className={`rounded-full px-3 py-2 text-xs font-medium transition ${
              variant === "topic"
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            + Add {resourceType.slice(0, -1)}
          </button>
        )}
      </div>

      {uploadable && pendingFiles.length > 0 && (
        <div className="mb-3 space-y-2">
          {pendingFiles.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm md:grid-cols-[1fr_auto]"
            >
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  setPendingFiles((prev) =>
                    prev.map((pending, i) =>
                      i === index ? { ...pending, name: e.target.value } : pending
                    )
                  )
                }
                className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => removePendingFile(index)}
                className="justify-self-end text-red-600 hover:text-red-700"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={resources.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {resources.map((item, index) => (
            <DraggableResourceItem
              key={index}
              id={index.toString()}
              item={item}
              onUpdate={(field, value) => onUpdate(index, field, value)}
              onRemove={() => onRemove(index)}
              onRename={
                onRename ? (newName) => onRename(index, newName) : undefined
              }
              mode={uploadable ? "file" : "link"}
            />
          ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmActionModal
        isOpen={confirmDialog.isOpen}
        title="Confirm Deletion"
        message={DELETE_CONFIRM_MESSAGE}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => confirmDialog.onConfirm?.()}
        onCancel={() =>
          setConfirmDialog({
            isOpen: false,
            onConfirm: null,
          })
        }
      />
    </div>
  );
};

export default ModuleTopicResources;
