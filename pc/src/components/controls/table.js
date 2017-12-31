import React from 'react';
import { Table} from 'antd';


class EditableTable extends React.Component {
    render() {
        const { data,columns } = this.props;
        return (
            <div>
                <Table columns={columns} dataSource={data} bordered />
            </div>
        );
    }
}

export default EditableTable;
