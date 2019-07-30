import React from 'react';
import Loader from 'react-loader-spinner';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';


function Preloader(props) {
  const { type, styles, height, width, color } = props;
  const className = classNames({
    'h-screen w-full relative flex flex-col items-center justify-center bg-teal-lightest font-sans': type === 'page',
    '': type === 'button'
  });

  return (
    <div className={className}>
      <Loader type={styles} height={height} width={width} color={color} className={classNames('text-center mx-auto z-10', { 'h-screen w-full absolute flex items-center justify-center': type === 'page' })} />
    </div>
  );
}

Preloader.propTypes = {
  type: PropTypes.string,
  styles: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

Preloader.defaultProps = {
  type: null,
  styles: null,
  height: null,
  width: null,
  color: null
};

export default Preloader;
