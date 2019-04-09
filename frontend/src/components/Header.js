import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const Navigator = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const StyledLink = styled(Link)`
    margin: 0.5rem 1rem;
    text-decoration: none;
    color: white;
    &:hover {
        text-decoration: none;
        color: yellow;
    }
`;


class Header extends Component {

    render() {
        return (
            <Navigator>
                <StyledLink to="/"> Home </StyledLink>
                <StyledLink to="/playground"> Playground </StyledLink>
                <StyledLink to="/upload">  Upload </StyledLink>
            </Navigator>
        );
    }
}

export default Header;