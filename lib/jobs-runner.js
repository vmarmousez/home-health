const logger = require("./logger");

const intervals = [];

module.exports = {
  run: jobs => {
    jobs.forEach(job => {
      intervals.push(
        setInterval(async () => {
          try {
            const value = await job.getValue();
            await job.storeValue(value);
            logger.info({ message: `Stored value ${value}`, job: job.name });
          } catch (error) {
            logger.error({
              message: "Error getting/storing value",
              error,
              job: job.name
            });
          }
        }, job.interval)
      );
    });
  },

  clear: () => intervals.forEach(clearInterval)
};
