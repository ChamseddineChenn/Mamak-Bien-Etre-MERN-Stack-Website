import React from 'react';

const SearchBar = ({ value, onSearch, onClear }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger search with current value
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by order ID, name, or phone..."
          className="flex-1 px-4 py-2 border border-[#A6A58A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484]"
          value={value}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-[#A6A58A] hover:bg-[#8A8970] text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={!value}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            value
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
