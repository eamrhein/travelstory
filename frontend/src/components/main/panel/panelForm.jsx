import React from 'react';
import axios from 'axios';
class PanelForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      panel:{
        authorId: '',
        title: 'default state',
        panelText: '',
        photoURL: '',
        childId: [],
        parentId: null, 
        likes: 0
      },
      photoFile: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.photoReader = this.photoReader.bind(this);
  }

  componentDidMount(){
    if (this.props.formType === 'edit') {
      this.props.fetchPanel(this.props.match.params.panelId)
        .then(() => {
          this.setState({ panel: this.props.panels[this.props.match.params.panelId] })
        }) 
    } else if (this.props.formType === 'branch') {
      this.setState({panel: {parentId: this.props.match.params.panelId}})
    }
  }
  handleSubmit(e){
    e.preventDefault();
    const panel = this.state.panel;
    panel.authorId = this.props.currentUser.id;
    this.getSignedPhotoRequest(this.state.photoFile);
    this.props.action(panel)
      .then((panel)=> {
        // CHECK THIS
        this.props.history.push(`/panels/${panel.panel.data.id}`)});
    //Need logic to handle how we want behavior after action. 
  }
  handleChange(form){
    return(e) => {
      let pannelTochange = this.state.panel;
      pannelTochange[form] = e.target.value;
      this.setState({panel: pannelTochange});
    }
  }

  photoReader(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];
    reader.onloadend = () => this.setState({ photoURL: reader.result, photoFile: file });

    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.setState({ panel: {photoURL: ""}, photoFile: null });
    }
  }

  getSignedPhotoRequest(photo) {

    const res = axios.get(`/api/images?file-name=${photo.name}&file-type=${photo.type}`)
      .then( res => {
          console.log(res);
          const { signedRequest, url } = res.data;
          this.uploadFile(photo, signedRequest, url)
        },
        err => console.log(err)
      );
    // const xhr = new XMLHttpRequest();
    // //xhr.open('GET', `/images?file-name=${photo.name}&file-type=${photo.type}`);
    // xhr.open('GET', `/images`)
    // xhr.onreadystatechange = () => {
    //   debugger
    //   if (xhr.readyState === 4) {
    //     if (xhr.status === 200) {
    //       const response = JSON.parse(xhr.responseText);
    //       this.uploadFile(photo, response.signedRequest, response.url);
    //     }
    //     else {
    //       alert('Could not get signed URL.');
    //     }
    //   }
    // };
    // xhr.send();
    console.log(res);
  }

  uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('honk');
        }
        else {
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  render(){
    return (
    <form className='create-panel-form' onSubmit={this.handleSubmit}>
      <div className='panel-form-title'>{this.props.formType}</div>
      <label >
        Title
        <input type="text" onChange={this.handleChange('title')} value={this.state.panel.title}/>
      </label>
      {/* UNFINISHED FOR AWS */}
      <input id="file-input" type="file" onChange={this.photoReader} />
      {this.state.photoURL ? (<img src={this.state.photoURL} className="image-preview" />) : ""}
      {/* <label>
        Photo
      </label>
      <input onChange={e => this.setState({})}/> */}
      <label >
        Panel Text
        <textarea cols="30" rows="10" onChange={this.handleChange('panelText')} value={this.state.panel.panelText}></textarea>
      </label>

      <input type="submit" value={this.props.formType}/>
    </form>)
  }
}

export default PanelForm;

