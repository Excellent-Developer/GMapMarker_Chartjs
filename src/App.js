import React, { Component } from "react";
import { compose } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import Geocode from "react-geocode";
import { Bar } from "react-chartjs-2";

import arrangeCountryInfo from "./services/MapData";

Geocode.setApiKey("AIzaSyBAjdJr2k1xu8VDmAi5ISmPkD2P9uvZCU0");
Geocode.enableDebug();

const mapProps = {
  center: {
    lat: 37.773972,
    lng: -122.431297,
  },
  zoom: 4,
  key: "AIzaSyAyPqAkq2s9Z75QzarTAQHSHTxaNnVDqeE",
};

const MapWithAMakredInfoWindow = compose(
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap defaultZoom={mapProps.zoom} defaultCenter={mapProps.center}>
    {props.countries.list.map((item, index) => {
      const sources = props.countries[item];
      const marker = {
        lat: sources.lat,
        lng: sources.lng,
      };

      const onClick = props.onClick.bind(this, index);
      const source = sources.sources[0];
      const dates = [];
      const datas = [];
      sources.sources.map((source) => {
        dates.push(source.Date);
        datas.push(source.Perc_lt_30ms);
      });
      const graphState = {
        labels: dates,
        datasets: [
          {
            label: "Rainfall",
            backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgba(0,0,0,1)",
            borderWidth: 2,
            data: datas,
          },
        ],
      };
      return (
        <Marker
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={onClick}
          onMouseOver={onClick}
          key={index}
        >
          {props.selectedMarker === index && (
            <InfoWindow onCloseClick={props.onClick.bind(this, false)}>
              <div style={{ width: "600px" }}>
                <Bar
                  data={graphState}
                  options={{
                    title: {
                      display: true,
                      text: sources.name,
                      fontSize: 20,
                    },
                    legend: {
                      display: true,
                      position: "right",
                    },
                  }}
                />
                <p>"Total Count": {source.TotalCount}</p>
                <p>"Date": {source.Date}</p>
                <p>"Perc_lt_30ms": {source.Perc_lt_30ms}</p>
                <p>"Perc_30ms_60ms": {source.Perc_30ms_60ms}</p>
                <p>"Perc_60ms_90ms": {source.Perc_60ms_90ms}</p>
                <p>"Perc_90ms_150ms": {source.Perc_90ms_150ms}</p>
                <p>"Perc_gt_150ms": {source.Perc_gt_150ms}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    })}
  </GoogleMap>
));

export default class ShelterMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarker: false,
      countries: arrangeCountryInfo(),
    };
  }

  handleClick = (index) => {
    this.setState({ selectedMarker: index });
  };

  render() {
    console.log(this.state.countries);
    return (
      <MapWithAMakredInfoWindow
        selectedMarker={this.state.selectedMarker}
        countries={this.state.countries}
        onClick={this.handleClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBAjdJr2k1xu8VDmAi5ISmPkD2P9uvZCU0&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}
