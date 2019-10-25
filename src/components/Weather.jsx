import React, { Component } from "react";
import Block from "./Block";
import { Input, Icon, Button, Typography, Row, Col, AutoComplete } from "antd";
import 'antd/dist/antd.css';

const { Title } = Typography;

class Weather extends Component {
  constructor(s) {
    super(s);
    this.state = {
      cities: new Set(),
      newCity: "",
      query_cities: [],
      searches: []
    };
    this.handleCityChange = this.handleCityChange.bind(this);
    this.addCity = this.addCity.bind(this);
    this.removeCity = this.removeCity.bind(this);
    this.displayNew = this.displayNew.bind(this);
    this.onSelect = this.onSelect.bind(this, "");
  }
  componentDidUpdate() { }
  componentDidMount() {
    var cities = ["London", "Paris"];
    if (localStorage.getItem("cities"))
      cities = JSON.parse(localStorage.getItem("cities"));
    console.log(cities)
    this.setState({ cities: new Set(cities) })
  }

  async addCity(event) {
    var cities = this.state.cities;
    cities.add(this.state.newCity);
    var weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.state.newCity}&units=metric&appid=208c9640fa3d8834c726ef24b2f65578`
    );
    weather = weather.json();
    if ((weather.cod === "404")) {
      console.warn("Error: non-existent city. Try again.")
      return
    };
    this.setState({ cities: cities });
    localStorage.setItem("cities", JSON.stringify(Array.from(this.state.cities)));
  }
  async displayNew(city) {
    if (city.length > 0) {
      var query_cities = await fetch(`https://autocomplete.travelpayouts.com/places2?term=${city}&locale=en&types[]=city`);
      query_cities = await query_cities.json();
      this.setState({ query_cities });
    }
  }
  onSelect(event, value) {
    this.state.cities.add(value);
    localStorage.setItem("cities", JSON.stringify(Array.from(this.state.cities)))
    console.log('onSelect', value);
  }
  handleCityChange(event) {
    this.setState({ newCity: event });
    this.displayNew(event);
    console.log(this.state.query_cities)
  }
  onSearch = searchText => {
    this.setState({
      searches: !searchText ? [] : this.state.query_cities.map(q => `${q.name}, ${q.country_name}`),
    });
  };
  removeCity(city) {
    var cities = Array.from(this.state.cities).filter(c => c !== city);
    this.setState({ cities: new Set(cities) });
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(cities);
  }
  renderBlocks(city, rm) {
    return <Block city={city} rm={rm} />;
  }


  render() {
    return (
      <div>
        <Title level={3}>Add A City</Title>
        <AutoComplete
          className="global-search"
          size="large"
          style={{ width: '40%' }}
          dataSource={this.state.searches}
          onSelect={this.onSelect}
          value={this.state.newCity}
          onChange={this.handleCityChange}
          onSearch={this.onSearch}
          placeholder="Search Here"
          optionLabelProp="text"
        >
          <Input
            suffix={
              <Button
                className="search-btn"
                style={{ marginRight: -12 }}
                size="large"
                type="primary"
                onClick={this.addCity}
              >
                <Icon type="search" />
              </Button>
            }
          />
        </AutoComplete>
        <Title level={2} style={{ "marginTop": "20px" }}>Your Cities:</Title>
        <div className="locations" style={{ "margin": "16px" }}>
          <Row type="flex" justify="center" gutter={16}>
            {Array.from(this.state.cities).map(city => <Col xs={8} span={6} lg={4}>{this.renderBlocks(city, this.removeCity)}</Col>)}
          </Row>
        </div>
      </div >
    );
  }
}

export default Weather;
