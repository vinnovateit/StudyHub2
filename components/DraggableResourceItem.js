import { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaRegTrashAlt, FaGripVertical, FaFilePdf } from "react-icons/fa";

const DraggableResourceItem = ({
  id,
  item,
  onUpdate,
  onRemove,
  onRename,
  mode = "link",
}) => {
  const [draftName, setDraftName] = useState(item.text || "");
  const [isRenaming, setIsRenaming] = useState(false);
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

  useEffect(() => {
    setDraftName(item.text || "");
  }, [item.text]);

  const commitRename = async () => {
    if (mode !== "file" || !onRename) {
      return;
    }

    const nextName = draftName.trim();
    const currentName = (item.text || "").trim();

    if (!nextName || nextName === currentName) {
      setDraftName(item.text || "");
      return;
    }

    try {
      setIsRenaming(true);
      await onRename(nextName);
    } catch (error) {
      console.error("Error renaming PDF:", error);
      alert(error.message || "Failed to rename PDF");
      setDraftName(item.text || "");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 grid grid-cols-[auto_1fr] gap-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-start px-2 pt-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <FaGripVertical />
      </div>
      {mode === "file" ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <FaFilePdf />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Module PDF
                </p>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                    if (e.key === "Escape") {
                      setDraftName(item.text || "");
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder="Rename file"
                  disabled={isRenaming}
                  className="mt-1 w-full max-w-xl rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 md:shrink-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
              >
                Open
              </a>
              <button
                type="button"
                onClick={onRemove}
                className="rounded-md border border-red-200 px-2.5 py-2 text-red-600 hover:bg-red-50"
                title="Remove item"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.2fr_1fr_auto]">
          <input
            type="text"
            value={item.url}
            onChange={(e) => onUpdate('url', e.target.value)}
            placeholder="URL"
            className="w-full rounded-md border border-gray-300 bg-white p-2"
          />
          <input
            type="text"
            value={item.text}
            onChange={(e) => onUpdate('text', e.target.value)}
            placeholder="Text"
            className="w-full rounded-md border border-gray-300 bg-white p-2"
          />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 px-3 text-red-600 hover:bg-red-50"
            title="Remove item"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};

export default DraggableResourceItem;
