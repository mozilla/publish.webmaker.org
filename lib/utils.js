'use strict';

// General purpose utility functions

function isDate(val) {
  return val instanceof Date;
}

var dateTracker = {
  isDate: isDate,
  formatDatesInModel: function(model) {
    if (typeof model === `object`) {
      // Have to do this because of this bug: https://github.com/tgriesser/bookshelf/issues/668
      if (model.date_created) {
        model._date_created = model.date_created;
        delete model.date_created;
      }
      if (model.date_updated) {
        model._date_updated = model.date_updated;
        delete model.date_updated;
      }
    }

    return model;
  },
  parseDatesInModel: function(model) {
    if (typeof model === `object`) {
      if (typeof model._date_created !== `undefined`) {
        model.date_created = model._date_created;
        delete model._date_created;
      }
      if (typeof model._date_updated !== `undefined`) {
        model.date_updated = model._date_updated;
        delete model._date_updated;
      }
    }

    return model;
  },
  // `isModel` indicates whether the data passed in is a Bookshelf model or not
  convertToISOStrings: function(isModel) {
    return function(data) {
      var created = isModel ? data.get(`date_created`) : data.date_created;
      var updated = isModel ? data.get(`date_updated`) : data.date_updated;

      if (isDate(created)) {
        if (isModel) {
          data.set(`date_created`, created.toISOString());
        } else {
          data.date_created = created.toISOString();
        }
      }

      if (isDate(updated)) {
        if (isModel) {
          data.set(`date_updated`, updated.toISOString());
        } else {
          data.date_updated = updated.toISOString();
        }
      }

      return data;
    };
  }
};

module.exports = {
  dateTracker: dateTracker
};
