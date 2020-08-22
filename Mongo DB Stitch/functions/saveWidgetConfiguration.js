exports = async function(args) {
  let screenUrl = args.screenUrl;
  let user_id = context.user.id;
  
  if(args.userId && args.userId != '') {
    const result = await context.functions.execute("CheckIfAdmin", user_id);
    if(result.success == false)
      return result;
    
    user_id = args.userId;
    
    const clientResult = await context.functions.execute("CheckIfUserHasScreenPermission", user_id, screenUrl);
  
    if(clientResult.success == false)
      return clientResult;
    
    args.user = clientResult.user;
  } else {
    const result = await context.functions.execute("CheckIfUserHasScreenPermission", user_id, screenUrl);
    if(result.success == false)
      return result;
      
    args.user = result.user;
  }
  
  const config = context.values.get('Configuration');
  const mongodb = context.services.get('mongodb-atlas');
  
  
  let data;
  let updateObject = {
    $set: {
      "ModifiedBy": context.user.id,
      "ModifiedOn": new Date()
    }
  };
  
  if(args.configurationMode == true) {
    const companyWidgetsCollection = mongodb.db(config.database).collection('company_widgets');
    
    updateObject["$set"]["WidgetTitle"] = args.WidgetTitle;
    updateObject = { 
      $set: {
        "WidgetTitle": args.WidgetTitle
      }
    };
    data = await companyWidgetsCollection.updateOne({ _id: args._id }, updateObject );
  } else {
    const userWidgetsCollection = mongodb.db(config.database).collection('user_widgets');
    
    updateObject["$set"]["Widgets.$.WidgetTitle"] = args.WidgetTitle;
    
    if(args.IsCustomWidgetSettings) {
      updateObject["$set"]["Widgets.$.CustomWidgetSettings"] = args.CustomWidgetSettings;
    } else {
      updateObject["$unset"] = {};
      updateObject["$unset"]["Widgets.$.CustomWidgetSettings"] = 1;
    }
    
    data = await userWidgetsCollection.updateOne({ _id: args._id, "Widgets._id": args.UserWidgetId }, updateObject );
  }
  
  return { success: true, message: null};
  
  
};