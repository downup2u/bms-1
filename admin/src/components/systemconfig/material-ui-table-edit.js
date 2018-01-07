import { Async } from 'react-select';
import {getOptions} from '../controls/getselect.js';
import 'react-select/dist/react-select.css';
import React from 'react';
import {IconButton, Toggle, TextField, RaisedButton}  from 'material-ui';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Check from 'material-ui/svg-icons/navigation/check';
import Delete from 'material-ui/svg-icons/action/delete';
import _ from 'lodash';

class MaterialUITableEdit extends React.Component {

  // getDefaultProps: () => {
  //   return {
  //     headerColumns: [],
  //     rows: [],
  //     onChange: function () {}
  //   }
  // },
  constructor(props) {
    super(props);

    this.state = {
        rows: this.props.rows,
        hoverValue: false,
        currentRow: false,

      }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rows: nextProps.rows
    });
  }


  update() {
    const row = this.state.rows.filter((row) => {
      return row.selected
    })
    this.props.onChange(row[0])
  }

  getCellValue(cell) {
    const self = this
    const id = cell && cell.id
    const type = this.props.headerColumns.map((header) => {
      return header.type
    })[id]
    const selected = cell && cell.selected
    const value = cell && cell.value
    const rowId = cell && cell.rowId
    const header = cell && cell.header
    const width = cell && cell.width
    const textFieldId = [id, rowId, header].join('-')

    const textFieldStyle = {
      width: width
    }

    const onTextFieldChange = (e) => {
      const target = e.target
      const value = target.value
      var rows = self.state.rows
      rows[rowId].columns[id].value = value
      self.setState({rows: rows})
    }

    const onSelectedChange = (values)=>{
      console.log(values);
      let sz = values.split(',');
      var rows = self.state.rows
      rows[rowId].columns[id].value = sz
      self.setState({rows: rows})
    }

    const onToggle = (e) => {
      var rows = self.state.rows
      rows[rowId].columns[id].value = !rows[rowId].columns[id].value
      self.setState({rows: rows})
    }

    if (header || (type && type === 'ReadOnly')) {
      return <p style={{color: '#888'}}>{value}</p>
    }

    if (type) {
      if (selected) {
        if (type === 'TextField') {
          return <TextField
            id={textFieldId}
            onChange={onTextFieldChange}
            style={textFieldStyle}
            value={value}
          />
        }
        if (type === 'Toggle') {
          return <Toggle onToggle={onToggle} toggled={value} />
        }
      } else {
        if (type === 'Toggle') {
          return <Toggle disabled onToggle={onToggle} toggled={value} />
        }
      }
    }

    if(type === 'ReactSelect'){
      if (selected) {
        return (<Async
              multi
              onChange={onSelectedChange}
              value={value}
              simpleValue
              loadOptions={getOptions('datadict','showname','name')}
          />);
        }
      return (<Async
            disabled
            multi
            onChange={onSelectedChange}
            value={value}
            simpleValue
            loadOptions={getOptions('datadict','showname','name')}
        />);
    }

    return <TextField
      id={textFieldId}
      style={textFieldStyle}
      disabled
      value={value}
    />
  }

  renderHeader() {
    const headerColumns = this.props.headerColumns
    const columns = headerColumns.map((column, id) => {
      return {value: column.value}
    })
    const row = {columns: columns, header: true}

    return this.renderRow(row)
  }

  renderRow(row) {
    const self = this
    const columns = row.columns
    const rowStyle = {
      flexGrow: "1",
      display: 'flex',
      flexFlow: 'row nowrap',
      padding: row.header ? 0 : 12,
      border: 0,
      borderBottom: '1px solid #ccc',
      alignSelf: "normal",
      justifyContent: "flex-start"
    }
    const checkboxStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 50,
      height: 50,
      alignItems: 'center',
      flexShrink : 0,
      alignSelf: "center",
    }
    const deleteButtonStyle = {
          display: 'flex',
          flexFlow: 'row nowrap',
          width: 50,
          height: 24,
          alignItems: 'center',
          padding: '0 12 0'
        }
    const rowId = row.id
    const rowKey = ['row', rowId].join('-')

    const onRowClick = function (e) {
      var rows = self.state.rows
      rows.forEach((row, i) => {
        if (rowId !== i) row.selected = false
      })
      rows[rowId].selected = !rows[rowId].selected
      self.setState({rows: rows})
    }

    const r = self.state.rows[rowId]
    const selected = (r && r.selected) || false

    const button = selected ? <Check /> : <ModeEdit />
    const tooltip = selected ? 'Done' : 'Edit'
    const onDeleteRow = function (e) {
          var rows = self.state.rows
          var deleteEvent = {}
          rows.forEach((row, i) => {
            if (rowId === i) {
              rows.splice(i, 1)
              deleteEvent = {rowId, row}
            }
          })
          rows.forEach((row, i) => {
            row.id = i
          })
          self.setState({rows: rows})
          if (deleteEvent !== {}) self.props.onDelete(deleteEvent)
        }

    const onClick = function (e) {
      if (selected) {
        self.update()
      }

      onRowClick(e)
    }
    const deleteButton = (!this.props.enableDelete || selected || row.header) ? <div style={deleteButtonStyle} />
       : <IconButton style={deleteButtonStyle} tooltip={'Delete this row'} onClick={onDeleteRow}>
         <Delete />
       </IconButton>

    const checkbox = row.header ? <div style={checkboxStyle}/>
        : <IconButton style={checkboxStyle} tooltip={tooltip} onClick={onClick}>
            {button}
        </IconButton>

    return (
      <div key={rowKey} className='row' style={rowStyle}>
        {checkbox}
        {columns.map((column, id) => {
          const width = this.props.headerColumns.map((header) => {
            return (header && header.width) || false
          })[id]

          const cellStyle = {
            display: 'flex',
            flexFlow: 'row nowrap',
            flexGrow: 1,
            flexBasis: 'content',
            alignItems: 'center',
            width: 150,
            flexShrink : 0
          }

          const columnKey = ['column', id].join('-')
          column.selected = selected
          column.rowId = rowId
          column.id = id
          column.header = row.header
          column.width = cellStyle.width
          return (
            <div key={columnKey} className='cell' style={cellStyle}>
              <div>
                {this.getCellValue(column)}
              </div>
            </div>
          )
        })}
        {deleteButton}
      </div>
    )
  }

  render() {
    const self = this
    const style = {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      fontFamily: 'Roboto, sans-serif'
    }

    const buttonStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      marginTop: 10
    }

    const rows = this.state.rows
    const columnTypes = this.props.headerColumns.map((header) => {
      return header.type
    })

    const onButtonClick = (e) => {
      const newColumns = _.times(columnTypes.length, (index) => {
        const defaults = {
          'TextField': '',
          'Toggle': true
        }

        const value = defaults[columnTypes[index]]

        return {value: value}
      })

      const updatedRows = rows.map((row) => {
        if (row.selected) {
          self.update()
          row.selected = false
        }
        return row
      })
      updatedRows.push({columns: newColumns, selected: true})
      self.setState({rows: updatedRows})
    }

    return (
      <div className='container' style={style}>
      {this.renderHeader()}
      {rows.map((row, id) => {
        row.id = id
        return this.renderRow(row)
      })}
      <RaisedButton
         onClick={onButtonClick}
         style={buttonStyle}
         label='新建'
       />
      </div>
    )
  }
};

export default MaterialUITableEdit;
