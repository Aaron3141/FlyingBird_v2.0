import React, { useState, useEffect, useContext } from 'react'

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone} from 'react-bootstrap-table2-paginator';

import { Context } from '../../context/context'
import Spinner from '../layout/Spinner'

import selectpicker from 'bootstrap-select/dist/js/bootstrap-select'

const { SearchBar } = Search;
const formatterChnName = (cell, row) =>{
    console.log('cell', cell)
    console.log('row', row)

    const sp = cell.split('</br>')
    console.log('sp', sp)
    const jo = sp.join(`</br >`)
    return(
        <span>
            <a href={`http://courseap.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?year=${row.acadm_year}&term=${row.acadm_term}&courseCode=${row.course_code}&deptCode=${row.dept_code}`} target="_blank">{sp[0]}</a>
            <br />
            <p>
                {sp[1]}
            </p>
        </span>
    )
}

const formatterCodeCredit = (cell, row) => {
    // console.log('cell', cell)
    // console.log('row', row)

    const sp = [row.credit, row.option_code]
    const jo = sp.join(` `)
    return (

        <span dangerouslySetInnerHTML={{ __html: jo }}>
        </span>
        
    )
}
const formatterNoCodeCredit = (cell, row) => {
    // console.log('cell', cell)
    // console.log('row', row)

    const sp = [row.credit, row.option_code]
    let jo = sp.join(` `)
    jo = row.serial_no + '</br>' + jo
    return (

        <span dangerouslySetInnerHTML={{ __html: jo }}>
        </span>

    )
}
const formatterNoDept =(cell, row)=>{
    const sp = [row.serial_no, row.dept_chiabbr]
    const jo = sp.join(`</br >`)
    return (

        <span dangerouslySetInnerHTML={{ __html: jo }}>
        </span>
    )
}
const DataTable = () => {
    const [state, setState] = useContext(Context);
    const { class_list, heading} = state;
    // {
    //     dataField: 'credit',
    //         text: '學分',
    //             sort: true
    // }, 
    // {
    //     dataField: 'dept_chiabbr',
    //         text: '開課單位',
    //             sort: true
    // },
    const columns = [{
        dataField: 'course_code',
        text: '開課序號 ID',
        sort: true,
        hidden: true
    }, {
        dataField: 'serial_no',
        text: '開課代碼',
        formatter: formatterNoDept,
        sort: true,
        hidden: true
    }, {
        dataField: 'chn_name',
        text: '課程名稱',
        formatter: formatterChnName,
        style: { width: 'auto !important'},
        sort: true
    }, {
        dataField: 'option_code',
        text: '開課代碼 學分 必/選',
        formatter: formatterNoCodeCredit,
        sort: true
    }, {
        dataField: 'eng_name',
        text: '課程英文名稱',
        formatter: formatterChnName,
        style: { width: 'auto !important'},
        sort: true,
        hidden: true
    }, {
        dataField: 'teacher',
        text: '教師',
        sort: true
    }, {
        dataField: 'time_inf',
        text: '時間地點',
        sort: true
    }, {
        dataField: 'limit_count_h',
        text: '限修人數',
        sort: true,
        hidden: true
    }, {
        dataField: 'authorize_p',
        text: '授權碼人數',
        sort: true,
        hidden: true
    }, {
        dataField: 'restrict',
        text: '限修',
        style:  {  width: 'auto'},
        sort: true,
        hidden: true
    }];

    const expandRow = {
        
        renderer: (row, rowIndex) => (
            // console.log('rowIndexkkk', rowIndex)
            // <div>{`${row.credit == 2 ? 'This Expand row is belong to rowKey ' : ''}`}</div>
            <div>
                <p>{`${row.restrict == '' ? '無限修條件' : `限修條件:`}`}</p>
                <p>{`${row.restrict == '' ? '' : `${row.restrict}`}`}</p>
                <p>{`限修人數: ${row.limit_count_h}`}</p>
                <p>{`授權碼人數: ${row.authorize_p}`}</p>
            </div>
            
        ),
        className: (isExpanded, row, rowIndex) => {
            // if (rowIndex > 2) return 'foo';
            return '';
        },
        parentClassName: (isExpanded, row, rowIndex) => {
            if (rowIndex > 2) return 'foo';
            return '';
        },
        // onlyOneExpanding: true,
        expanded: [1, 3],
        onExpand: (row, isExpand, rowIndex, e) => {
            console.log('row', row, 'isExpand', isExpand, 'rowIndex', rowIndex, 'e', e)
        },
        expandColumnRenderer: ({ expanded, rowKey, expandable }) => (
            console.log('expanded', expanded, 'rowKey', rowKey, 'expandable', expandable)
        )
    };
    // let ttable = <BootstrapTable keyField='id' data={class_list} columns={columns} />
    // useEffect(() => {
    //     // ttable = <BootstrapTable  keyField='id' data={class_list} columns={columns} />
    //     console.log('Hello')
    //     // effect
    //     // return () => {
    //     //     cleanup
    //     // };
    // }, [class_list])

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        hideSelectColumn: true,
        clickToExpand: true,
        // bgColor: '#00BFFF'
        onSelect: (row, isSelect, rowIndex, e) => {
            console.log('rowIndex', rowIndex)
        }
    };
    
    const options = {
        custom: true,
        paginationSize: 4,
        pageStartIndex: 1,
        sizePerPage:11,
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        totalSize: class_list.length
    };
    const CustomToggleList = ({
        columns,
        onColumnToggle,
        toggles
    }) => (
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                
                <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="far fa-check-circle"></i>
                </button>
                <div className="dropdown-menu" >
                    {/* <button className="dropdown-item" type="button">Action</button> */}
                    {
                        columns
                            .map(column => ({
                                ...column,
                                ['toggle']: toggles[column.dataField]
                            }))
                            .map(column => (
                                <button
                                    type="button"
                                    key={column.dataField}
                                    // ${column.toggle ? 'btn-primary' : 'btn-outline-primary'}
                                    className={`dropdown-item btn ${column.toggle ? 'active btn-outline-warning ' : 'btn-light'}`}
                                    type="button"
                                    data-toggle="button"
                                    aria-pressed={column.toggle ? 'true' : 'false'}
                                    onClick={() => onColumnToggle(column.dataField)}
                                >
                                    {column.text}
                                </button>
                            ))
                    }
                    {/* <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="customCheck1" />
                        <label class="custom-control-label dropdown-item" for="customCheck1">checkbox</label>
                    </div> */}
                    
                </div>
            </div>
        );
    const contentTable = ({ paginationProps, paginationTableProps }) => (
        <div className="">
            {/* <SizePerPageDropdownStandalone
                {...paginationProps}
            /> */}
            
            <PaginationListStandalone  {...paginationProps} style={{ 'margin-right': '10px' }}/>
            <ToolkitProvider
                keyField="id"
                className='d-flex'
                columns={
                    columns
                }
                data={class_list}
                columnToggle
                search
            >
                {
                    toolkitprops => (
                        <div>
                            <CustomToggleList {...toolkitprops.columnToggleProps} />
                            <SearchBar
                            {...toolkitprops.searchProps}
                            className='ml-auto'
                            placeholder="Search..."
                            style={{'margin-right': '10px'}}
                            />
                            <BootstrapTable
                                bootstrap4
                                striped
                                hover
                                expandRow={expandRow}
                                selectRow={selectRow}
                                {...toolkitprops.baseProps}
                                {...paginationTableProps}
                            />
                        </div>
                    )
                }
            </ToolkitProvider>
            <PaginationListStandalone {...paginationProps} className='ml-auto'/>
        </div>
    );
    if (class_list === undefined || class_list.length === 0) {
        console.log("class_list", class_list)
        return <Spinner />;
    }else{
        return (
            <>
                {/* <h2>{heading}</h2> */}
                {/* <ColoredLine color="red" /> */}
                {/* <hr style={{
                    color: '#808080',
                    backgroundColor: '#808080',
                    height: .5
                }} /> */}
                <PaginationProvider
                    bootstrap4
                    pagination={
                        paginationFactory(options)
                    }
                >
                    {contentTable}
                </PaginationProvider>
                {/* <Code>{sourceCode}</Code> */}
            </ >
        )
    }
    
}


export default DataTable;