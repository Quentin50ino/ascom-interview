import { useEffect, useState } from "react";
import axios from "axios";
import GridComponent from "../components/gridComponent";

function PatientList() {

  function handleDataFromChild(data){
    if(data.refreshPage){
      getPatientList();
    }
  }

    // data state to store the TV Maze API data. Its initial value is an empty array
    const [data, setData] = useState([]);
    const columns = [
      {
        columnId : "id",
        columnName : "ID",
        isSortedDesc : true
      },
      {
        columnId : "familyName",
        columnName : "Family Name",
        isSortedDesc : true
      },
      {
        columnId : "givenName",
        columnName : "Given Name",
        isSortedDesc : true
      },
      {
        columnId : "birthDate",
        columnName : "Birth Date",
        isSortedDesc : true
      },
      {
        columnId : "sex",
        columnName : "Sex",
        isSortedDesc : true
      },

    ]

    async function getPatientList(){
      const result = await axios.get("https://mobile.digistat.it/CandidateApi/Patient/GetList", 
      {
          auth : {
              username : 'test',
              password : 'TestMePlease!'
          }
      });
      setData(result.data);
    }

    // Using useEffect to call the API once mounted and set the data
    useEffect(() => {
      getPatientList();
    }, []);

      return <GridComponent columns={columns} data={data} sendDataToParent={handleDataFromChild}/>;
}

export default PatientList;