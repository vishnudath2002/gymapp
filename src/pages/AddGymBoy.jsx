// AddGymBoy.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import Navi from '../components/Navi';
import { db } from '../Firebase/firebaseConfig'
import { collection,addDoc, setDoc ,serverTimestamp} from 'firebase/firestore';

function AddGymBoy() {
    const [name, setName] = useState("");
    const [admission, setAdmission] = useState("")
    const [number, setNumb] = useState("")
    const [amount, setAmount] = useState("")
    const [isNumberValid, setIsNumberValid] = useState(true);

   
    const collectionRef = collection(db, 'users');

    const validateNumber = (value) => {
        if (value.length !== 10) {
            setIsNumberValid(false);
        } else {
            setIsNumberValid(true);
        }
        setNumb(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
       
        // Handle form data submission here, e.g., send to backend
        try {
            const currMonth = new Date().toLocaleString([], {
                month: 'long',
              });
              const currentTime = serverTimestamp();
            await addDoc(collectionRef, {
              name,
              admission,
              number ,
              amount:{
                [currMonth]:amount
              },
              date:currentTime
              
            });
             setName("");
             setAmount("");
             setAdmission("");
             setNumb("");
          } catch (err) {
            alert(" Not Data added");
            console.log(err);
          }
    };

    const isValidForm = () => {
        return name && admission && (number.length === 10) && amount;
    }

    return (
        <>
        <Navi />
        <Container>
            
            <h2 className="mt-5">Add Admission</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control type="tel" name="mobileNumber" value={number} onChange={(e) => validateNumber(e.target.value)} required />
                    {!isNumberValid && (
                            <div className="text-danger">
                                Mobile number must be exactly 10 digits.
                            </div>
                        )}
                </Form.Group>

                <Form.Group>
                    <Form.Label>Admission Number</Form.Label>
                    <Form.Control type="text" name="admissionNumber" value={admission} onChange={(e) => setAdmission(e.target.value)} required />
                </Form.Group>

                 {/* <Form.Group>
                    <Form.Label>Date of Join</Form.Label>
                    <Form.Control type="date" name="dateOfJoin" value={date} required />
                </Form.Group> */}
                
                <Form.Group>
                
                    <Form.Label>Pay Amount (per month in year)</Form.Label>
                    <Form.Control type="number" name="payAmount" value={amount} onChange={(e) => setAmount(e.target.value)}  required />
                </Form.Group> 
                   <br />
                <Button variant="primary" type="submit" disabled={!isValidForm()}>
                    Submit
                </Button>
            </Form>
        </Container>
        </>
    );
}

export default AddGymBoy;
