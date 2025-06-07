import NotesWidget from '@/components/playground/NotesWidget';
import React from 'react';

const widgetConfigs = [
  { title: "Shopping List", type: "list", defaultContent: "- Bread\n- Chocolate\n- Milk" },
  { title: "To-do list", type: "todo", defaultContent: "- Finish report\n- Call Mom\n- Buy groceries" },
  { title: "Read List", type: "read", defaultContent: "- Atomic Habits\n- Sapiens\n- The Martian" },
  { title: "Movie List", type: "movie", defaultContent: "- Dune: Part Two\n- Oppenheimer\n- Barbie" },
] as const; // Use 'as const' for stricter typing of 'type'

const NotesWidgetPage: React.FC = () => {
  return (
    // Ensure page container scrolls if grid overflows
    
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="mb-1 text-xl font-medium">Note Widgets</h1>
        <p className="text-sm text-muted-foreground">Edit the notes by clicking on the 3 dots. Your entries are saved in your browser's local storage.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {widgetConfigs.map((config) => (
          <NotesWidget
            key={config.title}
            title={config.title}
            type={config.type}
            defaultContent={config.defaultContent}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesWidgetPage; 