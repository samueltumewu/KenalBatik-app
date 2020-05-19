import React from 'react';
import './table-style.css';
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

  return [
    <div id="result-table-container">
      <h1>Motif: {props.greatestMotif}</h1>
      <table className='result-table'>
      <thead>
        <tr>
          <th colSpan='2' id='table-header'>Tabel Detil</th>
        </tr>
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
