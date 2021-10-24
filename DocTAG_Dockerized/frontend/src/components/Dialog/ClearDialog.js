import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {confirmable, createConfirmation} from 'react-confirm';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {AppContext} from "../../App";

const ClearDialog = ({show, proceed, confirmation, options}) => {

    return(
        <div>
            <Modal show={show} onHide={() => proceed(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Attention</Modal.Title>
                </Modal.Header>
                <Modal.Body>{confirmation}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => proceed(false)}>
                        No
                    </Button>
                    <Button variant="primary" onClick={() => proceed(true)}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        {/*<Modal onHide={() => proceed(false)} show={show}>*/}
        {/*    {confirmation}*/}
        {/*    <button onClick={() => proceed(false)}>No</button>*/}
        {/*    <button onClick={() => proceed(true)}>Yes</button>*/}
        {/*</Modal>*/}
    </div>
    );



}

ClearDialog.propTypes = {
    show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
    proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
    confirmation: PropTypes.string,  // arguments of your confirm function
    options: PropTypes.object        // arguments of your confirm function
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(ClearDialog);
