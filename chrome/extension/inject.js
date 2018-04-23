import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
import { Provider } from 'react-redux';
//import { loadResourcesThisPage } from './LoadResourcesThisPage';
import ResourcesThisPage from './ResourcesThisPage';




/** 1. Initiate the process, firing injectActions function, which inject InjectApp
 *  document.readyState can be odd for chrome extensions,
 *  sometimes being done before the addEventListener fires.
 *  Reread: https://stackoverflow.com/questions/588040/window-onload-vs-document-onload.
 *  @ToDo: Refactor, I think this sometimes runs twice, nbd.
 *  @ToDo: this won't work well on Facebook, where the document loads, and then javascript
 *  loads more text!
 */

console.log(window.window_name);
var windw = window.window_name;
if ( document.readyState == "complete" ||
      document.readyState == "interactive" ) {
  console.log("document ready already ***");
  injectActions();
} else {
  console.log("window addEventListener for load ***");
  window.addEventListener('load', injectActions());
}



function injectActions() {
  /** When window loads, search it for keyterms, then turn them into
   *  links class="keyterm" and set up the data store
   *  document readyState is complete
   *  window readyState is undefined
   **/
  // Don't Inject the extension's own popup
  if ( document.baseURI == "chrome-extension://jgokkghkbpkjknmigodgbiefmnkbplil/popup.html" ) { return; }

  const injectDOM = document.createElement('div');
  injectDOM.className = 'inject-react-guide';
  injectDOM.style.textAlign = 'center';
  document.body.appendChild(injectDOM);
  /** when is todoapp.js included, which brings the store? 
   *  Why two of these render statements into the DOM
   *  Ok, imitate todoapp store code.
   *  todoapp points at Root. Will that load the whole regular
   *  app? Is the point of todoapp.js to load the app when the button is
   *  clicked ... and I want to imitate that, without including the ToDo App?.
   /***/ 
  chrome.storage.local.get('state', (obj) => {
    const { state } = obj;
    const initialState = JSON.parse(state || '{}');

    const createStore = require('../../app/store/configureStore');
     /***/
    render(<InjectApp store={createStore(initialState)} />, injectDOM);
  });
}

/** InjectApp is a React component, which brings along the data store
 * that connects the inject script to our app
 * runs ResourcesThisPage.
 */
class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }

  /*
  buttonOnClick = () => {
    this.setState({ isVisible: !this.state.isVisible });
    console.log("toggling the window"); // have not seen this
  };
  */

// Seems like store = createStore is missing. Here also Root and App which work.
// Note: http://www.thegreatcodeadventure.com/react-redux-tutorial-part-iii-async-redux/
//  encourages creating the store here... it seems to be just props here, or has
//  createStore been called ... and then having the store call the functions to load
//  data. store.dispatch(loadCats());


  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <div>
        <Provider store={store}>
          <ResourcesThisPage/>
        </Provider>
      </div>
    );
  }
}
