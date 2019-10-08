const config = require("./config");
const Influx = require("influx");

const writeFactory = (measurement, room) => {
  const influx = new Influx.InfluxDB({
    host: config.influxDb.host,
    database: config.influxDb.database,
    schema: [
      {
        measurement,
        fields: {
          value: Influx.FieldType.INTEGER
        },
        tags: ["room"]
      }
    ]
  });

  return {
    write: value =>
      influx.writePoints([
        {
          measurement,
          tags: {
            room
          },
          fields: {
            value
          }
        }
      ])
  };
};

module.exports = {
  writeFactory
};
