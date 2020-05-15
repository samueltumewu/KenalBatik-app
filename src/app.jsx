import React from 'react';
import './index.css';
import start_image from './image/placeholder-1.png';
const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImageUrl: start_image,
      imageFile: null
    };
    this.handleInputImage = this.handleInputImage.bind(this);
  }

  handleInputImage = (e) =>{
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
       this.setState({
         previewImageUrl: reader.result,
         imageFile: file
       });
    }
    reader.readAsDataURL(file)
  }

  handlePredictButton = (e) => {
    const urlPredict = `http://0.0.0.0:5000/predict`;

    const formData = new FormData();
    formData.append('image', this.state.imageFile);

    console.log(this.state.imageFile);
    console.log(urlPredict);
    console.log(formData);

    axios.post(urlPredict, formData)
    .then(resp => {
      console.log(resp);
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
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

      </div>
    );
  }
}

export default App;
