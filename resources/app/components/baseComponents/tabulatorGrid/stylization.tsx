import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {GlobalToken, theme} from 'antd';

const {useToken} = theme;

const TabulatorCss = createGlobalStyle`
  .tabulator {
    background-color:  ${(props:  GlobalToken) => props.colorBgContainer};
    
    .tabulator-header {
      background-color: transparent;
      border-top-right-radius: ${(props: GlobalToken) => props.borderRadius}px;
      border-top-left-radius: ${(props: GlobalToken) => props.borderRadius}px;
      border-bottom-color: ${(props: GlobalToken) => props.colorBorderSecondary};

      .tabulator-col {
        background-color: ${(props: GlobalToken) => props.colorFillQuaternary};
        border-right-color: ${(props: GlobalToken) => props.colorBorderSecondary};
        
        &.tabulator-sortable {
          &.tabulator-col-sorter-element:hover {
            background-color: ${(props: GlobalToken) => props.colorFillQuaternary};
          }
        }
        
        .tabulator-col-title {
          color: ${(props: GlobalToken) => props.colorText};
          font-size: ${(props: GlobalToken) => props.fontSize}px;
        }

        .tabulator-col-sorter {
          color: ${(props: GlobalToken) => props.colorText};
        }

        /* Workaround to hide/show headerFilter */
        .tabulator-header-filter {
          display: none;
        }
        /* ------- */
        
        .tabulator-header-filter input {
          color: ${(props: GlobalToken) => props.colorText};
          font-size: ${(props: GlobalToken) => props.fontSize}px;
          border-color: ${(props: GlobalToken) => props.colorBorder};
          border-radius: ${(props: GlobalToken) => props.borderRadius}px;
          background-color: ${(props: GlobalToken) => props.colorBgContainer};
          padding-left: 11px!important;
          padding-right: 11px!important;
          border-style: solid;
          border-width: 1px;
          &:focus {
            border-color: ${(props: GlobalToken) => props.colorPrimaryHover};
            box-shadow:  ${(props: GlobalToken) => props.colorPrimaryBg};
            border-inline-end-width: 1px;
            outline: 0;
          }
          &:hover {
            border-color: ${(props: GlobalToken) => props.colorPrimaryHover};
          }
        }
      }
    }
    
    .tabulator-tableholder {
      .tabulator-table {
        background-color: transparent;
        color: ${(props: GlobalToken) => props.colorText};
        font-size: ${(props: GlobalToken) => props.fontSize}px;

        .tabulator-row {
          background-color: transparent;
          border-bottom-color: ${(props: GlobalToken) => props.colorBorderSecondary};
          &.tabulator-selectable:hover {
            background-color: ${(props: GlobalToken) => props.colorFillQuaternary};
          }
          
          &.tabulator-selected {
            background-color: ${(props: GlobalToken) => props.colorPrimaryBg};
          }

          &.tabulator-selected:hover {
            background-color: ${(props: GlobalToken) => props.colorPrimaryBgHover};
          }
          
          &.tabulator-row-odd{
            //background-color: transparent;
          }

          &.tabulator-row-even{
            //background-color: transparent;
          }
          
          .tabulator-cell {
            border-right-color: ${(props: GlobalToken) => props.colorBorderSecondary};
          }
        }
      }
    }
    
    /** Collapse/expand button style */
    .tree-row-button {
        width: 17px;
        height: 17px;
        padding: 0;
        margin-right: 5px;
        font-size: ${(props: GlobalToken) => props.fontSize}px;
        text-decoration: none;
        outline: none;
        cursor: pointer;
        transition: all .3s;
        box-sizing: border-box;
        color: ${(props: GlobalToken) => props.colorText};
        background-color: ${(props: GlobalToken) => props.colorBgContainer};
        border-color: ${(props: GlobalToken) => props.colorBorder};
        border-radius: ${(props: GlobalToken) => props.borderRadius}px;
        border-style: solid;
        border-width: 1px;
        transform: scale(.9411764705882353);
        user-select: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &:hover {
          color: ${(props: GlobalToken) => props.colorPrimaryHover};
          border-color: ${(props: GlobalToken) => props.colorPrimaryHover};
        }
    }
    
    .collapse-button button {
    }
    
    .expand-button button {
    }
  }
`;

export const Stylization = (): JSX.Element => {
    const {token} = useToken();
    return <TabulatorCss {...token} />;
};
