 import React   from "react";

 /**
  * Unused component
  */
 export function Row(props){
     return <tr>
        <td>
            {lefpad(props.todo.id)}
        </td>
        <td>{props.todo.title}</td>
        <td>{props.todo.created_at}</td>
        {user.created_at > '2023-01-01' && user.is_paid === true
            && user.is_admin && <td>
                <button>Delete</button>
        </td>
        }
    </tr>;
}