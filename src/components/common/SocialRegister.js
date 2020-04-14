import React from 'react';

const SocialRegister = () => (
  <div className="omb_login">
    <div className="row omb_row-sm-offset-3 omb_socialButtons">
      <div className="col-xs-4 col-sm-2">
        <button
          className="btn btn-lg btn-block omb_btn-facebook"
        >
          <i className="fa fa-facebook visible-xs" />
          <span className="hidden-xs">Facebook</span>
        </button>
      </div>
      <div className="col-xs-4 col-sm-2">
        <button
          href="#"
          className="btn btn-lg btn-block omb_btn-twitter"
        >
          <i className="fa fa-twitter visible-xs" />
          <span className="hidden-xs">Twitter</span>
        </button>
      </div>
      <div className="col-xs-4 col-sm-2">
        <button
          href="#"
          className="btn btn-lg btn-block omb_btn-google"
        >
          <i className="fa fa-google-plus visible-xs" />
          <span className="hidden-xs">Google+</span>
        </button>
      </div>
    </div>
  </div>
);
export default SocialRegister;
