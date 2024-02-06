import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GridComponent from './gridComponent';
import axios from "axios";
import Alert from 'react-bootstrap/Alert';


function EditModal({propsShow, sendDataToParent, selectedPatient}) {
    
  const [show, setShow] = useState(propsShow);
  const[showAlert, setShowAlert] = useState(false);
  let [familyName, setFamilyName] = useState("");
  let [givenName, setGivenName] = useState("");
  let [sex, setSex] = useState("");
  let [variant, setVariant] = useState("");

  useEffect(() => {
    setShow(propsShow);
    setFamilyName(selectedPatient.familyName);
    setGivenName(selectedPatient.givenName);
    setSex(selectedPatient.sex);
}, [propsShow, selectedPatient])

function closeModal() {
  sendDataToParent({closeModal : true});
}

const columns = [
  {
    columnId : "id",
    columnName : "ID",
    isSortedDesc : true
  },
  {
    columnId : "name",
    columnName : "Name",
    isSortedDesc : true
  },
  {
    columnId : "value",
    columnName : "Value",
    isSortedDesc : true
  },
  {
    columnId : "alarm",
    columnName : "Alarm",
    isSortedDesc : true
  },
]

function editPatient(){
  let requestBody = {
    id : selectedPatient.id,
    familyName : familyName,
    givenName : givenName,
    birthDate : selectedPatient.birthDate,
    sex : sex,
    parameters : selectedPatient.parameters
  }
  console.log("REQUEST BODY : ", requestBody);
  (async () => {
    const result = await axios.post("https://mobile.digistat.it/CandidateApi/Patient/Update", requestBody,
    {
        auth : {
            username : 'test',
            password : 'TestMePlease!'
        }
    });
    console.log("RESULT: ", result);
    if(result.status === 200){
      sendDataToParent({refreshPage : true});
      setVariant('success');
      setShowAlert(true);
    } else {
      sendDataToParent({refreshPage : true});
      setVariant('danger');
      setShowAlert(true);
    }
})();

}

  return (
    <>
            <Modal show={show} onHide={() => closeModal()} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton> 
              <Modal.Title>Patient Detaiils</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" value={selectedPatient.id} disabled/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Family Name</Form.Label>
                    <Form.Control type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>Given Name</Form.Label>
                    <Form.Control type="text"  value={givenName} onChange={(e) => setGivenName(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>Birth Date</Form.Label>
                    <Form.Control type="text"  value={selectedPatient.birthDate} disabled/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>Sex</Form.Label>
                    <Form.Control type="text" value={sex} onChange={(e) => setSex(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>N. of Paramaters</Form.Label>
                    <Form.Control type="text" disabled value={selectedPatient.parameters !== undefined ? selectedPatient.parameters.length : 0}/>
                  </Form.Group>
                </Form>
                <GridComponent columns={columns} data={selectedPatient.parameters} isReadOnly={true}/>
            </Modal.Body>
              <Modal.Footer>
                <Button style={{fontSize : '20px', padding : '10px 30px', borderRadius : '40px', backgroundColor : '#1DB954'}} variant='success' onClick={() => editPatient()}>Edit</Button>
              </Modal.Footer>
          </Modal>
          {showAlert && 
          <Alert key={variant} variant={variant} onClose={() => setShowAlert(false)} dismissible>
            {
              variant === "success" ? "Patient edited successfully" : (variant === "danger" ?  "Something went wrong. Please try again" : null )
            }
          </Alert>}
    </>
  );
}

export default EditModal;