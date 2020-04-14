import React from 'react';

const UploadCard = () => (
  <div className="col-md-12 uploadCard">
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <a className="nav-link active" href="#google">Google Drive</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#onecloud">OneCloud</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#dropbox">DropBox</a>
      </li>
    </ul>
    <div className="tab-content">
      <div className="tab-pane active" id="google" role="tabpanel">
        <section className="card border-0">
          <div className="card-block p-2">
            <div className="row no-gutters">
              <ul className="list-group w-100">
                <li className="list-group-item sd-form__progress">
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <div className="media w-100">
                    <img
                      className="d-flex mr-3"
                      src="..."
                      alt="Generic placeholder"
                      style={{ width: '64px', height: '64px' }}
                    />
                    <div className="media-body">
                      <h6 className="mt-0">Khatri ko Chhatri</h6>
                      <p className="small text-muted mb-2">
                        <span className="text-muted mr-2">File Size: 2GB</span>
                        <span className="text-muted">File Type: .mkv</span>
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: '25%' }}
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>

                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <div className="tab-pane" id="onecloud" role="tabpanel">...</div>
      <div className="tab-pane" id="dropbox" role="tabpanel">...</div>
    </div>
  </div>
);

export default UploadCard;
