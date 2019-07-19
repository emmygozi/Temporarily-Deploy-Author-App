import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Footer from '@components/commons/utilities/Footer';
import CommentCard from '../commons/Cards/CommentCard';
import CreateCommentCard from '../commons/Cards/CreateCommentCard';
import { getComments, postComment, delComment, likeComment, unlikeComment } from '../../actions/comments';
import formatDate from '../commons/utilities/helpers'

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
      errors: {}
    }
  }

  componentDidMount() {
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
    const data = comments.map(comment => {
      const date = formatDate(comment.createdAt);
      return (
        <CommentCard
          key={comment.id}
          name={comment.author.username}
          alt={comment.author.username}
          body={comment.body}
          createdAt={date.long}
          likeCount={comment.likeCount}
          like={() => this.likeComment(comment.id)}
          unlike={() => this.unlikeComment(comment.id)}
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
   * Like a comment
   * @param {*} id of the comment to be liked
   * @memberof CommentsContainer
   */
  likeComment(id) {
    const { slug } = this.props;
    const { likeComment } = this.props;
    likeComment(id, slug);
  }

  /**
   *
   * Unlike a comment
   * @param {*} id of the comment to be unliked
   * @memberof CommentsContainer
   */
  unlikeComment(id) {
    const { unlikeComment } = this.props;
    unlikeComment(id);
  }

  render() {
    const { comments, user } = this.props;
    const { comment, errors } = this.state;

    const data = this.createCommentListings(comments);

    return (
      <Fragment>
        <CreateCommentCard
          name={user.username}
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
  unlikeComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  comments: state.comments.comments,
  user: state.auth.user 
});

export default connect(mapStateToProps, { getComments, postComment, delComment, likeComment, unlikeComment })(withRouter(CommentsContainer));
