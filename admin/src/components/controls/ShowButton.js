import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';

const ShowButton = ({
    basePath = '',
    label = 'aor.action.show',
    record = {},
}) => (
    <FlatButton
        primary
        label={'查看'}
        containerElement={
            <Link to={`${basePath}/${record.id}/show`} />
        }
        style={{ overflow: 'inherit' }}
    />
);

ShowButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
};

const enhance = compose(
    shouldUpdate(
        (props, nextProps) =>
            (props.record &&
                nextProps.record &&
                props.record.id !== nextProps.record.id) ||
            props.basePath !== nextProps.basePath ||
            (props.record == null && nextProps.record != null)
    ),
);

export default enhance(ShowButton);
