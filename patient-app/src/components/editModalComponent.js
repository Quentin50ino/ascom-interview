import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import GridComponent from "./gridComponent";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import parameterTableColumns from "../models/parameterTableColumns";
import endpoints from "../endpoints/endpoints";

function EditModal({ propsShow, sendDataToParent, selectedPatient }) {
  const columns = parameterTableColumns;
  const [show, setShow] = useState(propsShow);
  const [showAlert, setShowAlert] = useState(false);
  let [familyName, setFamilyName] = useState("");
  let [givenName, setGivenName] = useState("");
  let [sex, setSex] = useState("");
  let disabledButton =
    (familyName === selectedPatient.familyName &&
      givenName === selectedPatient.givenName &&
      sex === selectedPatient.sex) ||
    familyName === "" ||
    givenName === "" ||
    sex === "";

  useEffect(() => {
    setShow(propsShow);
    setFamilyName(selectedPatient.familyName);
    setGivenName(selectedPatient.givenName);
    setSex(selectedPatient.sex);
  }, [propsShow, selectedPatient]);

  const closeModal = () => {
    sendDataToParent({ closeModal: true });
  };

  const editPatient = async () => {
    let requestBody = {
      id: selectedPatient.id,
      familyName: familyName,
      givenName: givenName,
      birthDate: selectedPatient.birthDate,
      sex: sex,
      parameters: selectedPatient.parameters,
    };
    const result = await axios.post(endpoints.UPDATE_PATIENT, requestBody, {
      auth: endpoints.AUTH,
    });
    if (result.status === 200) {
      sendDataToParent({ refreshPage: true });
    } else {
      sendDataToParent({ closeModal: true });
      setShowAlert(true);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => closeModal()}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="d-flex">
              <Form.Group
                className="mb-3 me-3 w-100"
                controlId="familyNameInput"
              >
                <Form.Label>Family Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3 w-100" controlId="givenNameInput">
                <Form.Label>Given Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3 me-3 w-100"
                controlId="birthDateInput"
              >
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                  className="cursor-not-allowed"
                  type="text"
                  value={moment(selectedPatient.birthDate).format("DD/MM/YYYY")}
                  readonly
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3 w-100" controlId="sexInput">
                <Form.Label>Sex *</Form.Label>
                <Form.Control
                  type="text"
                  maxLength={1}
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group
                className="mb-3 me-3 w-100"
                controlId="nOfParametersInput"
              >
                <Form.Label>N. of Paramaters</Form.Label>
                <Form.Control
                  className="cursor-not-allowed"
                  type="text"
                  readonly
                  disabled
                  value={
                    selectedPatient.parameters !== undefined
                      ? selectedPatient.parameters.length
                      : 0
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3 w-100" controlId="alertInput">
                <Form.Label>Alert</Form.Label>
                <Form.Control
                  className="cursor-not-allowed"
                  type="text"
                  readonly
                  disabled
                  value={
                    selectedPatient.parameters !== undefined
                      ? selectedPatient.parameters.some(
                          (parameter) => parameter.alarm
                        )
                        ? "⚠"
                        : "✅"
                      : 0
                  }
                />
              </Form.Group>
            </div>
          </Form>
          <div className="mt-4 d-flex justify-content-end">
            <Button
              style={{
                fontSize: "20px",
                padding: "10px 30px",
                borderRadius: "40px",
                backgroundColor: "#1DB954",
              }}
              variant="success"
              onClick={() => editPatient()}
              disabled={disabledButton}
            >
              Edit
            </Button>
          </div>
          <h3 className="mt-5 mb-3 App">Parameters List</h3>
          <GridComponent
            columns={columns}
            data={selectedPatient.parameters}
            isReadOnly={true}
          />
        </Modal.Body>
      </Modal>
      {showAlert && (
        <Alert
          key={'danger'}
          variant={'danger'}
          onClose={() => setShowAlert(false)}
          dismissible>
            Something went wrong. Please try again
          </Alert>
      )}
    </>
  );
}

export default EditModal;
