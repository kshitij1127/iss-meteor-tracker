import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Platform,
  Image
} from "react-native";
import axios from "axios";

export default class MeteorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meteors: [],
    };
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    let meteor = item;
    let bgimg, speed, size;
    if (meteor.threat_score <= 30) {
      bgimg = require("../assets/meteor_bg1.png");
      speed = require("../assets/meteor_speed3.gif");
      size = 100;
    } else if (meteor.threat_score <= 75) {
      bgimg = require("../assets/meteor_bg2.png");
      speed = require("../assets/meteor_speed2.gif");
      size = 150;
    } else {
      bgimg = require("../assets/meteor_bg3.png");
      speed = require("../assets/meteor_speed1.gif");
      size = 200;
    }

    return (
      <View>
        <ImageBackground source={bgimg} style={styles.backgroundImage}>
          <View style={styles.gifContainer}>
            <Image source={speed} />
          </View>
          <View>
            <Text style={[styles.cardTitle, { marginTop: 40, marginLeft: 50 }]}>
              {item.name}
            </Text>
            <Text style={[styles.cardText, { marginTop: 20, marginLeft: 50 }]}>
              closes to earth:
              {item.close_approach_data[0].close_approach_date_full}
            </Text>
            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
              minimum diameter:
              {item.estimated_diameter.kilometers.estimated_diameter_min}
            </Text>
            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
              maximum diameter:
              {item.estimated_diameter.kilometers.estimated_diameter_max}
            </Text>
            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
              velocity:
              {item.close_approach_data[0].relative_velocity.km_per_hour}
            </Text>
            <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
              missing earth by:
              {item.close_approach_data[0].miss_distance.kilometers}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  getMeteors = () => {
    axios
      .get(
        "https://api.nasa.gov/neo/rest/v1/feed?start_date=2019-09-07&end_date=2019-09-08&api_key=drmljnuVEkk1Ccy8WUdUWwOxiw7Xbyt0Fs4SYFiC"
      )
      .then((response) => {
        console.log(response);
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => {
        console.log(error);
        alert("Error: " + error.message);
      });
  };

  componentDidMount() {
    this.getMeteors();
  }

  render() {
    if (Object.keys(this.state.meteors).length === 0) {
      // returns all keys of the object
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading...</Text>
        </View>
      );
    } else {
      let meteor_array = Object.keys(this.state.meteors).map((meteor_date) => {
        return this.state.meteors[meteor_date];
      });

      let meteors = [].concat.apply([], meteor_array);
      meteors.forEach(function (element) {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        let threatscore =
          (diameter / element.close_approach_data[0].miss_distance.kilometers) *
          1000000000;
        element.threat_score = threatscore;
      });

      meteors.sort(function (a, b) {
        return b.threat_score - a.threat_score;
      });

      meteors = meteors.slice(0, 5);

      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <FlatList
            keyExtractor={this.keyExtractor}
            data={meteors}
            renderItem={this.renderItem}
            horizontal={true}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  titleBar: { flex: 0.15, justifyContent: "center", alignItems: "center" },
  titleText: { fontSize: 30, fontWeight: "bold", color: "white" },
  meteorContainer: { flex: 0.85 },
  listContainer: {
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "white",
  },
  cardText: { color: "white" },
  threatDetector: {
    height: 10,
    marginBottom: 10,
  },
  gifContainer: { justifyContent: "center", alignItems: "center", flex: 1 },
  meteorDataContainer: { justifyContent: "center", alignItems: "center" },
});

// api key : drmljnuVEkk1Ccy8WUdUWwOxiw7Xbyt0Fs4SYFiC
