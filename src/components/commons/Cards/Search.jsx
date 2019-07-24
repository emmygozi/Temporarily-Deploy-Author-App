import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export function Search({ title, body, name, searchClass, createdAt, slug }) {
  return (
    <Link to={`/article/${slug}`}>
      <div className='searchItem' role='presentation'>
        <div className={searchClass}>
          <p className='text-sm md:text-lg lg:text-xl font-bold mb-2'>
            {title}
          </p>
          <p className='text-gray-700 text-xs md:text-sm lg:text-base mb-2'>
            {body}
          </p>
          <p className='text-gray-600 text-xs'>{`${name} ${createdAt}`}</p>
        </div>
      </div>
    </Link>
  );
}

Search.propTypes = {
  name: PropTypes.string,
  body: PropTypes.string,
  title: PropTypes.string,
  searchClass: PropTypes.string,
  createdAt: PropTypes.string
};

Search.defaultProps = {
  title: "Top On Author's Haven",
  body:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque.',
  searchClass: 'px-6 py-4 border hover:bg-gray-300',
  name: 'Jonathan Reinink',
  createdAt: 'Aug 18 2018'
};

export default Search;
