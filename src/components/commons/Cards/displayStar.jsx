import React, { Fragment } from "react";
import PropTypes from "prop-types";
import icons from '@fortawesome/fontawesome-free-solid';
import FontAwesome from '../utilities/FontAwesome';

const faStarSolid = icons.faStar;

export default function DisplayStar({ averageRating }) {
  const createStars = (averageRating) => {
    let blackStar = Math.round(Number(averageRating, 10)) || 0;
    const stars = [];
    for(let i = 0; i < 5; i++) {
      stars.push(<FontAwesome key={i} type={(blackStar < 1) ? undefined : faStarSolid} />);
      blackStar--;
    }
    return stars;
  }

  return (
    <Fragment>
      {createStars(averageRating)}
    </Fragment>
  );
}

DisplayStar.propTypes = {
  averageRating: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};
