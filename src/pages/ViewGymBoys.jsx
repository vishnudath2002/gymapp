import React, { useState, useEffect } from 'react';
import { collection, getDocs,doc,updateDoc,deleteDoc,Timestamp} from "firebase/firestore";
import 'firebase/database';
import { db } from "../Firebase/firebaseConfig"
import Navi from "../components/Navi"
import { Table, Button, Dropdown ,Badge , Modal, Form } from 'react-bootstrap';
import { jsPDF } from 'jspdf';



const generatePDF = (data) => {
    const { name, admission, date, number, amount } = data;
    const doc = new jsPDF();

    let yPos = 10;  // Start position for the first line

    doc.text(`Details for ${name}`, 10, yPos);
    yPos += 10;

    doc.text(`Admission: ${admission}`, 10, yPos);
    yPos += 10;

    doc.text(`Date: ${new Date(date.seconds * 1000).toLocaleDateString()}`, 10, yPos);
    yPos += 10;

    doc.text(`Number: ${number}`, 10, yPos);
    yPos += 10;

    doc.text('Payments:', 10, yPos);
    yPos += 10;

    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].forEach(month => {
        doc.text(`${month}: ${amount[month] || 0}`, 10, yPos);
        yPos += 10;
    });

    doc.save(`${name}_${new Date().getFullYear()}.pdf`);
};


const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setNewPhoto(file);
  }
};



const ViewGymBoys = () => {
  const [details, setDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newPhoto, setNewPhoto] = useState(null); 
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2023, 2024, 2025, 2026, 2027, 2028];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showImageModal, setShowImageModal] = useState(false);


  const openEditModal = (detail) => {
      setCurrentEdit(detail);
      setShowModal(true);
  }

  const closeEditModal = () => {
      setShowModal(false);
      setCurrentEdit(null);
  }

   
  const handleAmountChange = (month, value) => {
    setCurrentEdit(prevState => ({
        ...prevState,
        amount: {
            ...prevState.amount,
            [selectedYear]: {
                ...(prevState.amount?.[selectedYear] || {}),
                [month]: value
            }
        }
    }));
};



    const handleUpdate = async () => {
      try {
        let updatedDetails = { ...currentEdit };
          
        // Check if a new photo has been uploaded
        if (newPhoto) {
          const newPhotoUrl = await uploadPhoto(newPhoto); // Assuming your uploadPhoto function returns the new URL
          updatedDetails.photoUrl = newPhotoUrl;
        }
    
        const docRef = doc(db, "users", currentEdit.id);
        await updateDoc(docRef, updatedDetails);
    
        closeEditModal();
        getData();
    
        setNewPhoto(null); // Reset the newPhoto state
      } catch (error) {
        console.error("Error updating document: ", error);
        alert(`An error occurred: ${error.message || "Unknown error"}`);
      }
    };
    

const handleDelete = async (id) => {
    try {
        const docRef = doc(db, "users", id);
        await deleteDoc(docRef);
       

        // Refresh your data after deletion
       getData();
        
    } catch (error) {
      alert("Document not deleted!");
        console.error("Error deleting document: ", error);
    }
};


const setAllPaymentsToZero = () => {
  setCurrentEdit({
      ...currentEdit,
      amount: {
          "January": 0,
          "February": 0,
          "March": 0,
          "April": 0,
          "May": 0,
          "June": 0,
          "July": 0,
          "August": 0,
          "September": 0,
          "October": 0,
          "November": 0,
          "December": 0
      }
  });
};

