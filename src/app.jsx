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
      resultPredictions: null, //hasil prediksi
      greatestMotif: null, //nama motif dengan prob tertinggi
      isLoading : 0, //0->False, 1->True, 3->Error server
      isErrUrl: false,
      errMessageUser: '',
      errMessageBackend: '',
      urlSearchImage: '' //url to image file

    };
    this.handleInputImage = this.handleInputImage.bind(this);
    this.handlePredictButton = this.handlePredictButton.bind(this);
    this.handleInputURL = this.handleInputURL.bind(this);
    this.handleUrlButton = this.handleUrlButton.bind(this);
  }

  handleInputImage = (e) =>{
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file);
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

  handleInputURL = (e) => {
    e.preventDefault();
    this.setState({ urlSearchImage: e.target.value });
  }

  handleUrlButton = (e) => {
    e.preventDefault();
    axios({
      url: this.state.urlSearchImage,
      method: 'GET',
      responseType: 'arraybuffer',
      crossdomain: true
    })
    .then(resp => {
      var arrayBufferView = new Uint8Array( resp.data );
      var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      var imageFile = new File([blob], "imageFromInternet", {type: "image/jpeg"})
      console.log(imageFile)

      const base64image = btoa(
        new Uint8Array(resp.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      this.setState({
        resultPredictions: null,
        previewImageUrl: "data:;base64," + base64image,
        errMessageUser: '',
        isErrUrl: false,
        imageFile: imageFile
      });
    }).catch(err => {
      this.setState({
        previewImageUrl: start_image,
        isErrUrl: true,
        errMessageUser: 'Maaf url ini tidak bisa diakses. silahkan unduh gambar terlebih dahulu'
      });
      console.log('my error: ', err);
    })
  }

  handlePredictButton = (e) => {
    e.preventDefault();

    document.getElementById('urlToImageId').value = '';

    this.setState({
      isLoading: 1
    });
    const urlPredict = `http://server/batik/api/predict/`;

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
        resultPredictions : _result,
        errMessageBackend: '',
        isErrUrl: false
      });

    }).catch(err => {
      this.setState({
        isLoading: 3,
        isErrUrl: false,
        errMessageBackend: 'Something is Wrong. try Again Later',
        imageFile: null
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



            <p style={{textAlign: 'center'}}>atau melalui url:</p>
          <div className='input-url-div'>
            <input
                   type="url"
                   id="urlToImageId"
                   placeholder='image url'
                   onChange={this.handleInputURL}>
                 </input>
             <button
                 onClick={this.handleUrlButton}>
               <i className="fa fa-search"></i>
             </button>
          </div>

          {this.state.isErrUrl === true &&
            <p style={{color: '#69140e',textAlign: 'center'}}>{this.state.errMessageUser}</p>}

          <div className='button-div'>
            {this.state.isLoading === 3 &&
              <p style={{color: '#69140e',textAlign: 'center'}}>{this.state.errMessageBackend}</p>}

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
