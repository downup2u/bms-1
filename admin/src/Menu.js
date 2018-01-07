import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { translate,DashboardMenuItem, WithPermission } from 'admin-on-rest';
import compose from 'recompose/compose';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LabelIcon from 'material-ui/svg-icons/action/label';
import _ from 'lodash';
import Icon from 'material-ui/svg-icons/social/person';

import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import { List, ListItem } from 'material-ui/List';
import allmenus from './LeftmenuData.js';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
    },
};

// const getMenuItem = ({title,link,onMenuTap,item})=>{
//   if(item.name === 'systemconfig')
// }

let getallmenus = (translate,onMenuTap)=>{
  const permission = localStorage.getItem('usertype');
  let getChildItems =(item, translate,onMenuTap)=>{
     let itemsco =[];
     item.children.map((child)=>{
        let title = translate(`resources.${child.name}.name`, { smart_count: 2 });
        let link = `/${child.name}`;
        itemsco.push(<
          MenuItem
          key={child.name}
          value={child.name}
          primaryText={title}
          leftIcon={child.icon}
          onTouchTap={onMenuTap}
          containerElement={<Link to={link} />}
          insetChildren={true}
        />);
      });
      return itemsco;
   }
   let menuitemsco =[];
   allmenus.map((item)=> {
     let title = translate(`resources.${item.name}.name`, { smart_count: 2 });
     if(!!item.children){
        menuitemsco.push(<MenuItem
            value={item.name}
            primaryText={title}
            key={item.name}
            leftIcon={item.icon}
            rightIcon={<ArrowDropRight />}
            menuItems={getChildItems(item,translate,onMenuTap)}
        />);
     }
     else{
            const link = `/${item.name}`;
            if(item.adminonly){
              if(permission === 'admin'){
                menuitemsco.push(
                    <MenuItem
                    primaryText={title}
                    value={item.name}
                    key={item.name}
                    leftIcon={item.icon}
                    onTouchTap={onMenuTap}
                    containerElement={<Link to={link} />}
                  />);
              }
            }
            else{
              menuitemsco.push(
                <MenuItem
                  primaryText={title}
                  value={item.name}
                  key={item.name}
                  leftIcon={item.icon}
                  onTouchTap={onMenuTap}
                  containerElement={<Link to={link} />}
                />);
            }
        }
   });
   return menuitemsco;
}

const MenuC = ({ onMenuTap, translate, logout,resourcename }) => (
    <Menu style={styles.main}  value={resourcename} selectedMenuItemStyle={ {color: 'rgb(0,188,212)', borderLeft: '8px solid rgb(0,188,212)'}} >
        {getallmenus(translate,onMenuTap)}
        {logout}
    </Menu>
);
        /*<MenuItem
            containerElement={<Link to="/configuration" />}
            primaryText={translate('pos.configuration')}
            leftIcon={<SettingsIcon />}
            onTouchTap={onMenuTap}
        />*/
const enhance = compose(
    connect((state) => {
      const pathname = _.get(state,'routing.location.pathname','');
      let resourcename = '';
      const sz = pathname.split('/');
      if(sz.length > 1){
        resourcename = sz[1];
      }
      console.log(resourcename);
      return {
        theme: state.theme,
        locale: state.locale,
        resourcename,
    }
  }
  ),
    translate,
);

export default enhance(MenuC);