const getData = async () => {
  const parkingData = await getDocs(collection(db, "users"));
  // console.log(parkingData);
  setDetails(parkingData.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse());
  console.log(parkingData);
};

  useEffect(() => {
    // Assuming you have already initialized Firebase elsewhere in your app.
   
  
      getData(); // Cleanup listener on component unmount
  }, []);
  
  const getCurrentMonthName = () => {
    const currentDate = new Date();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[currentDate.getMonth()];
};

  const timestampToISODate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString().split("T")[0];
    }
    return "";
};

    
const renderPaymentsDropdown = (amount, year) => {
    if (typeof amount !== 'object' || amount === null || Object.keys(amount).length === 0) {
        return null;  // Nothing to display
    }

    const paymentsForYear = amount[year];

    if (!paymentsForYear) return null;

    return (
        <Dropdown drop="left">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Payments
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {months.map(month => (
                    <Dropdown.Item key={month}>
                        {`${month}: ${paymentsForYear[month] || 0}`}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

  // const isPaidForCurrentMonth = (detail) => {
  //   return detail.amount && detail.amount[getCurrentMonthName()];
  // };



  const filteredDetails = details.filter(detail => {
    if (filterStatus === 'notPaid') {
      if (detail.amount && detail.amount[selectedYear] && detail.amount[selectedYear][getCurrentMonthName()]) {
        return false;  // skip this detail if we're filtering 'notPaid' and this detail is paid for current month and year
      }
    } else {  // If you want to add a 'paid' filter in the future, you'd handle it here
      // ...
    }

    if (searchTerm) {
        return (
          detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          detail.admission.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return true;  // Return all details if no searchTerm
});


  return (
    <>
    <Navi  />

    <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
          <Modal.Body className="text-center">
              <img src={currentEdit?.imageUrl} alt={currentEdit?.name} style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          </Modal.Body>
          <Modal.Footer>
              <Button variant="danger" onClick={() => setShowImageModal(false)}>
                  Close
              </Button>
          </Modal.Footer>
      </Modal>

    <div className="d-flex align-items-center p-3">
    <Form className="flex-grow-1 mr-3">  {/* Adjusted for flex layout */}
          <Form.Group>
            <Form.Control 
                type="text" 
                placeholder="Search by name or admission "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>
                 
        <div className="d-inline-block bg-light border rounded px-3 py-1 mx-3">
        
        {filteredDetails.length} 
       </div>
        {/* Filter Dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="info" id="statusFilterDropdown">
              Status 
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setFilterStatus('all')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterStatus('notPaid')}>Not Paid (Current Month)</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
    </div>
   <Table striped bordered hover responsive >
        <thead>
          <tr>
            <th>Name</th>
            <th>Ad</th>
            <th>Date</th>
            <th>Mobile no:</th>
            <th>Status </th>
            <th>Payments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDetails.map(detail => (
            <tr key={detail.id}>
              <td>{detail.name}</td>
              <td>{detail.admission}</td>
              <td>{timestampToISODate(detail.date)}</td>
              <td>{detail.number}</td>
              <td>
         {detail.amount && detail.amount[selectedYear] && detail.amount[selectedYear][getCurrentMonthName()] ? 
        <Badge variant="success">Paid</Badge> : 
        <Badge className="not-paid-badge">Not Paid</Badge>
        }
        </td>

              <td>
              {renderPaymentsDropdown(detail.amount, selectedYear)}
            </td>
              <td>
                <Button variant="warning" onClick={() => openEditModal(detail)}>Update</Button> {' '}
                <Button variant="danger" onClick={() => handleDelete(detail.id)}>Delete</Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {currentEdit && (
                <Modal show={showModal} onHide={closeEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <Form.Group>
                          <Form.Label>Profile Photo</Form.Label>
                            <img
                            src={currentEdit.imageUrl}
                            alt={currentEdit.name}
                            style={{ width: '100px', height: '100px', display: 'block', cursor: 'pointer' }}
                            onClick={() => setShowImageModal(true)}
                        />
                             <Form.Control type="file" onChange={handlePhotoChange} />
                           </Form.Group>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" defaultValue={currentEdit.name} onChange={(e) => setCurrentEdit({...currentEdit, name: e.target.value})} />
                            </Form.Group>
                            <Form.Group>
                    <Form.Label>Admission</Form.Label>
                    <Form.Control 
                        type="text" 
                        defaultValue={currentEdit.admission} 
                        onChange={(e) => setCurrentEdit({...currentEdit, admission: e.target.value})} 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date of join</Form.Label>
                    <Form.Control 
                        type="date" 
                        defaultValue={timestampToISODate(currentEdit.date)}
                        onChange={(e) => setCurrentEdit({...currentEdit, date: Timestamp.fromDate(new Date(e.target.value))})}
 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Mobile No:</Form.Label>
                    <Form.Control 
                        type="text" 
                        defaultValue={currentEdit.number} 
                        onChange={(e) => setCurrentEdit({...currentEdit, number: e.target.value})} 
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Payments for Each Month</Form.Label><br />
                    <Dropdown className="mb-2">
            <Dropdown.Toggle variant="info" id="yearDropdown">
                {selectedYear}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {years.map(year => (
                    <Dropdown.Item key={year} onClick={() => setSelectedYear(year)}>
                        {year}
                    </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                {/* Option to set all months to zero for the selected year */}
                <Dropdown.Item onClick={setAllPaymentsToZero}>
                    Set All to Zero for {selectedYear}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

        {months.map((month) => (
        <div key={month}>
        <Form.Label>{month}</Form.Label>
        <Form.Control 
            type="text" 
            value={currentEdit.amount?.[selectedYear]?.[month] || ""} 
            placeholder={`Enter amount for ${month} ${selectedYear}`} 
            onChange={(e) => handleAmountChange(month, e.target.value)}
        />
          </div>
       ))}

    </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEditModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Save 
                        </Button>
                        <Button variant="info" onClick={() => generatePDF(currentEdit)}>
                         Download  
                         </Button>
                    </Modal.Footer>
                </Modal>
            )}
    </>
  );
}

export default ViewGymBoys;
