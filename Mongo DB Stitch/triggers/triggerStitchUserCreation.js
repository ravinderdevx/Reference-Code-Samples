exports = function(authEvent) {
   const config = context.values.get('Configuration');

  const mongodb = context.services.get('mongodb-atlas');
  const dbcontext = mongodb.db(config.database);
  const userCollection = dbcontext.collection('users');
  
  const { user, time } = authEvent;
  const newUser = { ...user, eventLog: [ { "created": time } ] };
  
  userCollection.updateOne({ Email: newUser.data.email }, { $set: { UserId: newUser.id, Active: true, ModifiedOn: new Date() }, $unset: {ForceResetPassword:1} });

};
