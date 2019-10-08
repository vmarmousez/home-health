process.env.INFLUXDB_HOST = "192.168.1.36";
process.env.INFLUXDB_DATABASE = "test";
const { writeFactory } = require("../../lib/influxdb");

test("success write", async () => {
  const { write } = writeFactory("humidity", "living");

  await write(12);
});
