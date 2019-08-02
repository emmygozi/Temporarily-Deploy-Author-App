import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Pagelayout from '@components/layout/PageLayout';
import Button from '@components/commons/utilities/Button';
import PropTypes from 'prop-types';
import Footer from '@components/commons/utilities/Footer';
import { updateProfile } from '@actions/profile';
import './Profile.scss';
import { toast } from 'react-toastify';

const instance = axios.create({
  headers: {}
});

class EditProfile extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    const { profile } = this.props;
    const { bio, phone, firstname, lastname, location } = profile;
    this.avatarDefault = 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png';
    this.state = {
      avatar: !profile.avatar ? this.avatarDefault : profile.avatar,
      bio,
      phone,
      firstname,
      lastname,
      location,
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  uploadImageCallBack = (file) => {
    const url = 'https://api.cloudinary.com/v1_1/druxgvyx3/image/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'politico');
    return instance.post(url, formData, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
  };

  uploadImage = (e) => {
    const file = e.target.files[0];
    this.uploadImageCallBack(file).then((result, error) => {
        this.setState({
            avatar: result.data.secure_url
        });
        if (result.data.url) {
            return result.data.url;
        } else {
          toast.error('Error in Input');
        }
    });
  }

  updateArticle = () => {
    const { updateProfile } = this.props;
    const { firstname, lastname, avatar, bio, location, phone } = this.state;
    const values = {
      firstname,
      lastname,
      avatar,
      bio,
      location,
      phone
    };
    updateProfile(values);
  }

  render() {
    const { firstname, lastname, bio, avatar, phone, location } = this.state;

    return (
      <Pagelayout>
        <div className="mt-12 profile-container mx-auto">
          <div className="flex flex-col lg:flex-row md:flex-row items-center lg:justify-start md:justify-start justify-center text-center">
            <div className="relative">
              <img src={avatar} alt="gravtar" className="w-32 h-32 rounded-full box-shadow" />
              <input type="file" name="avatar" className="hidden image-avatar" id="imageUpload" accept="image/*" onChange={this.uploadImage} />
              <label htmlFor="imageUpload" className="upload-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                  style={{ fill: '#ffffff', marginTop: '8px' }}
                >
                  <g id="surface1">
                    <path style={{ marginTop: '5px' }} d="M 24.375 4 C 22.472656 4 20.699219 5.414063 19.9375 7.375 L 19.3125 9 L 14 9 L 14 8 C 14 7.449219 13.550781 7 13 7 L 6 7 C 5.449219 7 5 7.449219 5 8 L 5 9.40625 C 2.136719 10.285156 0 12.859375 0 16 L 0 37 C 0 40.855469 3.144531 44 7 44 L 43 44 C 46.855469 44 50 40.855469 50 37 L 50 16 C 50 12.144531 46.855469 9 43 9 L 40.6875 9 L 40.0625 7.375 C 39.300781 5.414063 37.53125 4 35.625 4 Z M 24.375 6 L 35.625 6 C 36.390625 6 37.710938 6.867188 38.1875 8.09375 L 39.0625 10.375 C 39.214844 10.757813 39.589844 11.003906 40 11 L 43 11 C 45.773438 11 48 13.226563 48 16 L 48 37 C 48 39.773438 45.773438 42 43 42 L 7 42 C 4.226563 42 2 39.773438 2 37 L 2 16 C 2 13.511719 3.792969 11.460938 6.15625 11.0625 C 6.636719 10.988281 6.992188 10.578125 7 10.09375 L 7 9 L 12 9 L 12 10 C 12 10.550781 12.449219 11 13 11 L 20 11 C 20.410156 11.003906 20.785156 10.757813 20.9375 10.375 L 21.8125 8.09375 C 22.289063 6.867188 23.609375 6 24.375 6 Z M 30 13 C 22.835938 13 17 18.835938 17 26 C 17 33.164063 22.835938 39 30 39 C 37.164063 39 43 33.164063 43 26 C 43 18.835938 37.164063 13 30 13 Z M 7 14 C 5.894531 14 5 14.894531 5 16 C 5 17.105469 5.894531 18 7 18 C 8.105469 18 9 17.105469 9 16 C 9 14.894531 8.105469 14 7 14 Z M 30 15 C 36.085938 15 41 19.914063 41 26 C 41 32.085938 36.085938 37 30 37 C 23.914063 37 19 32.085938 19 26 C 19 19.914063 23.914063 15 30 15 Z " />
                  </g>
                </svg>
              </label>
            </div>
          </div>

          <h3 className="uppercase text-xl font-normal font-semibold my-4">Profile</h3>
          <div className="mt-4 profile-form">
            <form className="flex flex-col w-full" onSubmit={this.updateArticle}>
              <div className="my-4 relative mb-8 no-effect uppercase">
                <label htmlFor="firstname" className="mb-16 text-sm">Firstname</label>

                <input
                  id={firstname}
                  type="text"
                  name="firstname"
                  className="w-full py-2 border-gray-600 border-b-2 outline-none"
                  value={firstname}
                  onChange={this.handleChange}
                  error=""
                />
                <div className="text-red-600 text-xs text-left mt-1" />
              </div>
              <div className="my-4 relative mb-8 no-effect uppercase">
                <label htmlFor="lastname" className="mb-16 text-sm">Firstname</label>

                <input
                  id={lastname}
                  type="text"
                  name="lastname"
                  className="w-full py-2 border-gray-600 border-b-2 outline-none"
                  value={lastname}
                  onChange={this.handleChange}
                  error=""
                />
                <div className="text-red-600 text-xs text-left mt-1" />
              </div>
              <div className="my-4 relative mb-8 no-effect uppercase">
                <label htmlFor="phone" className="mb-16 text-sm">Phone</label>

                <input
                  id={phone}
                  type="tel"
                  name="phone"
                  className="w-full py-2 border-gray-600 border-b-2 outline-none"
                  value={phone}
                  onChange={this.handleChange}
                  error=""
                />
                <div className="text-red-600 text-xs text-left mt-1" />
              </div>
              <div className="my-4 relative mb-8 no-effect uppercase">
                <label htmlFor="location" className="mb-16 text-sm">Location</label>

                <input
                  id={location}
                  type="text"
                  name="location"
                  className="w-full py-2 border-gray-600 border-b-2 outline-none"
                  value={location}
                  onChange={this.handleChange}
                  error=""
                />
                <div className="text-red-600 text-xs text-left mt-1" />
              </div>

              <div className="my-4">
                <textarea name="bio" value={bio} onChange={this.handleChange} rows={3} placeholder="Enter a short Bio here" className="w-full resize-none border-none" />
              </div>

              <div className="flex justify-center">
                <Button type="outline" color="blue" className="hover:border-blue-700 hover:text-blue-700 border border-gray-300 px-4 py-2 rounded mr-8">Edit</Button>
                <Button type="outline" color="red" className="hover:border-red-700 hover:text-red-700 border border-gray-300 px-4 py-2 rounded">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12">
          <Footer />
        </div>
      </Pagelayout>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile.profile,
  loading: state.profile.loading
});

export default connect(mapStateToProps, { updateProfile })(withRouter(EditProfile));
