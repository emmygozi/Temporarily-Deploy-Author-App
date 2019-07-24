import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { userActivated } from "@actions/auth";

class ActivateUser extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { location, userActivated, history } = this.props;
    const queryParams = queryString.parse(location.search);
    userActivated(queryParams, history);
  }

  render() {
    return <></>;
  }
}

ActivateUser.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  userActivated: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  isActivated: state.auth.isActivated
});

export default connect(
  mapStateToProps,
  { userActivated }
)(withRouter(ActivateUser));
