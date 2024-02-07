import { useEffect, useState } from "react";
import axios from "axios";
import GridComponent from "../components/gridComponent";
import patientTableColumns from "../models/patientTableColumns";
import endpoints from "../endpoints/endpoints";
import Spinner from 'react-bootstrap/Spinner';
import Alert from "react-bootstrap/Alert";

function PatientList() {
  const columns = patientTableColumns;
  const [data, setData] = useState([]);
  const [showSpinner, setShowSpinner] = useState();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    getPatientList();
  }, []);

  const getPatientList = async () => {
    setShowSpinner(true);
    const result = await axios.get(endpoints.GET_LIST, {
      auth: endpoints.AUTH,
    });
    setShowSpinner(false);
    setData(result.data);
  };

  const handleDataFromChild = (data) => {
    if (data.refreshPage) {
      getPatientList();
      setShowAlert(true);
    }
  };

  if(!showSpinner){
    return (
      <div className="px-5 d-flex flex-column justify-content-center">
        <h2 className="my-5">Patients List</h2>
        <GridComponent
          columns={columns}
          data={data}
          sendDataToParent={handleDataFromChild}
        />
        {showAlert && (
          <Alert
            key={'success'}
            variant={'success'}
            onClose={() => setShowAlert(false)}
            dismissible>
              Patient edited successfully!
          </Alert>
        )}
      </div>
    );
  } else {
    return (
      <div className="spinner">
        <Spinner animation="border" variant="dark"/>
      </div>
    )
  }
}

export default PatientList;
