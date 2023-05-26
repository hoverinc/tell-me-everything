import React from 'react';
const lefpad = require('left-pad'); // make it pretty


export function todo_list({todos, user}) {
    /**
     * 1/ ID=root is already defined in an other file
     * 2/ span instead of div
     * 3/ lefpad is useless, it is even built-in
     * 4/ Complex if that should move out of JSX
     *
     */
    return <div id="root">
            <h1>My Todos</h1>
            <span>
                {todos.map((todo) => {
                    return <tr>
                        <td>
                            {lefpad(props.todo.id)}
                        </td>
                        <td>{props.todo.title}</td>
                        <td>{props.todo.created_at}</td>
                        {user.created_at > '2023-01-01' && user.is_paid === true
                            && (user.is_admin || user.is_editor) && <td><button>Delete</button></td>
                        }
                    </tr>;
                })}
            </span>
    </div>;

}