import React from 'react';
import PropTypes from 'prop-types';

export default function Alert({ alertTitle, alertBody }) {
  return (
    <div className="bg-red-100 text-sm text-red-600 px-4 py-2 mb-2 rounded relative" role="alert">
      <strong className="font-bold">{alertTitle}</strong>
      <span className="block sm:inline">{alertBody}</span>
    </div>
  )
}


Alert.propTypes = {
  alertTitle: PropTypes.string,
  alertBody: PropTypes.string.isRequired,
}

Alert.defaultProps = {
  alertTitle: '',
}
