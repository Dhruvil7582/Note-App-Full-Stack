import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit3, Search, Plus, Save, Tag } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { title, content, category });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { title, content, category });
      }
      setTitle('');
      setContent('');
      setCategory('Personal');
      fetchNotes();
    } catch (err) {
      console.error("Error saving note", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category || 'Personal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Background: Deep Plum Black (#161216)
    <div className="min-h-screen bg-[#161216] text-[#D1C4D1] font-sans p-4 md:p-8 selection:bg-[#F3E5AB] selection:text-[#161216]">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 border-b border-[#2D262D] pb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#F3E5AB] tracking-tight">Royal Journal</h1>
            <p className="text-[#A494A4] text-sm mt-1">A rich workspace for your deep thoughts and ideas.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A494A4] group-focus-within:text-[#F3E5AB] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Filter by title or tag..."
              className="bg-[#1F1A1F] text-[#EBE4EB] border border-[#2D262D] rounded-xl py-2.5 pl-10 pr-4 w-full md:w-80 focus:outline-none focus:border-[#F3E5AB] transition-all placeholder:text-[#5E505E]"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Input Form Section - Surface Card: Dark Currant (#1F1A1F) */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSave} className="bg-[#1F1A1F] border border-[#2D262D] p-6 rounded-2xl sticky top-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <h2 className="text-lg font-medium text-[#F3E5AB] mb-6 flex items-center gap-2 border-b border-[#2D262D] pb-3">
                {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
                {editingId ? 'Modify Entry' : 'Create Entry'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#A494A4] block mb-1 font-medium">Title</label>
                  <input 
                    className="w-full bg-[#161216] text-[#EBE4EB] border border-[#2D262D] rounded-xl p-3 focus:border-[#F3E5AB] outline-none transition-colors placeholder:text-[#5E505E]"
                    placeholder="Give it a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#A494A4] block mb-1 font-medium">Category</label>
                  <select 
                    className="w-full bg-[#161216] text-[#EBE4EB] border border-[#2D262D] rounded-xl p-3 outline-none focus:border-[#F3E5AB] transition-colors cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Personal">🔑 Personal</option>
                    <option value="Work">💼 Work</option>
                    <option value="Ideas">💡 Ideas</option>
                    <option value="Tasks">🎯 Tasks</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#A494A4] block mb-1 font-medium">Content</label>
                  <textarea 
                    className="w-full bg-[#161216] text-[#EBE4EB] border border-[#2D262D] rounded-xl p-3 h-44 focus:border-[#F3E5AB] outline-none resize-none transition-colors placeholder:text-[#5E505E]"
                    placeholder="Spill your thoughts here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Accent Button: Champagne Gold (#F3E5AB) */}
                <button className="w-full bg-[#F3E5AB] hover:bg-[#E5D59A] text-[#161216] font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F3E5AB]/5 font-serif text-base">
                  <Save size={18} /> {editingId ? 'Update Entry' : 'Commit to Journal'}
                </button>
                
                {editingId && (
                  <button 
                    type="button"
                    onClick={() => { setEditingId(null); setTitle(''); setContent(''); setCategory('Personal'); }} 
                    className="w-full bg-transparent border border-[#2D262D] text-[#A494A4] py-2 rounded-xl hover:bg-[#161216] hover:text-[#EBE4EB] transition-all text-sm"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Notes Display Feed */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.length === 0 ? (
              <div className="col-span-full border border-dashed border-[#2D262D] rounded-2xl p-12 text-center text-[#5E505E]">
                No journal entries matching your criteria.
              </div>
            ) : (
              filteredNotes.map(note => (
                <div 
                  key={note._id} 
                  className="bg-[#1F1A1F] border border-[#2D262D] p-6 rounded-2xl hover:border-[#F3E5AB]/40 transition-all duration-300 group relative flex flex-col justify-between shadow-md hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      {/* Tag label */}
                      <span className="text-[10px] uppercase tracking-widest bg-[#161216] text-[#F3E5AB] px-2.5 py-1 rounded-md border border-[#F3E5AB]/10 flex items-center gap-1.5 font-medium">
                        <Tag size={10} /> {note.category || 'Personal'}
                      </span>
                      
                      {/* Management Controls */}
                      <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => startEdit(note)} 
                          className="p-1.5 hover:bg-[#161216] rounded-lg text-[#A494A4] hover:text-[#F3E5AB] transition-colors"
                          title="Edit Note"
                        >
                          <Edit3 size={15}/>
                        </button>
                        <button 
                          onClick={() => deleteNote(note._id)} 
                          className="p-1.5 hover:bg-red-950/20 rounded-lg text-[#A494A4] hover:text-red-400 transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 size={15}/>
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-serif font-bold text-[#EBE4EB] mb-2 leading-snug">{note.title}</h3>
                    <p className="text-[#A494A4] leading-relaxed text-sm whitespace-pre-wrap break-words">{note.content}</p>
                  </div>
                  
                  {/* Subtle date timestamp line if you want to track it */}
                  <div className="mt-6 pt-3 border-t border-[#2D262D]/40 text-[10px] text-[#5E505E] flex justify-end">
                    {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Archived'}
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;