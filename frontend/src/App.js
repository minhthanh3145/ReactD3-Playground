import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './components/Header';
import Upload from './components/Upload';
import Home from "./components/Home";
import Playground from "./components/Playground/Playground";
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const BannerLink = styled(Link)`
  text-align: center;
  text-decoration: none;
  color: black;
  &:hover {
    text-decoration: none;
    color: red;
    cursor: pointer;
  }
}
`;

const Banner = styled.h1`
  background: white;
  margin: 0;
  text-align: center;
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.bannerLink = React.createRef();
  }

  onBannerLinkClicked() {
    console.log("Clicked");
  }

  render() {
    return (
        <div>
          <BrowserRouter>
            <Banner>
              <BannerLink to="/"> React + D3.js </BannerLink>
            </Banner>
            <Header />
            <Route exact path="/" component={Home} />
            <Route path="/playground" component={Playground} />
            <Route path="/upload" component={Upload} />
          </BrowserRouter>
        </div>
    );
  }
}

export default App;
