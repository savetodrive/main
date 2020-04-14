import React from 'react';
import { Container, Message } from 'semantic-ui-react';

const Description = () => (
  <Container fluid className="mt-2">
    <Message size="tiny">
      <Message.Header size="small" as="h4">
        Some key points:
      </Message.Header>
      <Message.List size="tiny">
        <Message.Item>
          If a url is too long and there is an error, please shorten the link.
          You can <a href="https://bit.ly"> Click Here to Shorten.</a>
        </Message.Item>
        <Message.Item>
          If you don&apos;t see any response, then Authenticate once again.
        </Message.Item>
        <Message.Item>
          Though, we have access to your files, we do not have any right to
          touch any of your private files and do not either. The files are only
          uploaded to your drives.
        </Message.Item>
        <Message.Item>
          Once the uploading has started, you can close the tab and forget about
          it, the file will continue to upload but you will not see any upload
          status the next time you visit this page.
        </Message.Item>
      </Message.List>
    </Message>
    <Message size="tiny">
      <Message.Header size="tiny" as="h2">
        Save web files to cloud with SaveToDrive.
      </Message.Header>
      <p>
        Save any files from the internet to your favourite cloud storage service
        without having to download it to your computer and re-upload it. You can
        download any large ,small and big size files from web and within few
        minutes it will be on your drive.
      </p>
      <p>
        Email notification is also available with progress report of upload
        progress.
      </p>
      <p>
        Just enter the files web address (or URL), pick a cloud service and,
        within seconds, the file will become available in your online account.
      </p>
      <p>
        The download is from cloud to cloud and therefore much faster.
        Savetodrive is also useful for mobile users as you can remotely download
        files, including file types that aren&apos;t supported by your mobile
        phone or tablets, to your mobile devices via your favourite cloud
        storage service.
      </p>
      <p>
        Feel free to message us on &nbsp;
        <a href="https://facebook.com/savetodrive">Facebook</a>
        &nbsp;or&nbsp;
        <a href="https://twitter.com/savetodrive">Twitter</a>
        &nbsp; for feedback or bug.
      </p>
    </Message>
  </Container>
);

export default Description;
