import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <div className="search">
        <div>
          <img src="/public/images/search.svg" alt="" />

          <input
            type="text"
            placeholder="search through thouse of movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
