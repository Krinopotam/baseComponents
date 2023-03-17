import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {theme} from 'antd';

const {useToken} = theme;

interface ITabulatorStyle {
    colorBgContainer: string;
    colorPrimaryBg: string;
    colorPrimaryBgHover: string;
    colorFillQuaternary: string;
    borderRadius: number;
    colorBorder: string;
    colorBorderSecondary: string;
    colorText: string;
    fontSize: number;
}

const TabulatorCss = createGlobalStyle`
  .tabulator {
    background-color:  ${(props: ITabulatorStyle) => props.colorBgContainer};
    
    .tabulator-header {
      background-color: transparent;
      border-top-right-radius: ${(props: ITabulatorStyle) => props.borderRadius}px;
      border-top-left-radius: ${(props: ITabulatorStyle) => props.borderRadius}px;
      border-bottom-color: ${(props: ITabulatorStyle) => props.colorBorderSecondary};

      .tabulator-col {
        background-color: ${(props: ITabulatorStyle) => props.colorFillQuaternary};
        border-right-color: ${(props: ITabulatorStyle) => props.colorBorderSecondary};
        
        &.tabulator-sortable {
          &.tabulator-col-sorter-element:hover {
            background-color: ${(props: ITabulatorStyle) => props.colorFillQuaternary};
          }
        }
        
        .tabulator-col-title {
          color: ${(props: ITabulatorStyle) => props.colorText};
          font-size: ${(props: ITabulatorStyle) => props.fontSize}px;
        }

        .tabulator-col-sorter {
          color: ${(props: ITabulatorStyle) => props.colorText};
        }

        /* Workaround to hide/show headerFilter */
        .tabulator-header-filter {
          display: none;
        }
        /* ------- */
        
        .tabulator-header-filter input {
          color: ${(props: ITabulatorStyle) => props.colorText};
          font-size: ${(props: ITabulatorStyle) => props.fontSize}px;
          border-color: ${(props: ITabulatorStyle) => props.colorBorder};
          border-radius: ${(props: ITabulatorStyle) => props.borderRadius}px;
          background-color: ${(props: ITabulatorStyle) => props.colorBgContainer};
          padding-left: 11px!important;
          padding-right: 11px!important;
          border-style: solid;
          border-width: 1px;
          &:focus {
            border-color: ${(props: ITabulatorStyle) => props.colorPrimaryHover};
            box-shadow:  ${(props: ITabulatorStyle) => props.colorPrimaryBg};
            border-inline-end-width: 1px;
            outline: 0;
          }
          &:hover {
            border-color: ${(props: ITabulatorStyle) => props.colorPrimaryHover};
          }
        }
      }
    }
    
    .tabulator-tableholder {
      .tabulator-table {
        background-color: transparent;
        color: ${(props: ITabulatorStyle) => props.colorText};
        font-size: ${(props: ITabulatorStyle) => props.fontSize}px;

        .tabulator-row {
          background-color: transparent;
          border-bottom-color: ${(props: ITabulatorStyle) => props.colorBorderSecondary};
          &.tabulator-selectable:hover {
            background-color: ${(props: ITabulatorStyle) => props.colorFillQuaternary};
          }
          
          &.tabulator-selected {
            background-color: ${(props: ITabulatorStyle) => props.colorPrimaryBg};
          }

          &.tabulator-selected:hover {
            background-color: ${(props: ITabulatorStyle) => props.colorPrimaryBgHover};
          }
          
          &.tabulator-row-odd{
            //background-color: transparent;
          }

          &.tabulator-row-even{
            //background-color: transparent;
          }
          
          .tabulator-cell {
            border-right-color: ${(props: ITabulatorStyle) => props.colorBorderSecondary};
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
        font-size: ${(props: ITabulatorStyle) => props.fontSize}px;
        text-decoration: none;
        outline: none;
        cursor: pointer;
        transition: all .3s;
        box-sizing: border-box;
        color: ${(props: ITabulatorStyle) => props.colorText};
        background-color: ${(props: ITabulatorStyle) => props.colorBgContainer};
        border-color: ${(props: ITabulatorStyle) => props.colorBorder};
        border-radius: ${(props: ITabulatorStyle) => props.borderRadius}px;
        border-style: solid;
        border-width: 1px;
        transform: scale(.9411764705882353);
        user-select: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &:hover {
          color: ${(props: ITabulatorStyle) => props.colorPrimaryHover};
          border-color: ${(props: ITabulatorStyle) => props.colorPrimaryHover};
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
