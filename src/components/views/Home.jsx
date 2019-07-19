import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '@components/commons/Header';
import NavBar from '@components/commons/NavBar';
import ArticleCard from '@components/commons/Cards/Article';
import fetchArticles from '@actions/articles';
import Preloader from '@components/commons/Preloader';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { fetchArticles } = this.props;
    fetchArticles();
  }

  displaySmallArticle = (article, stretch) => {
    return (
      <ArticleCard
        key={article.id}
        isSmall
        article={article}
        stretch={stretch}
      />
    );
  };

  displayBigArticle = article => {
    return (
      <ArticleCard
        key={Math.random().toString()}
        isSmall={false}
        article={article}
      />
    );
  };

  render() {
    const { user, profile, isAuthenticated, articles, isLoading } = this.props;

    const mainArticle = articles.splice(0, 1);
    const subArticles = articles.splice(0, 3);
    const remainingArticles = articles;

    return (
      <div className='bg-gray-100 font-sans w-full min-h-screen m-0'>
        <Header
          user={{ user: { ...user, isAuthenticated } }}
          profile={profile}
        />
        <NavBar />
        {isLoading ? (
          <Preloader
            type='page'
            height={100}
            width={100}
            styles='TailSpin'
            color='blue'
          />
        ) : (
          ''
        )}
        <div className='container mx-auto mt-6 p-4'>
          <div className='flex flex-col md:flex-row max-h-lg'>
            <div>
              {mainArticle.length > 0
                ? this.displayBigArticle(mainArticle[0])
                : ''}
            </div>
            <div className='md:pl-16 flex flex-col justify-around'>
              {subArticles.map(article =>
                this.displaySmallArticle(article, true)
              )}
            </div>
          </div>

          <div className='flex flex-wrap'>
            {remainingArticles.map(article =>
              this.displaySmallArticle(article)
            )}
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  user: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({}).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errors: PropTypes.shape({}).isRequired,
  fetchArticles: PropTypes.func.isRequired,
  articles: PropTypes.shape([]).isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  errors: state.auth.errors,
  articles: state.article.articles,
  isLoading: state.article.isLoading
});

export default connect(
  mapStateToProps,
  { fetchArticles }
)(Home);
