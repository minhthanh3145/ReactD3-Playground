import React, { Component } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';
import ReactFileReader from 'react-file-reader';
import Services from '../utils/Services';

const StyledButton = styled(Button)`
    text-align: center;
    width: 100%;
`;

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: null,
            popoverMsg: '',
        };
        this.renderListOfFiles = this.renderListOfFiles.bind(this);
    }

    renderListOfFiles() {
        let thisRef = this;
        Services.getFiles().then(result => {
            thisRef.setState({
                data: result,
            });
        });
    }

    handleFiles = files => {
        let reader = new FileReader();

        reader.onprogress = function(e) {
            console.log("File is being read ...");
        }

        let thisRef = this;
        reader.onload = function(e) {
            console.log("File has been read and sent to the server !!");
            let csv = reader.result;
            Services.uploadFile(files[0].name, csv).then(result => {
                console.log(result.msg);
                thisRef.renderListOfFiles();
            });

        };
        reader.readAsText(files[0]);
    }

    componentDidMount() {
        this.renderListOfFiles();
    }

    render() {
        const { data } = this.state;
        return (
            <div>
                <ReactFileReader 
                        fileTypes={["csv"]}
                        handleFiles={this.handleFiles}>
                    <StyledButton variant="primary">
                        Upload a new file
                    </StyledButton>
                </ReactFileReader>
                {(data && data.map && (
                    <ListGroup>
                        {data.map(ele => (
                            <ListGroup.Item>
                                {ele}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ))}
            </div>
        )
    }
}

export default Upload;