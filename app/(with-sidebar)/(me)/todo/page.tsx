"use client";

import { useState, useEffect } from "react";
import { Plus, Check, X, Edit, Save, Trash } from "lucide-react";

export default function TodoPage() {
  const [mounted, setMounted] = useState(false);
  const [todos, setTodos] = useState([
    { id: "1", text: "Create a personal timeline page", completed: false },
    { id: "2", text: "Add dark mode toggle with beautiful transition", completed: true },
    { id: "3", text: "Design custom illustrations for the homepage", completed: false },
    { id: "4", text: "Fix mobile navigation menu responsiveness", completed: false },
    { id: "5", text: "Write 'My Creative Process' article", completed: false },
  ]);
  
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const addTodo = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    
    const todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, todo]);
    setNewTodo("");
  };
  
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const startEditing = (todo: { id: any; text: any; completed?: boolean; }) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };
  
  const saveEdit = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container max-w-2xl py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Website Todo List</h1>
        <p className="text-muted-foreground">
          Things I want to add to my digital garden
        </p>
      </div>
      
      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="w-full p-2 rounded-md border border-border bg-background focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium p-2 rounded-md flex items-center justify-center"
          aria-label="Add task"
        >
          <Plus size={18} />
        </button>
      </form>
      
      {/* Todo List */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="p-4 text-center border border-dashed rounded-md">
            <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={`p-3 rounded-md border ${
                todo.completed 
                  ? 'bg-accent/5 border-accent/10' 
                  : 'bg-card border-border'
              } flex items-center gap-2`}
            >
              <button
                onClick={() => toggleComplete(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-md border ${
                  todo.completed 
                    ? 'bg-accent text-accent-foreground border-accent' 
                    : 'border-border'
                } flex items-center justify-center`}
                aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {todo.completed && <Check size={12} />}
              </button>
              
              {editingId === todo.id ? (
                <div className="flex-grow flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow p-1 rounded-md border border-border bg-background focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="p-1 rounded-md bg-accent text-accent-foreground"
                    aria-label="Save edit"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 rounded-md bg-muted"
                    aria-label="Cancel edit"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span className={`flex-grow ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.text}
                  </span>
                  
                  <div className="flex-shrink-0 flex items-center">
                    <button
                      onClick={() => startEditing(todo)}
                      className="p-1 rounded-md hover:bg-muted"
                      aria-label="Edit task"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 rounded-md hover:bg-muted text-destructive hover:text-destructive"
                      aria-label="Delete task"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      {todos.length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground">
          <p>{todos.filter(t => t.completed).length} of {todos.length} tasks completed</p>
        </div>
      )}
    </div>
  );
}