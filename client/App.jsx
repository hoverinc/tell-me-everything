import React from 'react';
import * as API from './api';
import {todo_list} from './TodoList.jsx';

/**
 * If user is on the global namespace, we probably want to inject it in the app
 * when the root Componen is mounted
 */
class Root extends React.Component {
    componentDidMount() {
        /**
         * 1. Comments in French
         * 2. no error control for the network stuff. UI is broken if not there
         */
        // On ne peut pas utiliser await dans componentDidMount
        API.loadLodos((todos) => {
            this.setState('todos', todos)
        });
    }

    render() {
        /**
         * Does not handle the case of state being null/undefined
         */
        return <body>
            <div id="root">
                <todo_list todos={this.state.todos} user={window.user}/>
            </div>
        </body>;
    }
}




