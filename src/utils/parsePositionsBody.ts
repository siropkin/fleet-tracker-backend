interface Moment {
  at: number;
  lat: number;
  lon: number;
  dtf: number;
  pc: number;
  alt?: number;
  lap?: number;
}

function parsePositionsBody(
  buffer: ArrayBuffer,
): { id: number; moments: Moment[] }[] {
  let dataView = new DataView(buffer);
  let flags = dataView.getUint8(0);
  let hasAltitude = 1 === (1 & flags);
  let hasDtf = 2 === (2 & flags);
  let hasLap = 4 === (4 & flags);
  let hasPc = 8 === (8 & flags);
  let baseTime = dataView.getUint32(1);
  let offset = 5;
  let result = [];

  while (offset < buffer.byteLength) {
    let id = dataView.getUint16(offset);
    offset += 2;
    let momentsCount = dataView.getUint16(offset);
    let moments = new Array(momentsCount);
    offset += 2;
    let previousMoment: Moment = { at: 0, dtf: 0, lat: 0, lon: 0, pc: 0 };

    for (let i = 0; i < momentsCount; i++) {
      let momentFlags = dataView.getUint8(offset);
      let moment: Moment = { at: 0, dtf: 0, lat: 0, lon: 0, pc: 0 };

      if (128 === (128 & momentFlags)) {
        let deltaTime = dataView.getUint16(offset);
        offset += 2;
        let deltaLat = dataView.getInt16(offset);
        offset += 2;
        let deltaLon = dataView.getInt16(offset);
        offset += 2;

        if (hasAltitude) {
          moment.alt = dataView.getInt16(offset);
          offset += 2;
        }

        if (hasDtf) {
          let deltaDtf = dataView.getInt16(offset);
          offset += 2;
          moment.dtf = previousMoment.dtf + deltaDtf;

          if (hasLap) {
            moment.lap = dataView.getUint8(offset);
            offset++;
          }
        }

        if (hasPc) {
          moment.pc = dataView.getInt16(offset) / 32000;
          offset += 2;
        }

        deltaTime = 32767 & deltaTime;
        moment.lat = previousMoment.lat + deltaLat;
        moment.lon = previousMoment.lon + deltaLon;
        moment.at = previousMoment.at - deltaTime;
        moment.pc = previousMoment.pc + moment.pc;
      } else {
        let time = dataView.getUint32(offset);
        offset += 4;
        let lat = dataView.getInt32(offset);
        offset += 4;
        let lon = dataView.getInt32(offset);
        offset += 4;

        if (hasAltitude) {
          moment.alt = dataView.getInt16(offset);
          offset += 2;
        }

        if (hasDtf) {
          let dtf = dataView.getInt32(offset);
          offset += 4;
          moment.dtf = dtf;

          if (hasLap) {
            moment.lap = dataView.getUint8(offset);
            offset++;
          }
        }

        if (hasPc) {
          moment.pc = dataView.getInt32(offset) / 21000000;
          offset += 4;
        }

        moment.lat = lat;
        moment.lon = lon;
        moment.at = baseTime + time;
      }

      moments[i] = moment;
      previousMoment = moment;
    }

    moments.forEach(function (moment) {
      moment.lat /= 100000;
      moment.lon /= 100000;
    });

    result.push({
      id: id,
      moments: moments,
    });
  }

  return result;
}

export default parsePositionsBody;
