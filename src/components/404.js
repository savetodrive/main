import React from 'react';
import { Grid } from 'semantic-ui-react';

const PAGE404 = () => (
  <section className="pt-10">
    <div className="ui container">
      <Grid.Row columns={1} centered>
        <Grid.Column computer={5} tablet={6} mobile={16}>

          <div className="wrapper row2">
            <div id="container" className="clear">
              <section id="fof" className="clear">
                <div className="hgroup clear">
                  <h1>404</h1>
                  <h2>Error ! <span>Page Not Found</span></h2>
                </div>
                <p>For Some Reason The Page You Requested Could Not Be Found On Our Server</p>
                <p><a href="/">&laquo; Go Back</a> / <a href="/">Go Home &raquo;</a></p>
              </section>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    </div>
  </section>
);

export default PAGE404;
