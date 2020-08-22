exports = async function(email) {
  const user_id = context.user.id;
    
  const config = context.values.get('Configuration');
  const messages = context.values.get('Messages');

  const mongodb = context.services.get('mongodb-atlas');
  const dbcontext = mongodb.db(config.database);
  const userCollection = dbcontext.collection('users');

  const user = await userCollection.findOne({Email: email, Active: true, RecordDeleted: false});
  
  if(!user)
    return { success: false, message: messages.error.USER_NOT_FOUND};
    
  
  if(!user.UserId) {
    await userCollection.updateOne({ Email: email }, { $set: { UserId: user_id, ModifiedBy: user_id, ModifiedOn: new Date() } });
  }
  
  if(!(user.SuperAdmin == true || user.Admin == true)) {
    const companiesCollection = dbcontext.collection('companies'); 
    const servicesCollection = dbcontext.collection('services');
    const companyDetails =  await companiesCollection.findOne({_id: user.CompanyId, Active: true, RecordDeleted: false});

    if(!companyDetails)
      return { success: false, message: messages.error.COMPANY_NOT_FOUND };
    
    user.CompanyName = companyDetails.CompanyName;
    if(user.CompanyAdmin) {
      user.Screens = await context.functions.execute("privateGetCompanyScreensServices", { ServiceIds: companyDetails.ServiceIds });
      user.Services = await servicesCollection.find({ _id: { $in:companyDetails.ServiceIds }}, {_id: 1, ServiceName: 1}).toArray();
    } else {
      let services = [];
      user.ScreenPermissions.map((screen) => {
        if(screen.ServiceIds)
          services = services.concat(screen.ServiceIds);
      });
      
      user.Screens = await context.functions.execute("privateGetCompanyUserScreens", { ScreensIds: user.ScreenPermissions.map(x => x.ScreenId) });
      user.Services = await servicesCollection.find({ _id: { $in: services }}, {_id: 1, ServiceName: 1}).toArray();
      
    }
    user.Locations = await context.functions.execute("privateGetCompanyUserLocations", { user: user, Database: companyDetails.Database });
  }
  
  return { success: true, data: user };
};