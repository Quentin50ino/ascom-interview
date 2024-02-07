import { useEffect, useState } from "react";
import axios from "axios";
import GridComponent from "../components/gridComponent";
import patientTableColumns from "../models/patientTableColumns";
import endpoints from "../endpoints/endpoints";

function PatientList() {
  const columns = patientTableColumns;
  const [data, setData] = useState([]);

  useEffect(() => {
    getPatientList();
  }, []);

  const getPatientList = async () => {
    const result = await axios.get(endpoints.GET_LIST, {
      auth: endpoints.AUTH,
    });
    setData(result.data);
  };

  const handleDataFromChild = (data) => {
    if (data.refreshPage) {
      getPatientList();
    }
  };

  return (
    <div className="px-5 d-flex flex-column justify-content-center">
      <h2 className="my-5">Patients List</h2>
      <GridComponent
        columns={columns}
        data={data}
        sendDataToParent={handleDataFromChild}
      />
    </div>
  );
}

export default PatientList;
