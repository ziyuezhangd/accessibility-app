const cityofNY = {
  async getPedestrianRamps() {
    const result = await fetch(`https://data.cityofnewyork.us/resource/ufzp-rrqu.json?borough=1&$$app_token=${process.env.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // TODO: cant get the logger to work correctly - fixed: use logger.info()
    // logger.info(`${data}`);
    // Filter down to the data we care about
    const rampInfo = data.map((d) => ({
      latitude: d.the_geom.coordinates[1],
      longitude: d.the_geom.coordinates[0],
      width: d.ramp_width,
    }));

    return rampInfo;
  },

  async getPedestrianSignals() {
    const result = await fetch(`https://data.cityofnewyork.us/resource/de3m-c5p4.json?boroname=Manhattan&$$app_token=${process.env.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // TODO: cant get the logger to work correctly - fixed: use logger.info()
    // logger.info(`${data}`);
    // Filter down to the data we care about
    const signalInfo = data.map((d) => ({
      latitude: d.point_y,
      longitude: d.point_x,
    }));

    return signalInfo;
  },

  async getSeatingAreas() {
    const result = await fetch(`https://data.cityofnewyork.us/resource/esmy-s8q5.json?boroname=Manhattan&$$app_token=${process.env.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // TODO: cant get the logger to work correctly - fixed: use logger.info()
    // logger.info(`${data}`);
    // Filter down to the data we care about
    const seatingInfo = data.map((d) => ({
      seatType: d.asset_subtype,
      category: d.category,
      latitude: d.latitude,
      longitude: d.longitude,
    }));
        
    return seatingInfo;
  }
};

export default cityofNY;