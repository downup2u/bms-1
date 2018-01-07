import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import React from 'react';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';

class DateRange extends React.Component {

    handleApply =(event, picker)=> {
      let obj = {
         startDate: picker.startDate,
         endDate: picker.endDate,
       };
      if(!!this.props.onChangeSelDate){
        this.props.onChangeSelDate(obj.startDate,obj.endDate);
      }
   }

  render() {
        const { startDate, endDate } = this.props;
        let start = startDate.format('YYYY-MM-DD HH:mm:ss');
        let end = endDate.format('YYYY-MM-DD HH:mm:ss');
        let label = start + ' - ' + end;
        if (start === end) {
          label = start;
        }
        let locale = {
          format: 'YYYY-MM-DD',
          separator: ' - ',
          applyLabel: '确定',
          cancelLabel: '取消',
          weekLabel: '星期',
          customRangeLabel: '自定义范围',
          daysOfWeek: moment.weekdaysMin(),
          monthNames: moment.monthsShort(),
          firstDay: moment.localeData().firstDayOfWeek(),
          daysOfWeek: [
             "日",
             "一",
             "二",
             "三",
             "四",
             "五",
             "六"
           ],
           monthNames: [
               "1月",
               "2月",
               "3月",
               "4月",
               "5月",
               "6月",
               "7月",
               "8月",
               "9月",
               "10月",
               "11月",
               "12月"
           ],
        };

        return (
          <DatetimeRangePicker
            timePicker
            timePicker24Hour
            showDropdowns
            timePickerSeconds
            locale={locale}
            startDate={startDate}
            endDate={endDate}
            onApply={this.handleApply}
            className="settimepicker"
          >
            <button className="settimeinput">
                <i className="fa fa-calendar"/> &nbsp;
                <span>{label}</span>
                <i className="fa fa-angle-down"/>
            </button>
          </DatetimeRangePicker>
        );
    }
}

export default DateRange;
