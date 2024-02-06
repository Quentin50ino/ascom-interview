import { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import EditModal from "./editModalComponent";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import moment from"moment";

function GridComponent({columns, data, isReadOnly, sendDataToParent}) {

    let [displayData, setDisplayData] = useState([]);
    let [displayedColumns, setDisplayedColumns] = useState([]);
    let [showAlert, setShowAlert] = useState(false);
    let [selectedPatient, setSelectedPatient] = useState({});

    useEffect(() => {
        setDisplayData(data);
        setDisplayedColumns(columns)
    }, [data, columns])

    function handleDataFromChild(data) {
        if(data.refreshPage){
            setShowAlert(false);
            sendDataToParent(data);
        } else if(data.closeModal){
            setShowAlert(false);
        }
    }


    function filterGrid(searchText, columnId){
        let filteredData = data.filter((item) => {
            return item[columnId].toLowerCase().includes(searchText.toLowerCase().trim()) ? true : false;
        });
        setDisplayData(filteredData);
    }

    function openEditModal(item){
        if(!isReadOnly){
            setSelectedPatient(item);
            setShowAlert(true);
        }
    }

    function sortGrid(columnId, columnType, isSortedAsc){
        let sortedData = [...displayData].sort((a, b) => {
            const A = columnType !== Number ? a[columnId].toUpperCase() : a[columnId]; 
            const B = columnType !== Number ? b[columnId].toUpperCase() : b[columnId];
            if (A < B) {
              return isSortedAsc?-1:1;
            }
            if (A > B) {
              return isSortedAsc?1:-1;
            }
            return 0;
          });
          let newColumns = columns.map(column => {
            if(column.columnId === columnId) {
                return { ...column, isSortedAsc : !isSortedAsc };
            }
            return column;
          });
          setDisplayedColumns(newColumns);
          setDisplayData(sortedData);  
        }

    return (
        <>
            <Table striped bordered hover responsive> 
                <thead>
                    <tr>
                        {displayedColumns.map((column => {
                            return(
                            <th key={column.columnId}>
                                {column.columnName}
                                <div>
                                    <Form.Control type="text" onChange={(e) => filterGrid(e.target.value, column.columnId)}/>
                                    <Button variant="secondary" onClick={() => sortGrid(column.columnId, column.type, column.isSortedAsc)}>{column.isSortedAsc ?  '↓' : ' ↑'}</Button>
                                </div>
                            </th>)
                        }))}
                        {!isReadOnly && <th>N. of parameters</th>}
                        {!isReadOnly && <th>Alert</th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        displayData.map(item => {
                            return(
                                <tr onClick={() => openEditModal(item)} key={item.id}> 
                                    {columns.map((column => {
                                        return(
                                            <td key={column.columnId}>{ typeof item[column.columnId] !== "boolean" ? 
                                            (column.columnId !== "birthDate" ? item[column.columnId] : moment(item[column.columnId]).format('MM/DD/YYYY')): 
                                            (item[column.columnId] ? "Yes" : "No")}</td>
                                        )
                                    }))}
                                    {!isReadOnly && <td>{item.parameters.length}</td>}
                                    {!isReadOnly && <td>{item.parameters.filter(parameter => parameter.alarm).length !== 0 ? "Yes" : "No"}</td>}
                                </tr>
                            )
                        })
                    }
                </tbody>

            </Table>
            <EditModal propsShow={showAlert} sendDataToParent={handleDataFromChild} selectedPatient={selectedPatient}/>

        </>
    );
}

export default GridComponent;