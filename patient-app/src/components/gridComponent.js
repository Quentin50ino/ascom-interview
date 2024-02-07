import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import EditModal from "./editModalComponent";
import Form from "react-bootstrap/Form";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function GridComponent({ columns, data, isReadOnly, sendDataToParent }) {
  let [displayData, setDisplayData] = useState([]);
  let [displayedColumns, setDisplayedColumns] = useState([]);
  let [showAlert, setShowAlert] = useState(false);
  let [selectedPatient, setSelectedPatient] = useState({});

  useEffect(() => {
    setDisplayData(data);
    setDisplayedColumns(columns);
  }, [data, columns]);

  const handleDataFromChild = (data) => {
    if (data.refreshPage) {
      setShowAlert(false);
      sendDataToParent(data);
    } else if (data.closeModal) {
      setShowAlert(false);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  const filterGrid = (searchText, columnId) => {
    let filteredData = data.filter((item) => {
      return columnId === "nOfParameters"
        ? item.parameters.length
            .toString()
            .includes(searchText.toLowerCase().trim())
        : columnId === "alert"
        ? item.parameters
            .some((parameter) => parameter.alarm)
            .toString()
            .includes(searchText.toLowerCase().trim())
        : item[columnId]
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase().trim())
        ? true
        : false;
    });
    setDisplayData(filteredData);
  };

  const openEditModal = (item) => {
    if (!isReadOnly) {
      setSelectedPatient(item);
      setShowAlert(true);
    }
  };

  const sortGrid = (columnId, columnType, isSortedAsc) => {
    let sortedData = [...displayData].sort((a, b) => {
      let A =
        columnType !== Number && columnType !== Boolean
          ? a[columnId].toUpperCase()
          : a[columnId];
      let B =
        columnType !== Number && columnType !== Boolean
          ? b[columnId].toUpperCase()
          : b[columnId];
      if (columnId === "nOfParameters") {
        A = a.parameters.length;
        B = b.parameters.length;
      } else if (columnId === "alert") {
        A = a.parameters.some((parameter) => parameter.alarm).toString();
        B = b.parameters.some((parameter) => parameter.alarm).toString();
      }
      if (A < B) {
        return isSortedAsc ? -1 : 1;
      }
      if (A > B) {
        return isSortedAsc ? 1 : -1;
      }
      return 0;
    });
    let newColumns = [...displayedColumns].map((column) => {
      if (column.columnId === columnId) {
        return { ...column, isSortedAsc: !isSortedAsc };
      }
      return column;
    });
    setDisplayedColumns(newColumns);
    setDisplayData(sortedData);
  };

  return (
    <div>
      <Table variant="dark" striped bordered hover responsive>
        <thead>
          <tr>
            {displayedColumns.map((column) => {
              return (
                <th key={column.columnId} className="py-3 px-3">
                  {column.columnName}
                  <div className="d-flex my-2">
                    <Form.Control
                      type="text"
                      onChange={(e) =>
                        filterGrid(e.target.value, column.columnId)
                      }
                      placeholder="Search"
                    />
                    <div
                      className="cursor-pointer ms-1 d-flex flex-column justify-content-center"
                      onClick={() =>
                        sortGrid(
                          column.columnId,
                          column.type,
                          column.isSortedAsc
                        )
                      }
                    >
                      {column.isSortedAsc ? (
                        <img
                          width="28"
                          height="32"
                          src="https://img.icons8.com/external-dashed-line-kawalan-studio/96/40C057/external-sort-descending-shopping-e-commerce-dashed-line-kawalan-studio.png"
                          alt="external-sort-descending-shopping-e-commerce-dashed-line-kawalan-studio"
                        />
                      ) : (
                        <img
                          width="28"
                          height="32"
                          src="https://img.icons8.com/external-dashed-line-kawalan-studio/96/40C057/external-sort-ascending-shopping-e-commerce-dashed-line-kawalan-studio.png"
                          alt="external-sort-ascending-shopping-e-commerce-dashed-line-kawalan-studio"
                        />
                      )}
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {displayData.map((item) => {
            return (
              <tr
                className={`${
                  !isReadOnly ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => openEditModal(item)}
                key={item.id}
              >
                {columns.map((column) => {
                  return (
                    <td key={column.columnId} className="py-4">
                      {column.columnId === "birthDate" ? (
                        moment(item[column.columnId]).format("DD/MM/YYYY")
                      ) : column.columnId === "nOfParameters" ? (
                        item.parameters.length
                      ) : column.columnId === "alert" ? (
                        item.parameters.some((parameter) => parameter.alarm) ? (
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip(
                              "At least an alarm is present inside parameters"
                            )}
                          >
                            <img
                              width="32"
                              height="32"
                              src="https://img.icons8.com/ios/100/FA5252/error--v1.png"
                              alt="error--v1"
                            />
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip(
                              "No alarm is present inside parameters"
                            )}
                          >
                            <img
                              width="32"
                              height="32"
                              src="https://img.icons8.com/ios/100/40C057/ok--v1.png"
                              alt="ok--v1"
                            />
                          </OverlayTrigger>
                        )
                      ) : (
                        item[column.columnId].toString()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <EditModal
        propsShow={showAlert}
        sendDataToParent={handleDataFromChild}
        selectedPatient={selectedPatient}
      />
    </div>
  );
}

export default GridComponent;
