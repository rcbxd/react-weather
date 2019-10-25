import React, { Component } from "react";
import { Card, Icon, Avatar } from 'antd';
import 'antd/dist/antd.css';
import { thisExpression } from "babel-types";

const { Meta } = Card;

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: {},
    };
    this.removeCity = this.removeCity.bind(this);
  }
  async componentDidMount() {
    var weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.props.city}&units=metric&appid=208c9640fa3d8834c726ef24b2f65578`
    );
    weather = await weather.json();
    console.log(weather)
    this.setState({ weather: weather.weather[0] })
  }

  removeCity() {
    this.props.rm(this.props.city);
  }

  render() {
    return (
      <Card
        cover={
          <img
            alt="example"
            src={`https://openweathermap.org/img/wn/${this.state.weather.icon}@2x.png`}
            style={{
              "transform": "scale(0.35)",
            }}
          />
        }
        actions={[
          <Icon type="delete" key="delete" onClick={this.removeCity} />,
          <Icon type="more" key="details" />,
        ]}
      >
        <Meta
          title={this.props.city}
          description={this.state.weather.description}
        />
      </Card>
    );
  }
}

export default Block;
