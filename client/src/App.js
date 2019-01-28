import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Tabs, Tab, Button, Panel, Grid, Row, Col, Table} from 'react-bootstrap';
import op from 'object-path';

import * as config from './config';


class ImportCSV extends Component {

    state = {
        importMessage: ''
    };

    importToDB = async (urlToCSV) => {
        this.setState({importMessage: 'Request to backend!'});
        try {
            const res = await fetch(`${config.backendUrl}/importCSV`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                mode: 'no-cors',
                body: new URLSearchParams({url:urlToCSV})
            });
            const message = await res.json();
            this.setState({importMessage: op.get(message, 'message')});
        } catch (err) {
            this.setState({importMessage: `Error with import: ${err}`});
        }
    };

    render() {
        return (
            <div>
                <input
                    type="url"
                    style={{ width: "900px" }}
                    onChange={e => this.setState({ urlToCSV: e.target.value })}
                    placeholder="put url to csv file here"
                />
                <Button
                    bsStyle="primary"
                    onClick={() =>
                        this.importToDB(this.state.urlToCSV)
                    }
                >
                    Start import
                </Button>
                <Panel expanded={this.state.importMessage.length > 0} onToggle={()=>{}}>
                    <Panel.Collapse>
                        <Panel.Body>{this.state.importMessage}</Panel.Body>
                    </Panel.Collapse>
                </Panel>
            </div>
        );
    }

}


class UsedForms extends Component {

    constructor() {
        super();
        this.state = {
            usedFormsData: []
        };
    }

    componentDidMount() {

        fetch(`${config.backendUrl}/usedForms`).then(res => res.json()).then(json => {
            this.setState({usedFormsData: op.get(json, 'result')});
        });
    }

    render() {

        if (!this.state.usedFormsData.length) return <div>Loading</div>;

        return (
            <div>
                <h1>List of users and forms they use in the last hour!</h1>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>user</th>
                        <th>form</th>
                        <th>time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.usedFormsData.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ssoid}</td>
                            <td>{item.formid}</td>
                            <td>{item.ts}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    }

}


class UnfinishedForms extends Component {

    constructor() {
        super();
        this.state = {
            unfinishedFormsData: []
        };
    }

    componentDidMount() {

        fetch(`${config.backendUrl}/unfinishedForms`).then(res => res.json()).then(json => {
            this.setState({unfinishedFormsData: op.get(json, 'result')});
        });
    }

    render() {

        if (!this.state.unfinishedFormsData.length) return <div>Loading</div>;

        return (
            <div>
                <h1>List of users and forms they use and hasn't finished!</h1>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Form</th>
                        <th>Url</th>
                        <th>Time start</th>
                        <th>Time stop</th>
                        <th>Step</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.unfinishedFormsData.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ssoid}</td>
                            <td>{item.formid}</td>
                            <td>{item.url}</td>
                            <td>{item.timeStart}</td>
                            <td>{item.timeStop}</td>
                            <td>{item.subtype}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    }

}


class Top5 extends Component {

    constructor() {
        super();
        this.state = {
            top5Data: []
        };
    }

    componentDidMount() {

        fetch(`${config.backendUrl}/top5`).then(res => res.json()).then(json => {
            this.setState({top5Data: op.get(json, 'result')});
        });
    }

    render() {

        if (!this.state.top5Data.length) return <div>Loading</div>;

        return (
            <div>
                <h1>Top 5 form!</h1>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Form</th>
                        <th>Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.top5Data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item._id}</td>
                            <td>{item.n}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}


class App extends Component {

    constructor() {
        super();
        this.state = {
            activePlace: 0,
        };
    }

    render() {
        return (
            <div>
                <Grid>
                    <Row>
                        <Col md={12} sm={12}>
                            <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
                                <Tab eventKey={1} title="Import CSV">
                                    <ImportCSV/>
                                </Tab>
                                <Tab eventKey={2} title="Used forms">
                                    <UsedForms/>
                                </Tab>
                                <Tab eventKey={3} title="Unfinished forms">
                                    <UnfinishedForms/>
                                </Tab>
                                <Tab eventKey={4} title="TOP 5">
                                    <Top5/>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default App;
