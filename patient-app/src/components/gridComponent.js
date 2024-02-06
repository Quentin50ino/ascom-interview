import { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import EditModal from "./editModalComponent";

function GridComponent({columns, data, isReadOnly, sendDataToParent}) {

    let [displayData, setDisplayData] = useState(data);
    let [showAlert, setShowAlert] = useState(false);
    let [selectedPatient, setSelectedPatient] = useState({});

    useEffect(() => {
        setDisplayData(data);
    }, [data])

    function handleDataFromChild(data) {
        if(data.refreshPage){
            setShowAlert(false);
            sendDataToParent(data);
        } else if(data.closeModal){
            setShowAlert(false);
        }
    }


    function filterGrid(searchText, columnId){
        let filteredData = displayData.filter((item) => {
            return item[columnId].toLowerCase().startsWith(searchText.toLowerCase()) ? true : false;
        });
        setDisplayData(filteredData);
    }

    function openEditModal(item){
        if(!isReadOnly){
            setSelectedPatient(item);
            setShowAlert(true);
        }
    }

    function sortGrid(columnId){
        console.log("COOLUMN ID", columnId);
        //let sortedData = displayData.sort((a, b) => a[columnId] - b[columnId]);
        let sortedData = displayData.sort((a, b) => {
            const nameA = a[columnId].toUpperCase(); // ignore upper and lowercase
            const nameB = b[columnId].toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
        console.log("SORTED DATA: ", sortedData);
        setDisplayData(sortedData);
    }

    return (
        <>
            <Table striped bordered hover responsive> 
                <thead>
                    <tr>
                        {columns.map((column => {
                            return(
                            <th key={column.columnId}>
                                {column.columnName}
                                <input onChange={(e) => filterGrid(e.target.value, column.columnId)}/>
                                <button onClick={() => sortGrid(column.columnId)}>{column.isSortedDesc ? ' ↓' : ' ↑'}</button>
                            </th>)
                        }))}
                    </tr>
                </thead>
                <tbody>
                    {
                        displayData.map(item => {
                            return(
                                <tr onClick={() => openEditModal(item)}> 
                                    {columns.map((column => {
                                        return(<td key={column.columnId}>{item[column.columnId]}</td>)
                                    }))}
                                    {!isReadOnly ? <td>{item.parameters.length}</td> : null}
                                    {!isReadOnly ? <td>{item.parameters.filter(parameter => parameter.alarm).length !== 0 ? "Si" : "No"}</td> : null}
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