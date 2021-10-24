import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import React, {useContext, useState} from "react";
import {AppContext} from "../../App";


function CardDelete(props) {
    const { action } = useContext(AppContext);
    const [Action, SetAction] = action;
    const [show, setShow] = useState(true);



        return (
            <>
                <Alert show={show} variant="success">
                    <Alert.Heading>How's it going?!</Alert.Heading>
                    <p>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
                        lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => setShow(false)} variant="outline-success">
                            Close me y'all!
                        </Button>
                    </div>
                </Alert>

                {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>}
            </>
        );


    // return(
    // <Card style={{width: '18rem'}}>
    //     <Card.Body>
    //         <Card.Title>Attention</Card.Title>
    //         <Card.Text>
    //             {Action === 'labels' && <div>All the labels you you selected will be deleted. Do you want to continue?</div>}
    //
    //         </Card.Text>
    //         <Button variant="primary">Yes</Button>
    //         <Button variant="danger">No</Button>
    //     </Card.Body>
    // </Card>
    // );
}
export default CardDelete