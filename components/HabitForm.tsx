import React, { useState, useEffect } from 'react';
import { Habit } from '../types';

interface HabitFormProps {
  habitToEdit?: Habit | null;
  onSave: (habitData: Habit | Omit<Habit, 'id'>) => void;
  onCancel: () => void;
}

const inputBaseClasses = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary focus:border-transparent placeholder-subtle-light dark:placeholder-subtle-dark";

const HabitForm: React.FC<HabitFormProps> = ({ habitToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    time: '',
    category: 'Biohacking' as 'Biohacking' | 'Clinically Proven',
    icon: 'task_alt',
  });

  useEffect(() => {
    if (habitToEdit) {
      setFormData({
        name: habitToEdit.name,
        description: habitToEdit.description,
        time: habitToEdit.time,
        category: habitToEdit.category,
        icon: habitToEdit.icon,
      });
    } else {
      // Reset for "add new" form
      setFormData({
        name: '',
        description: '',
        time: '',
        category: 'Biohacking',
        icon: 'task_alt',
      });
    }
  }, [habitToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.icon.trim()) {
        alert("Habit name and icon are required.");
        return;
    }
    if (habitToEdit) {
      onSave({ ...habitToEdit, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg animate-in zoom-in-95 duration-200 rounded-xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">
              {habitToEdit ? 'Edit Habit' : 'Add New Habit'}
            </h3>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Form Fields */}
            <div>
              <label htmlFor="name" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputBaseClasses} />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className={inputBaseClasses} />
            </div>
            <div>
              <label htmlFor="time" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Time</label>
              <input type="text" id="time" name="time" value={formData.time} onChange={handleChange} placeholder="e.g., Morning, after brushing" className={inputBaseClasses} />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Category</label>
                  <select id="category" name="category" value={formData.category} onChange={handleChange} className={inputBaseClasses}>
                    <option value="Biohacking">Biohacking</option>
                    <option value="Clinically Proven">Clinically Proven</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="icon" className="text-sm font-medium text-subtle-light dark:text-subtle-dark block mb-1">Icon Name</label>
                  <input type="text" id="icon" name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g., water_drop" required className={inputBaseClasses} />
                </div>
            </div>
            <p className="text-xs text-subtle-light dark:text-subtle-dark">Use any icon name from the <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Material Symbols</a> library.</p>
          </div>
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-b-xl border-t border-border-light dark:border-border-dark flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-foreground-light dark:text-foreground-dark bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:opacity-90 rounded-lg transition-colors">Save Habit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;