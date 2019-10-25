import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import QuestionArea from './QuestionArea';


export default class itemmodel extends Component {
  //  subAreas = this.props.subAreas;
  render() {
    const { subAreas } = this.props.subAreas;
    return this.props.subAreas.map((subArea, i) => {
     return <Accordion key={i} defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              {subArea.subName}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>{subArea.description}</Card.Body>
          </Accordion.Collapse>
        </Card>
       
      </Accordion>;
    });
  }
}
