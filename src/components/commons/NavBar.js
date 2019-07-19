import React from 'react';
import './index.scss';

function NavBar() {
  return (
    <div className='rounded bg-blue-700'>
      <div className='container mx-auto max-w-6xl overflow-y-scroll'>
        <div className='flex items-center justify-center text-white h-full'>
          <ul className='mx-4'>
            <li className='flex items-center text-gray-400 h-12 text-sm uppercase capitalize'>
              <div to='/' className='active mx-3 text-white'>
                Home
              </div>
              <div className='mx-3'>Family</div>
              <div className='mx-3'>Andela</div>
              <div className='mx-3'>People</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
