import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Preloader from '../commons/Preloader';

/**
 * @function AuthorizeProfile
 * @param {object} props
 * @return {JSX} - MyComponent|Preloader|Redirect
 */
const AuthorizeProfile = (props) => {
  const {
      MyComponent,
      loading,
      profile,
      user,
      location
  } = props;
  const { match: { params: { username } } } = props;

  return (
    <Fragment>
      {loading && (
        <div className="">
          <Preloader
            type="page"
            styles="ThreeDots"
            height={80}
            width={80}
            color="blue"
          />
        </div>
      )
    }
      {!loading && profile.userId === user.id && <MyComponent {...props} />}
      {!loading && profile.userId !== user.id && (
        <Redirect
          to={{ pathname: `/profile/${username}`, state: { from: location } }}
        />
      )}
    </Fragment>
  );
};

AuthorizeProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]).isRequired,
  profile: PropTypes.shape({
    userId: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  loading: PropTypes.bool,
  MyComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object
  ]).isRequired
};

AuthorizeProfile.defaultProps = {
  loading: true
}

export default AuthorizeProfile;
