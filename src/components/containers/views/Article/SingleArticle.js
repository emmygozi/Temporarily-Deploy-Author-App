import { connect } from 'react-redux';
import SingleArticle from '@components/views/Article/SingleArticle';
import { getSingleArticle, getAllTags, updateRatings, fetchRatings, fetchUserRating, likeArticle, unlikeArticle } from '@actions/articles';

const mapStateToProps = state => ({
  loading: state.article.loading,
  article: state.article.article,
  tags: state.article.tags,
  errors: state.article.errors,
  isAuthenticated: state.auth.isAuthenticated,
  rating: state.article.ratings,
  userRating: state.article.userRating,
  username: state.auth.user.username,
  user: state.auth.user,
  profile: state.auth.profile
});

export default connect(
  mapStateToProps,
  { getSingleArticle, getAllTags, updateRatings, fetchRatings, fetchUserRating, likeArticle, unlikeArticle }
)(SingleArticle);
