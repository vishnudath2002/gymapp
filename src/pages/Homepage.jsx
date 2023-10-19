import React, { useState, useEffect } from 'react';
import { collection, getDocs} from "firebase/firestore";
import 'firebase/database';
import { db } from "../Firebase/firebaseConfig"
import Navi from "../components/Navi"
import { Table ,Form} from 'react-bootstrap';


const Homepage = () => {
  const [details, setDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    // Assuming you have already initialized Firebase elsewhere in your app.
    const getData = async () => {
      const parkingData = await getDocs(collection(db, "users"));
      // Reverse the data array before setting to state
      setDetails(parkingData.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse());
      console.log(parkingData);
  };

  getData(); // Cleanup listener on component unmount
  }, []);
  
  const filteredDetails = details.filter(detail => {
    if (searchTerm === "") {
        return detail;
    } else if (
        detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.admission.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
        return detail;
    }
    return false;
  });

 

  return (
    <>
    <Navi />
    <Form.Group>
        <Form.Control 
            type="text" 
            placeholder="Search by name or admission "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </Form.Group>
   <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No:</th>
            <th>Name</th>
            <th>Admission</th>
            <th>Mobile Number</th>
            
          </tr>
        </thead>
        <tbody>
          {filteredDetails.map((detail, index) => (
            <tr key={detail.id}>
              <td>{index + 1}</td> 
              <td>{detail.name}</td>
              <td>{detail.admission}</td>
              <td>{detail.number}</td>
             
            </tr>
          ))}
        </tbody>
      </Table>
    
    </>
  );
}

export default Homepage;
