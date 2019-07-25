import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Preloader from '@components/commons/Preloader';
import Header from '@components/commons/Header';


function PageLayout(props) {
  const { children, user, profile, loading } = props;

  return (
    <Fragment>
      {!loading ? (
        <Fragment>
          <Header user={user} profile={profile} />
          
          { children }
        </Fragment>
      ) : (
        <Preloader
          type="page"
          styles="Triangle"
          width={80}
          height={80}
          color="blue"
        />
      )}
    </Fragment>
  );
}

PageLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ]).isRequired
}

const mapStateToProps = state => ({
  user: state.auth.user,
  profile: state.auth.profile,
  loading: state.article.loading
});

export default connect(mapStateToProps)(PageLayout);