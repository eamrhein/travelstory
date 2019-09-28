import React from 'react';
import Panel from '../../panel/panel';

class ConditionalIndex extends React.Component {
  constructor(props){
    super(props)
    this.handleScroll = this.handleScroll.bind(this);

    this.state = {
      panels : []
    }
  }

  componentDidMount(){
    const { panelIdsToFetch, indexType } = this.props;
    this.loadedPanels = [];
    let panelIds; 
    if (this.props.ProfilePanels !== undefined){
      panelIds = this.props.ProfilePannels
    } else {
      panelIds = panelIdsToFetch
    }
    //fetch panels
    // add them to state
  
    if (panelIdsToFetch.length > 1 || indexType === 'Main'){

      this.props.fetchPanels(panelIds)
        .then(() => {
 
          this.loadedPanels = Object.keys(this.props.panels)
            //panel object threaded to panel component
            .map(id => <Panel panel={this.props.panels[id]} key={id} />)
          this.setState({ panels: this.state.panels.concat(this.loadedPanels.splice(0, 5)) })
        });
    }
   
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    // could make this a conditional 
    // check if the panels exist in the state, if they do add them to the state,
    // if they don't fetch them
    // currently clearing state to prevent overlab between the authored and liked panels
    this.props.clearPanelState();
  }

  handleScroll(){
    if (this.state.panels.length > 1){
      let lastPanel = document.querySelector('.panel-index').lastChild;
      let lastPanelOffset = lastPanel.offsetTop + lastPanel.clientHeight
      let containerOffset = window.innerHeight + window.pageYOffset;

      if (containerOffset > lastPanelOffset) {
        this.setState({ panels: this.state.panels.concat(this.loadedPanels.shift()) })
    }


    // Could be refactored to remove panels off the top as needed 
    // this.fetchPanels().then(() => {
    //   let panelsToAdd = this.props.panels
    //   this.state.panels.forEach(panel => {
    //     if (panelsToAdd[panel.id]){
    //       delete panelsToAdd[panel.id];
    //     }
    //   });
    //   this.setState({panels: this.state.panels.concat(panelsToAdd)})})
     } 

    // Optional upwards scrolling to remove peices
    //  slicing will in the initial if statement. 
    // else {
    //   this.setState({ panels: [dummyDiv1, dummyDiv2].concat(this.state.panels.slice(0, this.state.panels.length - 2)) })
    // }
  }


  render(){

    return (
      <div className='panel-index'>
        {this.state.panels}
        {/* {this.state.panels.length === 0 ? <div>{`${this.props.indexType} more panels!`}</div> : ''} */}
      </div>
    )
  } 
}

export default ConditionalIndex;

