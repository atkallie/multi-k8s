import React, { Component } from 'react';
import axios from 'axios';


class Fib extends Component {
    constructor(props){
        super(props);
        this.state = {
            seenIndices: [],
            values: {},
            index: ''
        };
    }

    async componentDidMount(){
        // this.fetchValues();
        // this.fetchIndices();
    }

    fetchValues = async () => {
        const { data } = await axios.get('/api/values/current/');
        this.setState({ values: data });
    }

    fetchIndices = async () => {
        const { data } = await axios.get('/api/values/all/');
        this.setState({ seenIndices: data });
    }

    renderSeenIndices = () => (
        (this.state.seenIndices || []).map(({ number }) => number).join(', ')
    )

    renderValues = () => {
        const entries = [];
        const { values } = this.state;
        for(let key in values){
            const result = (
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            )
            entries.push(result);
        }
        return entries;
    }

    handleChange = (event) => {
        const { value: index } = event.target;
        this.setState({ index });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { index } = this.state;
        await axios.post('/api/values/', { index });
        this.setState({ index: '' });

        this.fetchValues();
        this.renderValues();
    }

    render(){
        const { index } = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>(k8s) Enter your index:</label>
                    <input
                        type="text" value={index}
                        onChange={this.handleChange}
                    />
                    <button type="submit">Submit</button>
                </form>

                <h3>Indices I Have Seen:</h3>
                {this.renderSeenIndices()}

                <h3>Calculated Values:</h3>
                {this.renderValues()}
            </div>
        )
    }
}

export default Fib;
