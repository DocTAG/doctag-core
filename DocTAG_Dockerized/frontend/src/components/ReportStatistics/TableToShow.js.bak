import React, {useState, useEffect, useContext, createContext} from 'react';
import Paper from '@material-ui/core/Paper';
import {EditingState, SelectionState} from '@devexpress/dx-react-grid';
import './tables.css'
// import Button from '@material-ui/core/Button'
import Button from "react-bootstrap/Button";
import MenuItem from '@material-ui/core/MenuItem';

import TextField from '@material-ui/core/TextField'
import {Container, Row, Col, OverlayTrigger} from "react-bootstrap";
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
    SearchState,
    FilteringState,
    IntegratedFiltering,
    PagingState,
    IntegratedPaging,
    SortingState,
    IntegratedSorting,
    IntegratedSelection,
    DataTypeProvider,

} from '@devexpress/dx-react-grid';
import Select from '@material-ui/core/Select';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import Collapse from "@material-ui/core/Collapse";
import SearchIcon from '@material-ui/icons/Search';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { RowDetailState } from '@devexpress/dx-react-grid';
import { Plugin, Template, TemplateConnector } from "@devexpress/dx-react-core";
import InfoIcon from '@material-ui/icons/Info';
import {
    Grid,
    Table,
    SearchPanel,
    TableHeaderRow,
    TableRowDetail,
    TableFilterRow,
    VirtualTable,
    DragDropProvider,
    TableColumnReordering,
    Toolbar,
    PagingPanel,
    TableEditColumn,
    ColumnChooser,
    TableSelection,
    TableColumnVisibility,
    TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import PeopleIcon from '@material-ui/icons/People';
// import Button from "@material-ui/core/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faTrash, faEye} from "@fortawesome/free-solid-svg-icons";
import {GridToolbarContainer} from "@material-ui/data-grid";
import Spinner from "react-bootstrap/Spinner";
import {AppContext} from "../../App";
import Modal from "react-bootstrap/Modal";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "react-bootstrap/Tooltip";
import ReportListUpdated from "../Report/ReportListUpdated";
import ReportForModal from "./AnnotationStats/ReportForModal";
import axios from "axios";
import ReportToText from "./InteractiveTable/ReportToText";
import DownloadModalRep from "./InteractiveTable/DownloadModalRep";
import {People} from "@material-ui/icons";
import MajorityVoteModal from "./MajorityVote/MajorityVoteModal";
// import {Col} from "react-bootstrap";

export const TableToShowContext = createContext('')
export default function TableToShow(props) {
    const { showannotations,showreporttext,showmajoritygt,showmajoritymodal,usecaseList,languageList,instituteList,username,admin } = useContext(AppContext);
    const [Username, SetUsername] = username;
    const [Admin, SetAdmin] = admin;
    const [sortingStateColumnExtensions] = useState([
        { columnName: '', sortingEnabled: false },
    ]);
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [pageSizes] = useState([5, 10, 25, 50, 0]);
    const [defaultHiddenColumnNames] = useState(props.hiddenColumns);
    const [selection, setSelection] = useState([]);
    const [tableColumnVisibilityColumnExtensions] = useState([
        { columnName: 'id_report', togglingEnabled: false },
    ]);
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showIds, SetShowIds] = useState(false)
    const [rows,setRows] = useState(props.righe)
    const [Loading,setLoading] = useState(true)
    const [filteredRows,setFilteredRows] = useState(props.righe)
    const [ShowModalDeleteSingle,SetShowModalDeleteSingle] = useState(false)
    const [ShowColumns, SetShowColumns] = useState(false)
    const [ColumnsNew, SetColumnsNew] = useState((props.columns).filter(c=>(c.name==='id_report' || c.name==='annotations'||c.name==='topic'||c.name==='language'||c.name === 'batch' ||c.name==='')))
    const [Filters] = useState(document.getElementsByClassName('MuiTableCell-root MuiTableCell-head jss44'))
    const [deleteCols] = useState(['']);
    const [downloadCols] = useState(['download']);
    const [IDToRemove,SetIDToRemove] = useState([])
    const [FilterExt] = useState([{columnName:'', filteringEnabled:false,SortingEnabled:false}])
    const [ResizeExt] = useState([{columnName:'', minWidth:200,maxWidth:200}])
    const [ShowAnnotationsStats,SetShowAnnotationsStats] = showannotations;
    const [IDToStats,SetIDToStats] = useState(false)
    const [ReportStats,SetReportStats] = useState(false)
    const [showReportText,SetshowReportText] = showreporttext;
    const [IDtoText,SetIDtoText] = useState(false)
    const [ShowModalDownload,SetShowModalDownload] = useState(false)
    const [RowsToDownload,SetRowsToDownload] = useState([])
    const [ShowMajorityModal,SetshowMajorityModal] = showmajoritymodal
    const [IDtoMajority,SetIDtoMajority] = useState(false)
    const [ShowMajorityGroundTruth,SetShowMajorityGroundTruth] = showmajoritygt

    useEffect(()=>{
        if(IDToStats){
            axios.get('http://0.0.0.0:8000/annotation_all_stats',{params:{report:IDToStats['id_report'],topic:IDToStats['topic'],language:IDToStats['language']}})
                .then(response => {SetReportStats(response.data);})
        }
    },[IDToStats])




    function handleDeleteSingle(e,row){
        setSelection([])
        axios.post('http://0.0.0.0:8000/delete_reports',{report_list:[row]}).then(response => {
            var arr = filteredRows.filter(r=>r !== row)
            console.log('new_rows',arr)
            console.log('new_rows',selection)

            arr.map((row,ind)=>{
                row.id = ind
            })
            setFilteredRows(arr);
            SetShowModalDeleteSingle(false)
        }).catch(error=>{
            console.log('error',error)
        })

    }

    const AnnotationsFormatter = ({ row }) => (
        <div>
            {row.annotations}&nbsp;&nbsp;
            {row.annotations > 0 &&
            <OverlayTrigger
                key='left'
                placement='top'
                overlay={
                    <Tooltip id={`tooltip-top'`}>
                        View the annotations
                    </Tooltip>
                }
            >
            <button onClick={()=>{SetIDToStats(row);SetShowAnnotationsStats(true)}} disabled={row.annotations < 1} className='opt_but'><InfoIcon color="action"/>
            </button></OverlayTrigger>}
        </div>

    );

    const AnnotationStatsProvider = props => (
        <DataTypeProvider
            formatterComponent={AnnotationsFormatter}
            {...props}
        />
    );

    const DeleteDownloadFormatter = ({ row }) =>
        <div>

            <OverlayTrigger
                key='left'
                placement='top'
                overlay={
                    <Tooltip id={`tooltip-top'`}>
                        Delete this report
                    </Tooltip>
                }
            >
                <Button className='opt_but' size='sm' onClick={()=>{SetShowModalDeleteSingle(prev=>!prev);SetIDToRemove(row);}}><DeleteIcon color="action"/></Button>
            </OverlayTrigger>
            <OverlayTrigger
                key='left'
                placement='top'
                overlay={
                    <Tooltip id={`tooltip-top'`}>
                       Download the ground-truths
                    </Tooltip>
                }
            >
                <Button className='opt_but' onClick={()=>{SetRowsToDownload([row]);SetShowModalDownload(true)}} size='sm'><GetAppIcon color="action"/></Button>
            </OverlayTrigger>

            <OverlayTrigger
                key='left'
                placement='top'
                overlay={
                    <Tooltip id={`tooltip-top'`}>
                        View the report
                    </Tooltip>
                }
            >
                <Button onClick={()=>{SetshowReportText(true);SetIDtoText(row)}}  className='opt_but' size='sm'><VisibilityIcon color="action"/></Button>
            </OverlayTrigger>

            <OverlayTrigger
                key='left'
                placement='top'
                overlay={
                    <Tooltip id={`tooltip-top'`}>
                        Majority vote ground-truth
                    </Tooltip>
                }
            >
                <Button className='opt_but' size='sm' onClick={()=>{SetshowMajorityModal(true);SetShowMajorityGroundTruth(true);SetIDtoMajority(row)}}><PeopleIcon color="action"/></Button>
            </OverlayTrigger>
    </div>;
    const DeleteDownloadTypeProvider = props => (
        <DataTypeProvider
            formatterComponent={DeleteDownloadFormatter}
            {...props}
        />
    );


    const handleDelete = ()=>{
        var arr = filteredRows.filter(r=> selection.indexOf(r.id)<0)
        var selected_rows = filteredRows.filter(r=>selection.indexOf(r.id)>=0)
        axios.post('http://0.0.0.0:8000/delete_reports',{report_list:selected_rows}).then(response=>{
            console.log('new_rows',arr)
            console.log('new_rows',selection)
            setSelection([])

            setShowModalDelete(false)
            arr.map((row,ind)=>{
                row.id = ind
            })
            setFilteredRows(arr);
        }).catch(error=>{console.log(error)})

    }
    function handleChange(e,column){
        if(column === 'all'){
            var checks = document.getElementsByName('check_columns')
            console.log('checks',checks)

            Array.from(checks).map(el=>{
                el.checked = true
            })
            SetColumnsNew(props.columns)
        }

        else if(column === 'hide'){
            var checks = document.getElementsByName('check_columns')
            console.log('checks',checks)
            Array.from(checks).map(el=>{
                if(['id_report'].indexOf(el.title) >= 0){
                    el.checked = true
                }
                else{
                    el.checked = false
                }

            })
            SetColumnsNew(props.columns.filter(c=>(['id_report',''].indexOf(c.title)!==-1)))
        }
        else {
            var cols = new Array(props.columns.length).fill(false)
            ColumnsNew.map((col,ind)=>{
                // if(col.name !== ''){
                    var indice = props.columns.indexOf(col)
                    cols[indice] = col
                // }
            })
            // console.log('colonne',cols)
            if (e.target.checked) {

                var ind = props.columns.indexOf(column)
                console.log('indice', ind)
                console.log('indice', cols.slice(0, ind))
                console.log('indice1', column)
                console.log('indice2', cols.slice(ind))
                if(cols[ind] === false){
                    cols[ind] = column
                }
                // var newc = [...cols.slice(0, ind), column, ...cols.slice(ind)]
                // console.log('indice3', newc)
                var newccols = cols.filter(c=>c !== false)

                SetColumnsNew(newccols)

            } else {
                // var check_c = document.getElementById('hide_all')
                // check_c.checked = false

                // console.log('rimozione', cols)
                var newc = cols.filter(c => (c !== column && c !== false))
                // console.log('rimozione', cols)
                SetColumnsNew(newc)

            }
        }
    }

    function handleChangeTextFilter(e){
        if(e.target.value === ''){
            setFilteredRows(rows)
        }
        else{
            var new_r = []
            // console.log('valoreRIFERIMENTO',e.target.value)
            // new_r = rows.filter(r=>r.keys.filter(k=>r[k].toLowerCase().includes(e.target.value.toLowerCase())))
            // setRows(new_r)

            rows.map((row,i)=>{
                Object.keys(row).map((k,ind)=>{
                    if(row[k] !== undefined){
                        if(row[k].toString().toLowerCase().includes((e.target.value).toString().toLowerCase())){
                            // console.log('chiave',k)
                            // console.log('indice',row['id'])
                            // console.log('valore',row[k])
                            if(new_r.indexOf(row)===-1){
                                new_r.push(row)
                            }
                        }
                    }
                })

            })
            console.log('nuovo array',new_r)

            setFilteredRows(new_r)
        }

    }


    const FilterCell = (props) => {
        const { column } = props;
        if(column.name !== ''){
            return <TableFilterRow.Cell {...props} />;

        }
        else
        {
            return <th className="MuiTableCell-root MuiTableCell-head"> </th>
        }

    };
    function closeModalDelete(){
        setShowModalDelete(false)
    }
    function closeModalDeleteSingle(){
        SetShowModalDeleteSingle(false)
    }


    function closeAnnotationsStats(){
        SetShowAnnotationsStats(false)
        SetReportStats(false)
        SetIDToStats(false)

    }
    const closeReportText = () => {SetshowReportText(false);SetIDtoText(false)}
    const closeMajorityModal = () => {SetshowMajorityModal(false);SetIDtoMajority(false);SetShowMajorityGroundTruth(false)}

    useEffect(()=>{
        console.log('DOWNLOAD',ShowModalDownload)
        console.log('DOWNLOAD',RowsToDownload)

    },[ShowModalDownload,RowsToDownload])
    const closeModalDownload = () => {SetShowModalDownload(false);setSelection([]);SetRowsToDownload([])}

    return (

        <div>
            <TableToShowContext.Provider value={{selec:[selection, setSelection], showmodaldownloadtable:[ShowModalDownload,SetShowModalDownload],rowstodownload:[RowsToDownload,SetRowsToDownload]}}>

            <Modal
                show={ShowAnnotationsStats && IDToStats && ReportStats}
                dialogClassName='modal-80w'
                onHide={closeAnnotationsStats}
                // backdrop="static"
                // keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Annotations stats document {IDToStats['id_report']}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='body_anno'>
                    <ReportForModal stats={ReportStats} language={IDToStats['language']} id_report = {IDToStats['id_report']}/>
                </Modal.Body>

            </Modal>
                <Modal
                    show={ShowModalDownload && RowsToDownload.length >0}
                    dialogClassName='modal-80w'
                    onHide={closeModalDownload}
                    // backdrop="static"
                    // keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Download the ground-truths for {RowsToDownload.length} {RowsToDownload.length === 1 ? <>DOCUMENT</> : <>DOCUMENTS</>}</Modal.Title>

                    </Modal.Header>
                    <Modal.Body className='body_anno'>
                        <DownloadModalRep report_list = {RowsToDownload} />
                    </Modal.Body>

                </Modal>
                <Modal
                    show={IDtoMajority && ShowMajorityModal}
                    dialogClassName='modal-80w'
                    onHide={closeMajorityModal}
                    // backdrop="static"
                    // keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Majority vote ground-truth document {IDtoMajority['id_report']}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='body_anno'>
                        <MajorityVoteModal report={IDtoMajority} language={IDtoMajority['language']} topic={IDtoMajority['topic']} id_report = {IDtoMajority['id_report']}/>
                    </Modal.Body>

                </Modal>

            <Modal
                show={showReportText === true && IDtoText}
                onHide={closeReportText}
                size='lg'
                // backdrop="static"
                // keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Document {IDtoText['id_report']}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='body_text'>
                    <ReportToText report = {IDtoText} id_report={IDtoText['id_report']} language={IDtoText['language']} />
                </Modal.Body>

            </Modal>


            <Modal
                show={ShowModalDeleteSingle && IDToRemove !== []}
                onHide={closeModalDeleteSingle}
                // backdrop="static"
                // keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete 1 report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>

                        You are going to delete the following document: {IDToRemove['id_report']}
                        <hr/>
                    </div>
                    Removing this document will cause the deletion of <b>all</b> the ground truths created by users or automatically created for this report. Are you sure you want to delete the selected report?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModalDeleteSingle}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={(e)=>handleDeleteSingle(e,IDToRemove)}>Delete</Button>
                </Modal.Footer>
            </Modal>



            {showModalDelete && <Modal
                show={showModalDelete}
                onHide={closeModalDelete}
                // backdrop="static"
                // keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete {selection.length} documents</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        You are going to delete the following documents: <IconButton onClick={()=>SetShowIds(prev=>!prev)}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton>
                        <Collapse in={showIds}>
                        <div>
                        {selection.map(sel=>
                            <div>{filteredRows[sel]['id_report']}</div>
                        )}
                        </div>
                        <hr/>
                        </Collapse>
                    </div>
                    Removing documents will cause the deletion of <b>all</b> the ground truths created by users or automatically created. Are you sure you want to delete the selected report(s)?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModalDelete}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>handleDelete()}>Delete</Button>
                </Modal.Footer>
            </Modal>}
            <div>
                {(rows.length>0) && <div style={{ width:'100%' }}>
                    <div style={{marginTop:'3%',marginBottom:'2%','text-align':'center'}}>
                        <OverlayTrigger
                            key='left'
                            placement='left'
                            overlay={
                                <Tooltip id={`tooltip-left'`}>
                                    Click here to decide the columns displayed in the table
                                </Tooltip>
                            }
                        >
                        <Button  variant="primary" onClick={()=>SetShowColumns(st => !st)}>Columns</Button></OverlayTrigger>
                        {ShowColumns && <div >
                            <div style={{marginTop:'2%',marginBottom:'2%'}}><Button variant='info' size='sm' onClick={(e)=>handleChange(e,'all')}>Toggle All</Button>&nbsp;&nbsp;<Button size='sm' variant='info' onClick={(e)=>handleChange(e,'hide')} >Hide All</Button></div>
                            {props.columns.map((column,ind)=>
                                <span >
                                    {column.name !== 'id_report' && column.name !== '' && <label>
                                        <input name='check_columns' defaultChecked={ColumnsNew.indexOf(column) >=0} value={column.title} type="checkbox" onChange={(e)=>handleChange(e,column)} />{' '}
                                        {column.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </label>}
                                    {column.name === 'id_report' && <label>
                                        <input name='check_columns' disabled checked={true} value={column.title} type="checkbox" onChange={(e)=>handleChange(e,column)} />{' '}
                                        {column.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </label>}
                                    </span>
                            )}

                        </div>}
                        <hr/>
                        {/*<GridToolbarColumnsButton />*/}
                    </div>
                    <Row >
                        <Col md={7} style={{textAlign:'left'}}>
                            {selection.length >0 &&<div  style={{textAlign:'left'}}>
                                {selection.length === 1 ?
                                    <div><span >1 document selected&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <Button onClick={()=>setShowModalDelete(prev=>!prev)} size="sm" variant="danger" ><FontAwesomeIcon icon={faTrash} color='white'/>&nbsp;&nbsp;DELETE</Button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Button size="sm" variant="primary" onClick={()=>{SetRowsToDownload(filteredRows.filter(r=>selection.indexOf(r.id)>=0));SetShowModalDownload(prev=>!prev)}}><FontAwesomeIcon icon={faDownload} color='white'/>&nbsp;&nbsp;DOWNLOAD</Button>
                                    </div> :
                                    <div><span >{selection.length} documents selected&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <Button onClick={()=>{setShowModalDelete(prev=>!prev)}} size="sm" variant="danger" ><FontAwesomeIcon icon={faTrash}  color='white'/>&nbsp;&nbsp;DELETE</Button>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Button size="sm" variant="primary" onClick={()=>{SetRowsToDownload(filteredRows.filter(r=>selection.indexOf(r.id)>=0));SetShowModalDownload(prev=>!prev)}}><FontAwesomeIcon icon={faDownload}  color='white'/>&nbsp;&nbsp;DOWNLOAD</Button>
                                    </div>}
                            </div>}

                        </Col>
                        <Col md={5} style={{textAlign:'end'}}>
                            <TextField
                                onChange={(e)=>handleChangeTextFilter(e)}
                                id="standard-search"
                                label="Search..."
                                type="search"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}/>
                        {/*<TextField onChange={(e)=>handleChangeTextFilter(e)} id="standard-search" label="Search..." type="search" />*/}
                        </Col>

                    </Row>

                <Grid
                    rows={filteredRows}
                    columns={ColumnsNew}
                >


                    <DeleteDownloadTypeProvider for={deleteCols} />
                    <AnnotationStatsProvider for={['annotations']} />

                    <SearchState />

                    <PagingState
                        defaultCurrentPage={0}
                        defaultPageSize={5}
                    />
                    <SelectionState
                        selection={selection}
                        onSelectionChange={setSelection}
                    />
                    <IntegratedSelection />
                    <FilteringState columnExtensions={FilterExt} defaultFilters={[]} />
                    <IntegratedFiltering />
                    <SortingState defaultSorting={[{ columnName: 'annotations', direction: 'desc' }]}
                                  columnExtensions={sortingStateColumnExtensions}

                    />

                    <IntegratedSorting />
                    <IntegratedPaging />
                    <Table  />
                    <TableColumnResizing defaultColumnWidths={props.default_width}
                                         columnExtensions={ResizeExt} />
                    <TableHeaderRow showSortingControls />

                    <TableSelection showSelectAll />
                    <TableColumnVisibility
                        columnExtensions={tableColumnVisibilityColumnExtensions}
                    />
                    <TableFilterRow
                        cellComponent={FilterCell}
                    />

                    <PagingPanel
                        pageSizes={pageSizes}
                    />

                </Grid>
            </div> }
        </div>
        </TableToShowContext.Provider>
    </div>

    );
};







