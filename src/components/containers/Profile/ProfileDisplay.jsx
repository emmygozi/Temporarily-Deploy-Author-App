import React from 'react';
import PropTypes from 'prop-types';
import './Profile.scss';


export default function ProfileDisplay(props) {
  const { tab } = props;
  const displayTab = (tabname) => {
    return(
      <div className="flex justify-center items-center nav-result">
        {tabname}
      </div>
    )
  }

  switch(tab) {
    case 'Followers': 
    return displayTab('Followers');
    case 'Articles': 
      return (
        <div className="container mx-auto flex mt-4">
          Hello
        </div>
      );
    case 'Bookmarks': 
    return displayTab('no bookmarks');
    default:
      return displayTab('articles')
  }
}
ProfileDisplay.propTypes = {
  tab: PropTypes.string.isRequired
}
