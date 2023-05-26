import React from 'react';
import * as API from './api';
import {todo_list} from './TodoList.jsx';

class Root extends React.Component {
    componentDidMount() {
        // On ne peut pas utiliser await dans componentDidMount
        API.loadLodos((todos) => {
            this.setState('todos', todos)
        });
    }

    render() {
        return <body>
            <div id="root">
                <todo_list todos={this.state.todos} user={window.user}/>
            </div>
        </body>;
    }
}




