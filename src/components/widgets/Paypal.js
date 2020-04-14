import React from 'react';

const Paypal = () => (
  <div>
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
      <input type="hidden" name="cmd" value="_s-xclick" />
      <input type="hidden" name="hosted_button_id" value="R3CP5YH5XJPUE" />
      <input
        type="image"
        src="images/donate-button.png"
        name="submit"
        alt="PayPal - The safer, easier way to pay online!"
        width="100%"
      />
      <img
        alt=""
        src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
  </div>
);

export default Paypal;
