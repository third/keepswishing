var mongoose = require('mongoose')
  , Schema = mongoose.Schema

/**
 * Counnter is a generic collection that generates auto-incremented number 
 * based on a given group.
 * @type {Schema}
 */
var CounterSchema = new Schema({
  _id: {type: String, required: true, unique: true, lowercase: true},
  seq: { type: Number, required: true }
})



/**
 * Generates an auto-incremented number for a given group. Group is something that you need to decide 
 * but is usually the collection name. Say you have employeeId on employees collection, group should
 * be the collection name (i.e. 'employees'). Or say employeeId is grouped by department, group can be
 * 'employees.[departmentId]' (e.g. 'employess.523d4ba37ad9ad5a19000001'). Or say you have invoices 
 * collection that has an invoice number that resets every year, group can be 'invoices.[year]' 
 * (e.g. invoices.2013).
 * @param  {String}   group   Group to be incremented. Usually the collection name (e.g. 'employees'). 
 * @param  {Function} next    Callback function
 * @return {Function}         Returns asynchronously
 */
CounterSchema.static('nextNumber', function(group, next) {
    group = group.toString().toLowerCase();
    this.findOneAndUpdate({_id: group}, {$inc: { seq: 1 }}, {upsert: true}, function(err, doc) {
      var result = 0;

      if(doc) {
        result = doc.seq;
      }

      next(err, result);
    });
});



var Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;