import React from 'react';
import PropTypes from 'prop-types';
import {ARRAY_MOTIF} from '../app.jsx';

const ResultTable = (props) => {
  let contentRows = []

  Object.keys(props.predictions)
    .forEach(function(key) {
      contentRows.push(
        <tr>
        <td>{key}</td>
        <td>{props.predictions[key]}</td>
        </tr>
      )
    }
  );

  console.log(contentRows);

  return [
    <div>
      <h1>Motif {props.greatestMotif}</h1>
      <table>
      <thead>
        <tr>
          <th>Motif</th>
          <th>Prob</th>
        </tr>
      </thead>
      <tbody>
        {contentRows}
      </tbody>
      </table>
    </div>
  ]
}

export default ResultTable;
