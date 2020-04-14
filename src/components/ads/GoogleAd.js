import React from 'react';
import PropTypes from 'prop-types';

class GoogleAd extends React.Component {
  static PUB_ID = 'ca-pub-4052836596196505';
  static LARGE_RECTANGLE = 'large_rectangle';
  static BANNER = 'banner';
  static LEADER_BOARD = 'leader_board';
  static WIDE_SKY_SCRAPPER = 'wide_sky_scrapper';
  static LINK_AD = 'link_ad';

  static propTypes = {
    type: PropTypes.string.isRequired,
    style: PropTypes.object,
  };
  static defaultProps = {
    style: {},
  };

  static getAdFormat(type) {
    const ad = {
      width: null,
      height: null,
      slot: null,
    };

    if (type === GoogleAd.LARGE_RECTANGLE) {
      ad.width = '336px';
      ad.height = '280px';
      ad.slot = '7501584503';
    } else if (type === GoogleAd.BANNER) {
      ad.width = '468px';
      ad.height = '60px';
      ad.slot = '8101746509';
    } else if (type === GoogleAd.WIDE_SKY_SCRAPPER) {
      ad.width = '160px';
      ad.height = '600px';
      ad.slot = '3392345307';
    } else if (type === GoogleAd.LEADER_BOARD) {
      ad.width = '728px';
      ad.height = '90px';
      ad.slot = '3647372338';
    } else if (type === GoogleAd.LINK_AD) {
      ad.width = '728px';
      ad.height = '15px';
      ad.slot = '8369974762';
    }
    return ad;
  }

  constructor() {
    super();
    this.ad = {};
  }

  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    const { height, width, slot } = GoogleAd.getAdFormat(this.props.type);
    return (
      <ins
        className="adsbygoogle"
        style={{
          display: 'inline-block',
          width,
          height,
          ...this.props.style,
        }}
        data-ad-client={GoogleAd.PUB_ID}
        data-ad-slot={slot}
      />
    );
  }
}

export default GoogleAd;
