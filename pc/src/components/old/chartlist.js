/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
class Page extends React.Component {
    render(){
        let mapcontent = {
          '0':{
            title:'减排量统计页',
            link:"https://app.powerbi.com/view?r=eyJrIjoiMjE3YWJmZDMtOTU2NC00MzI0LWE2N2ItZTYzZGEyOTNhYmJhIiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9"
          },
          '1':{
            title:'仪表盘1',
            link:'https://app.powerbi.com/view?r=eyJrIjoiOWFiZGQ5NDMtZGIyMy00MWVmLWEzODQtNzhkNTUwODA3ODExIiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
          },
          '2':{
            title:'仪表盘2',
            link:'https://app.powerbi.com/view?r=eyJrIjoiNWQ3NWU3NzUtYmU3Yi00NWZmLWEzMjItMjA1ZDYxZjFiOWNkIiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
          },
          '3':{
            title:'仪表盘3',
            link:'https://app.powerbi.com/view?r=eyJrIjoiMGRmZDY5NzAtMmU0YS00OTQyLWFiMzMtMjRiZGIwYWQzNWU2IiwidCI6IjQwMjJlMDNlLTU4MjAtNDhhNS1iODQ5LWNkZThjZDc3ZThmYyIsImMiOjF9'
          },
        };
        let contentobj = mapcontent['0'];
        contentobj = mapcontent[this.props.match.params.id];
        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>
                <div className="appbar">
                    <div className="title">{contentobj.title}</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                </div>
                <iframe src={contentobj.link} style={{width:"100%",height: "100%"}}></iframe>
            </div>

        );
    }
}
export default withRouter(Page);
