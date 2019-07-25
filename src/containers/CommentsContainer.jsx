import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Footer from '@components/commons/utilities/Footer';
import CommentCard from '../components/commons/Cards/CommentCard';
import CreateCommentCard from '../components/commons/Cards/CreateCommentCard';
import { getComments, postComment, delComment, likeComment, unlikeComment } from '../actions/comments';
import formatDate from '../components/commons/utilities/helpers'

/**
 *
 * Container component for the adding and viewing commments
 * @export
 * @class CommentsContainer
 * @extends {Component}
 */
export class CommentsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      userLike: false,
      errors: {}
    }
    const { slug } = this.props;
    const { getComments: loadComments } = this.props;
    loadComments(slug);
  }

  validate = () => {
    let isError = false
    let { comment, errors } = this.state;

    if (comment.length < 5 || comment.length > 500) {
      isError = true;
      errors.commentError = 'Comment must be between 5 - 500 characters'
    }

    this.setState((prevState) => ({
      ...prevState,
      ...errors
    }))

    return isError;
  }

  /**
   *
   * Handle posting of comments
   * @memberof CommentsContainer
   */
  onSubmit = (e) => {
    e.preventDefault();
    const { slug } = this.props;
    const err = this.validate();
    if (!err) {
      const { comment } = this.state;
      const { postComment } = this.props;
      const newComment = { comment }
      postComment(newComment, slug);
      this.clearComment();
    }
  }

  /**
   *
   * Bind the local state to changes on comment textarea
   * @memberof CommentsContainer
   */
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  /**
   *
   * Creates a comment listing
   * @memberof CommentsContainer
   */
  createCommentListings = (comments) => {
    const { user } = this.props;
    let userLike = false;

    const data = comments && comments.map(comment => {
      const date = formatDate(comment.createdAt);
      if (comment.CommentLikes.filter(like => like.userId === user.id).length > 0) {
        userLike = !userLike;
      }

      return (
        <CommentCard
          key={comment.id}
          name={comment.author.username}
          alt={comment.author.username}
          body={comment.body}
          avatar={comment.author.profile.avatar}
          createdAt={date.long}
          likes={comment.CommentLikes.length}
          userLike={userLike}
          like={() => this.handleLikes(comment.id)}
          del={() => this.deleteComment(comment.id)}
        />
      );
    });

    return data;
  }

  /**
   *
   * Clear comment textarea
   * @memberof CommentsContainer
   */
  clearComment = () => {
    this.setState({
      comment: '',
      errors: {}
    });
  }

  /**
   *
   * Delete a comment
   * @memberof CommentsContainer
   */
  deleteComment(id) {
    const { slug } = this.props;
    const { delComment } = this.props;
    delComment(id, slug);
  }

  /**
   *
   * Handle like/unlike logic
   * @param {*} id of the comment
   * @memberof CommentsContainer
   */
  handleLikes(id) {
    const { slug } = this.props;
    const { likeComment, unlikeComment, user, comments } = this.props;

    const userId = user.id;

    const comment = comments.filter(comment => comment.id === id);
    const { CommentLikes } = comment[0];

    if (CommentLikes.filter(like => like.userId === userId).length > 0) {
      unlikeComment(id, slug);
    } else {
      likeComment(id, slug);
    }
  }

  render() {
    const { comments, user, profile: { avatar } } = this.props;
    const { comment, errors } = this.state;

    const data = this.createCommentListings(comments);

    return (
      <Fragment>
        <CreateCommentCard
          name={user.username}
          avatar={
            avatar ||
            "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
          }
          onChange={this.onChange}
          submit={this.onSubmit}
          reset={this.clearComment}
          value={comment}
          commentError={errors.commentError}
        />
        {data}
        <Footer />
      </Fragment>
    );
  }
}

CommentsContainer.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
  }).isRequired,
  slug: PropTypes.string.isRequired,
  getComments: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  delComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  unlikeComment: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  comments: state.comments.comments,
  user: state.auth.user,
  profile: state.auth.profile
});

export default connect(mapStateToProps, { getComments, postComment, delComment, likeComment, unlikeComment })(withRouter(CommentsContainer));
