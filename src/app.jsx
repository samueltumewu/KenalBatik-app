import React from 'react';
import ResultTable from './component/resultTable.jsx';
import './index.css';
import start_image from './image/placeholder-1.png';
const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImageUrl: start_image,
      imageFile: null,
      resultPredictions: null,
      greatestMotif: null
    };
    this.handleInputImage = this.handleInputImage.bind(this);
    this.handlePredictButton = this.handlePredictButton.bind(this);
  }

  handleInputImage = (e) =>{
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
       this.setState({
         previewImageUrl: reader.result,
         imageFile: file,
         resultPredictions: null
       });
    }
    reader.readAsDataURL(file)
  }

  handlePredictButton = (e) => {
    const urlPredict = `http://0.0.0.0:5000/predict`;

    const formData = new FormData();
    formData.append('image', this.state.imageFile);

    axios.post(urlPredict, formData)
    .then(resp => {
      console.log(resp.data.predictions)
      console.log(resp.data.greatestMotif)

      // fetch Label Motif with greatest prob value
      this.setState({
        greatestMotif: resp.data.greatestMotif
      });

      // fetch Predictions Label and its Prob
      const fetchData = resp.data.predictions;
      let _result = {};
      for (var object of fetchData) {
        _result[object.label] = object.prob.toFixed(2)
      }

      this.setState({
        resultPredictions : _result
      });

    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return [
      <div className="container">
          <h1 style={{color: "whitesmoke"}}>Submit your image</h1>

          <div className="avatar-upload">
              <div className="avatar-edit">
                  <input
                    type='file'
                    id="imageUpload"
                    accept=".png, .jpg, .jpeg"
                    onChange={this.handleInputImage}
                  />
                  <label htmlFor="imageUpload"></label>
              </div>
              <div className="avatar-preview">
                  <div id="imagePreview"
                      style={{ backgroundImage: `url(${this.state.previewImageUrl})` }}>
                  </div>
              </div>
          </div>

          <div className='button-div'>
            <button className='button-predict' onClick={this.handlePredictButton}>Predict</button>
          </div>

          <div>
            {this.state.resultPredictions != null &&
              <ResultTable predictions={this.state.resultPredictions}
                           greatestMotif={this.state.greatestMotif}/>
            }
          </div>

      </div>
    ]

  }
}

export default App;
