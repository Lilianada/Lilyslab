'use client';

import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useCallback } from 'react';

// Define item structure for Todo lists
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface NotesWidgetProps {
  title: string;
  defaultContent?: string; // Optional default content if local storage is empty
  type: 'list' | 'todo' | 'read' | 'movie'; // Add types
}

const NotesWidget: React.FC<NotesWidgetProps> = ({
  title,
  defaultContent = "- Item 1\n- Item 2\n- Item 3",
  type
}) => {
  const LOCAL_STORAGE_KEY = `notesWidget_${title.replace(/ /g, '_')}`; // Create unique key

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State for simple lists (string)
  const [listItems, setListItems] = useState<string>("");

  // State for todo lists (array of objects)
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        if (type === 'todo') {
          try {
            const parsedTodos = JSON.parse(savedData) as TodoItem[];
            setTodoItems(parsedTodos);
          } catch (e) {
            console.error("Failed to parse saved todo items:", e);
            // Fallback to default or treat as plain text if parse fails
            setTodoItems(defaultContent.split('\n').map((text, index) => ({ id: Date.now() + index, text: text.replace(/^- /, ''), completed: false })));
          }
        } else {
          setListItems(savedData);
        }
      } else {
        // Initialize with default content if nothing is saved
        if (type === 'todo') {
          setTodoItems(defaultContent.split('\n').map((text, index) => ({ id: Date.now() + index, text: text.replace(/^- /, ''), completed: false })));
        } else {
          setListItems(defaultContent);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Save to local storage whenever relevant state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (type === 'todo') {
        // Only save if todoItems has been initialized (to avoid overwriting on initial load)
        if (todoItems.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY)) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoItems));
        }
      } else {
        // Only save if listItems has been initialized
        if (listItems || localStorage.getItem(LOCAL_STORAGE_KEY)) {
          localStorage.setItem(LOCAL_STORAGE_KEY, listItems);
        }
      }
    }
  }, [listItems, todoItems, type, LOCAL_STORAGE_KEY]); // Add dependencies

  // Edit/Save Handlers
  const handleToggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  // Handles changes in the textarea (used for all types during edit)
  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setListItems(event.target.value); // Temporarily store raw text for all types when editing
  };

  // Save logic converts textarea content back to structured data if needed (for todos)
  const handleSave = useCallback(() => {
    if (type === 'todo') {
      // Parse the textarea content back into todo items
      const lines = listItems.split('\n').filter(line => line.trim() !== '');
      // Try to preserve existing IDs and completion status if possible, otherwise create new ones
      const existingTodosById = todoItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<number, TodoItem>);

      const newTodoItems = lines.map((lineText, index) => {
        // Basic heuristic: If line roughly matches an existing item text, keep its state
        // Remove potential leading checkbox syntax like [x] or [ ] for matching
        const cleanLineText = lineText.replace(/^[ xX]?\]\s*/, '').trim();
        const existingMatch = Object.values(existingTodosById).find(item => item.text.trim() === cleanLineText);

        // Determine completed status from text if editing or use existing
        let completed = false;
        if (existingMatch) {
          completed = existingMatch.completed;
        } else if (/^[x]/.test(lineText)) { // Check if line starts with [x] (case-insensitive)
          completed = true;
        }

        return {
          id: existingMatch ? existingMatch.id : Date.now() + index,
          text: cleanLineText,
          completed: completed
        };
      });
      setTodoItems(newTodoItems);
    }
    // For 'list' type, listItems state is already updated by handleTextareaChange
    setIsEditing(false);
  }, [type, listItems, todoItems]); // Add dependencies

  // Pre-populate textarea when starting edit for todos
  useEffect(() => {
    if (isEditing && type === 'todo') {
      setListItems(todoItems.map(item => `${item.completed ? '[x]' : '[ ]'} ${item.text}`).join('\n'));
    } else if (isEditing && type !== 'todo') {
      // Ensure listItems is set for non-todo types when edit starts
      // (It should already be set by the initial load useEffect)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, type]); // Run when editing starts

  // Todo Specific Handlers
  const handleToggleTodo = useCallback((id: number) => {
    setTodoItems((prevTodos) =>
      prevTodos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  // Common Handlers
  const handleEllipsisKeyDown = (event: KeyboardEvent<HTMLParagraphElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleEdit();
    }
  };

  // Rendering Logic
  const itemsArray = type !== 'todo' ? listItems.split('\n').filter(item => item.trim() !== '') : [];

  const lineHeight = '1.6em';
  const lineStyles = {
    lineHeight: lineHeight,
    backgroundImage: `linear-gradient(transparent calc(${lineHeight} - 1px), rgb(219 234 254 / 1) 0px)`,
    backgroundSize: `100% ${lineHeight}`,
  };

  return (
    <div className="relative w-64 h-64">
      {/* Background Squircle */}
      <div className="absolute inset-0 bg-yellow-300 rounded-[40px] shadow-lg"></div>

      {/* Paper Stack - Use absolute positioning and slight rotations/offsets */}
      {/* Bottom Paper */}
      <div
        className="absolute w-[82%] h-[82%] bg-[#FFFCEC] rounded-lg shadow-md"
        style={{
          top: '11%',
          left: '9%',
          transform: 'rotate(-2deg)',
        }}
      ></div>

      {/* Middle Paper */}
      <div
        className="absolute w-[85%] h-[85%] bg-[#FFFCEC] rounded-lg shadow-md"
        style={{
          top: '9%',
          left: '10%',
          transform: 'rotate(5.5deg)',
        }}
      ></div>

      {/* Top Paper (Content) */}
      <div
        className="absolute w-[88%] h-[88%] bg-[#FFFCEC] rounded-lg shadow-lg overflow-hidden flex flex-col px-5 py-4"
        style={{
          top: '6%',
          left: '6%',
          transform: 'rotate(-0.5deg)',
        }}
      >
        {/* Title */}
        <p className="text-gray-400 text-[10px] font-sans font-semibold tracking-wider mb-3 self-start uppercase">
          {title}
        </p>

        {/* List/Input Area */}
        <div className="relative flex-grow w-full mb-2 flex flex-col overflow-hidden">
          {isEditing ? (
            <div className="relative z-10 flex flex-col flex-grow h-full">
              <textarea
                value={listItems}
                onChange={handleTextareaChange}
                className="flex-grow w-full bg-transparent border-none focus:outline-none resize-none text-blue-600 text-base font-medium font-serif italic p-0 m-0 -ml-1"
                style={{ fontFamily: '"Comic Sans MS", "cursive", sans-serif', ...lineStyles }}
                aria-label={`Edit ${title}`}
                rows={5}
              />
              <button
                onClick={handleSave}
                className="self-start mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              {/* Render Todo List */}
              {type === 'todo' && (
                <ul className="relative z-10 space-y-0 text-blue-600 text-base font-medium font-serif italic" style={{ fontFamily: '"Comic Sans MS", "cursive", sans-serif' }}>
                  {todoItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center py-1 border-b border-blue-100 cursor-pointer group"
                      style={{ lineHeight: lineHeight, paddingBottom: '1px' }}
                      onClick={() => handleToggleTodo(item.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggleTodo(item.id); } }}
                      tabIndex={0}
                      aria-label={`${item.text}, Status: ${item.completed ? 'Completed' : 'Incomplete'}. Click to toggle.`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        tabIndex={-1}
                        className="mr-2 accent-blue-300 pointer-events-none shrink-0"
                        aria-hidden="true"
                      />
                      <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Render Simple List */}
              {type !== 'todo' && (
                <ul className="relative z-10 space-y-0 text-blue-600 text-base font-medium font-serif italic -ml-1" style={{ fontFamily: '"Comic Sans MS", "cursive", sans-serif' }}>
                  {itemsArray.map((item, index) => (
                    <li key={index} className="border-b border-blue-100" style={{ lineHeight: lineHeight, paddingBottom: '1px' }}>
                      {item.startsWith('-') ? item : `- ${item}`}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Ellipsis / Edit Trigger */}
        {!isEditing && (
          <p
            onClick={handleToggleEdit}
            onKeyDown={handleEllipsisKeyDown}
            className="text-blue-600 text-lg font-bold self-start -ml-1 mt-auto leading-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1"
            style={{ fontFamily: '"Comic Sans MS", "cursive", sans-serif' }}
            aria-label={`Edit ${title}`}
            tabIndex={0}
          >
            ...
          </p>
        )}
      </div>
    </div>
  );
};

export default NotesWidget; 