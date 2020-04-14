import React from 'react';
import renderIf from 'render-if';
import { Label } from 'semantic-ui-react';

export default ({ error }) => renderIf(error && error.length)(<Label basic color="red" pointing>{ error } </Label>);
