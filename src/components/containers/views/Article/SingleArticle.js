import { connect } from 'react-redux';
import SingleArticle from '@components/views/Article/SingleArticle';
import { getSingleArticle, getAllTags, updateRatings } from '@actions/articles';

const mapStateToProps = state => ({
  loading: state.article.loading,
  article: state.article.article,
  tags: state.article.tags,
  errors: state.article.errors,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  { getSingleArticle, getAllTags, updateRatings }
)(SingleArticle);
