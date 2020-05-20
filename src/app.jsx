import React from 'react';
import ResultTable from './component/resultTable.jsx';
import LoadingSection from './component/loadingSection.jsx';
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
      greatestMotif: null,
      isLoading : 0 //0->False, 1->True, 2->Error runtime
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
         resultPredictions: null,
         isLoading: 0
       });
    }
    reader.readAsDataURL(file)
  }

  handlePredictButton = (e) => {
    this.setState({
      isLoading: 1
    });
    const urlPredict = `http://localhost:5000/predict`;

    const formData = new FormData();
    formData.append('image', this.state.imageFile);

    axios.post(urlPredict, formData)
    .then(resp => {
      //stop the loading indicator
      this.setState({
        isLoading: 0
      });

      console.log(resp.data.predictions)
      console.log(resp.data.greatestMotif)

      // fetch Predictions Label and its Prob
      const fetchData = resp.data.predictions;
      let _result = {};
      for (var object of fetchData) {
        _result[object.label] = object.prob.toFixed(2)
      }

      this.setState({
        greatestMotif: resp.data.greatestMotif,
        resultPredictions : _result
      });

    }).catch(err => {
      this.setState({
        isLoading: 3
      });
      console.log(err);
    })
  }

  render() {
    return [
      <div className="container">
          <h1>Kenal-Batik</h1>

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
          {/*92140cr*/}
          <div className='button-div'>
            {this.state.isLoading === 3 &&
              <h1 style={{color: '#69140e'}}>Something is Wrong. Try Again Later</h1>}

            <button className='button-predict'
                    onClick={this.handlePredictButton}
                    disabled={this.state.resultPredictions !== null}>
                    {this.state.resultPredictions !== null ?
                       'Hasil Prediksi' : 'Predict'}
            </button>
            {this.state.isLoading === 1 &&
              <LoadingSection/>}
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
