const cityofNY = {
  SOCRATA_APP_KEY: process.env.SOCRATA_APP_KEY,
  CITYOFNEWYORK_URL: 'https://data.cityofnewyork.us/resource/',

  /**
   * @returns{Promise<Array<{latitude: number, longitude: number, width: string}>>}
   * API documentation: https://dev.socrata.com/foundry/data.cityofnewyork.us/ufzp-rrqu
   */
  async getPedestrianRamps() {
    const result = await fetch(`${this.CITYOFNEWYORK_URL}ufzp-rrqu.json?borough=1&$$app_token=${this.SOCRATA_APP_KEY}`);
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

  /**
   * @returns{Promise<Array<{latitude: number, longitude: number}>>}
   */
  async getPedestrianSignals() {
    const result = await fetch(`${this.CITYOFNEWYORK_URL}de3m-c5p4.json?boroname=Manhattan&$$app_token=${this.SOCRATA_APP_KEY}`);
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

  /**
   * @returns{Promise<Array<{seatType: string, category: string, latitude: string, longitude: string}>>}
   */
  async getSeatingAreas() {
    const result = await fetch(`${this.CITYOFNEWYORK_URL}esmy-s8q5.json?boroname=Manhattan&$$app_token=${this.SOCRATA_APP_KEY}`);
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
  },

  /**
   * @returns { Promise<Array<{
   *  name: string,
   *  status: string,
   *  hours: string,
   *  isAccessible: boolean,
   *  isFullyAccessible: boolean,
   *  isPartiallyAccessible: boolean,
   *  restroomType: string,
   *  hasChangingStations: boolean,
   *  url: string,
   *  latitude: string,
   *  longitude: string}>>}
   */
  async getPublicRestrooms() {
    const result = await fetch(`${this.CITYOFNEWYORK_URL}i7jb-7jku.json?$$app_token=${this.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // Filter down to the data we care about
    const restroomInfo = data.map((d) => ({
      name: d.facility_name,
      status: d.status,
      hours: d.hours_of_operation,
      isAccessible: d.accessibility === 'Fully Accessible' || d.accessibility === 'Partially Accessible',
      isFullyAccessible: d.accessibility === 'Fully Accessible',
      isPartiallyAccessible: d.accessibility === 'Partially Accessible',
      restroomType: d.restroom_type,
      hasChangingStations: d.changing_stations === 'Yes',
      url: d.website,
      latitude: d.latitude,
      longitude: d.longitude,
    }));

    return restroomInfo;
  },

  /**
   * @returns { Promise<Array<{
   *  name: string,
   *  status: string,
   *  hours: string,
   *  isAccessible: boolean,
   *  isFullyAccessible: boolean,
   *  isPartiallyAccessible: boolean,
   *  restroomType: string,
   *  hasChangingStations: boolean,
   *  url: string,
   *  latitude: string,
   *  longitude: string}>>}
   */
  async getAccessibleRestrooms(includePartiallyAccessible) {
    let filterString = '$where=accessibility = \'Fully Accessible\'';
    if (includePartiallyAccessible) {
      filterString += ' or accessibility = \'Partially Accessible\'';
    }
    const result = await fetch(`${this.CITYOFNEWYORK_URL}i7jb-7jku.json?${filterString}&$$app_token=${this.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // Filter down to the data we care about
    const restroomInfo = data.map((d) => ({
      name: d.facility_name,
      status: d.status,
      hours: d.hours_of_operation,
      isAccessible: d.accessibility === 'Fully Accessible' || d.accessibility === 'Partially Accessible',
      isFullyAccessible: d.accessibility === 'Fully Accessible',
      isPartiallyAccessible: d.accessibility === 'Partially Accessible',
      restroomType: d.restroom_type,
      hasChangingStations: d.changing_stations === 'Yes',
      url: d.website,
      latitude: d.latitude,
      longitude: d.longitude,
    }));

    return restroomInfo;
  },
};

export default cityofNY;
