import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { getStoredTypes, saveTypes } from '../utils/taskTypes';

const colorOptions = [
  { name: 'Red', class: 'bg-red-100' },
  { name: 'Pink', class: 'bg-pink-100' },
  { name: 'Purple', class: 'bg-purple-100' },
  { name: 'Deep Purple', class: 'bg-indigo-100' },
  { name: 'Blue', class: 'bg-blue-100' },
  { name: 'Light Blue', class: 'bg-sky-100' },
  { name: 'Cyan', class: 'bg-cyan-100' },
  { name: 'Teal', class: 'bg-teal-100' },
  { name: 'Green', class: 'bg-green-100' },
  { name: 'Light Green', class: 'bg-lime-100' },
  { name: 'Yellow', class: 'bg-yellow-100' },
  { name: 'Amber', class: 'bg-amber-100' },
  { name: 'Orange', class: 'bg-orange-100' },
  { name: 'Deep Orange', class: 'bg-red-200' },
  { name: 'Brown', class: 'bg-amber-200' },
  { name: 'Grey', class: 'bg-gray-200' },
];

const EditTypesModal = ({ isOpen, onClose, onSave }) => {
  const [types, setTypes] = useState(getStoredTypes());
  const [activeTab, setActiveTab] = useState('tasks');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState(colorOptions[0].class);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTypes(getStoredTypes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (typeId, field) => {
    const updatedTypes = types.map(type =>
      type.id === typeId ? { ...type, [field]: !type[field] } : type
    );
    setTypes(updatedTypes);
  };

  const handleNameChange = (typeId, newName) => {
    const updatedTypes = types.map(type =>
      type.id === typeId ? { ...type, name: newName } : type
    );
    setTypes(updatedTypes);
  };

  const handleColorChange = (typeId, newColor) => {
    const updatedTypes = types.map(type =>
      type.id === typeId ? { ...type, color: newColor } : type
    );
    setTypes(updatedTypes);
    setIsColorPickerOpen(false);
  };

  const handleAddNewType = () => {
    if (newTypeName.trim()) {
      const newType = {
        id: Date.now(),
        name: newTypeName.trim(),
        color: newTypeColor,
        tasks: true,
        events: false,
      };
      setTypes([...types, newType]);
      setNewTypeName('');
      setNewTypeColor(colorOptions[0].class);
    }
  };

  const handleSave = () => {
    saveTypes(types);
    onSave(types);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Edit types</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="flex space-x-4 mb-6 border-b">
            <div className="text-gray-500 pb-2 px-2">Display in</div>
            <button
              className={`pb-2 px-2 ${activeTab === 'tasks' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {types.map(type => (
              <div key={type.id} className="flex items-center">
                <div className="relative">
                  <div
                    className={`w-5 h-5 rounded ${type.color} mr-3 cursor-pointer`}
                    onClick={() => {
                      setIsColorPickerOpen(type.id);
                    }}
                  />
                  {isColorPickerOpen === type.id && (
                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <div
                          key={color.name}
                          className={`w-6 h-6 rounded ${color.class} cursor-pointer flex items-center justify-center`}
                          onClick={() => {
                            handleColorChange(type.id, color.class);
                            setIsColorPickerOpen(false);
                          }}
                        >
                          {color.class === type.color && <Check className="w-4 h-4 text-gray-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => handleNameChange(type.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-8 ml-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={type.tasks}
                      onChange={() => handleToggle(type.id, 'tasks')}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="New type name"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <div
                className={`w-8 h-8 rounded ${newTypeColor} cursor-pointer`}
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              />
              {isColorPickerOpen && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <div
                      key={color.name}
                      className={`w-6 h-6 rounded ${color.class} cursor-pointer flex items-center justify-center`}
                      onClick={() => {
                        setNewTypeColor(color.class);
                        setIsColorPickerOpen(false);
                      }}
                    >
                      {color.class === newTypeColor && <Check className="w-4 h-4 text-gray-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleAddNewType}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTypesModal;

