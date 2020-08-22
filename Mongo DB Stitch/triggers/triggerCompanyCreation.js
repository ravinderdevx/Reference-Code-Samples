exports = async function(insertEvent) {
  const config = context.values.get('Configuration');
 
  const mongodb = context.services.get('mongodb-atlas');
  const masterdbcontext = mongodb.db(config.database);
  const masterCompaniesCollection = masterdbcontext.collection('companies');
  const masterScreensCollection = masterdbcontext.collection('screens');
  const companyWidgetsCollection = masterdbcontext.collection('company_widgets');
  
  // Destructure out fields from the change stream event object
  const { fullDocument } = insertEvent;

  /* Create Random DB Name */
  const newCompanyId = fullDocument._id;
  const companyName = fullDocument.CompanyName;
  let companyDBName = companyName.replace(/-/g, ' ');
  companyDBName = companyDBName.replace(/ /g, '_');
  companyDBName = `${companyDBName.toLowerCase().substr(0, 13)}_${String(newCompanyId)}`;
  
  /* Update DB against Company ID */
  await masterCompaniesCollection.updateOne({_id: newCompanyId}, { $set: { Database: companyDBName } });
  
  /* Add Default Company Widgets */
  const screens = await masterScreensCollection.find({ ServiceIds: { $in: fullDocument.ServiceIds }}).toArray();
    
  const screenWidgets = [];
  screens.forEach(x => {
    x.DefaultWidgetIds.forEach((z, index) => {
      let screenWidget = {};
      screenWidget.ScreenId = x._id;
      screenWidget.CompanyId = newCompanyId;
      screenWidget.WidgetId = z;
      screenWidget.Order = index + 1;
      screenWidgets.push(screenWidget);
    });
  });
  
  await companyWidgetsCollection.insertMany(screenWidgets);
  
  const dbcontext = mongodb.db(companyDBName);;
  
  const locationGroup = {
    GroupName: fullDocument.CompanyName,
    CreatedBy: fullDocument.CreatedBy,
    CreatedOn: new Date(),
    ModifiedOn: new Date()
  };
  
  const companyLocationGroupCollection = dbcontext.collection('location_groups');
  await companyLocationGroupCollection.insertOne(locationGroup);
};