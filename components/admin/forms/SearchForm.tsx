import React from 'react'
import Form from "next/form";
import SearchFormReset from '../SearchFormReset';

const SearchForm = () => {
  const query = "test";
  
  return (
    <Form action="/" scroll={false} className='search-form'>
      <input name='query' defaultValue="" className='search-input border-2' placeholder='search users, books by title, author, genre' />
      <div>
        {query && <SearchFormReset />}

      </div>
    </Form>
  )
}

export default SearchForm
