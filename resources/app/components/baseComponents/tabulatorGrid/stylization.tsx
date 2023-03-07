import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {theme} from 'antd';

const {useToken} = theme;

interface ITabulatorStyle {
    containerBgColor: string;
    selectedBgColor:string
    selectedHoverBgColor:string;
    colColor: string;
    borderRadius: number;
    borderColor:string;
    textColor: string;
    textFontSize: number;
}

const TabulatorCss = createGlobalStyle`
  .tabulator {
    background-color:  ${(props: ITabulatorStyle) => props.containerBgColor};
    
    .tabulator-header {
      background-color: transparent;
      border-top-right-radius: ${(props: ITabulatorStyle) => props.borderRadius}px;
      border-top-left-radius: ${(props: ITabulatorStyle) => props.borderRadius}px;
      border-bottom-color: ${(props: ITabulatorStyle) => props.borderColor};

      .tabulator-col {
        background-color: ${(props: ITabulatorStyle) => props.colColor};
        border-right-color: ${(props: ITabulatorStyle) => props.borderColor};
        
        &.tabulator-sortable {
          &.tabulator-col-sorter-element:hover {
            background-color: ${(props: ITabulatorStyle) => props.colColor};
          }
        }
        
        .tabulator-col-title {
          color: ${(props: ITabulatorStyle) => props.textColor};
          font-size: ${(props: ITabulatorStyle) => props.textFontSize}px;
        }

        .tabulator-col-sorter {
          color: ${(props: ITabulatorStyle) => props.textColor};
        }
      }
    }
    
    .tabulator-tableholder {
      .tabulator-table {
        background-color: transparent;
        color: ${(props: ITabulatorStyle) => props.textColor};
        font-size: ${(props: ITabulatorStyle) => props.textFontSize}px;

        .tabulator-row {
          background-color: transparent;
          border-bottom-color: ${(props: ITabulatorStyle) => props.borderColor};
          &.tabulator-selectable:hover {
            background-color: ${(props: ITabulatorStyle) => props.colColor};
          }
          
          &.tabulator-selected {
            background-color: ${(props: ITabulatorStyle) => props.selectedBgColor};
          }

          &.tabulator-selected:hover {
            background-color: ${(props: ITabulatorStyle) => props.selectedHoverBgColor};
          }
          
          &.tabulator-row-odd{
            //background-color: transparent;
          }

          &.tabulator-row-even{
            //background-color: transparent;
          }
          
          .tabulator-cell {
            border-right-color: ${(props: ITabulatorStyle) => props.borderColor};
          }
        }
      }
    }
  }
`;

export const Stylization = (): JSX.Element => {
    const {token} = useToken();

    return (
            <TabulatorCss
                containerBgColor={token.colorBgContainer}
                selectedBgColor={token.colorPrimaryBg}
                selectedHoverBgColor={token.colorPrimaryBgHover}
                borderRadius={token.borderRadius}
                borderColor={token.colorBorderSecondary}
                textColor={token.colorText}
                textFontSize={token.fontSize}
                colColor={token.colorFillQuaternary}


            />

    );
};
