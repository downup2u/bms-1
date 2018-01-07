import React from 'react';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionBack from 'material-ui/svg-icons/navigation/arrow-back';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { ListButton, DeleteButton } from 'admin-on-rest';
const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const CreateActions = ({ basePath, data, refresh }) => (
    <CardActions style={cardActionStyle}>
      <FlatButton
        primary
        label="返回"
        icon={<ActionBack />}
        containerElement={<Link to={basePath} />}
        style={{ overflow: 'inherit' }} />
    </CardActions>
);

const EditActions = ({ basePath, data, refresh }) => (
    <CardActions style={cardActionStyle}>
      <FlatButton
        primary
        label="返回"
        icon={<ActionBack />}
        containerElement={<Link to={basePath} />}
        style={{ overflow: 'inherit' }} />
        {_.get(data,'systemflag',0) === 0 ?<DeleteButton basePath={basePath} record={data} />:null}
        <FlatButton primary label="刷新" onClick={refresh} icon={<NavigationRefresh />} />
    </CardActions>
);

const ShowActions = ({ basePath, data, refresh }) => (
    <CardActions style={cardActionStyle}>
      <FlatButton
        primary
        label="返回"
        icon={<ActionBack />}
        containerElement={<Link to={basePath} />}
        style={{ overflow: 'inherit' }} />
        <FlatButton primary label="刷新" onClick={refresh} icon={<NavigationRefresh />} />
    </CardActions>
);

export {CreateActions,EditActions,ShowActions};
