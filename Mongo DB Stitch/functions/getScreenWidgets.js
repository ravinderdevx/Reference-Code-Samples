exports = async function(args) {
  
  let user_id = context.user.id;
  const screenUrl = args.screenUrl;
  
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
  const messages = context.values.get('Messages');
  const mongodb = context.services.get('mongodb-atlas');
  const screensCollection = mongodb.db(config.database).collection('screens');
    
  const screenDetails = await screensCollection.findOne({ScreenUrl: (args.configurationMode == true? args.configScreenUrl: screenUrl), Active: true, RecordDeleted: false });
  
  if(!screenDetails)
    return { success: false, message: messages.error.INVALID_REQUEST };
    
  
  let result = {};
  if(args.configurationMode == true)
    result.default_widgets = await context.functions.execute("privateGetCompanyScreenWidgets", { screenId: screenDetails._id, companyId: args.user.CompanyId });
  else
    result.default_widgets = await context.functions.execute("privateGetScreenWidgets", { screenId: screenDetails._id, userId: args.user._id });
    
  result.available_widgets = await context.functions.execute("privateGetAvailableScreenWidgets", { screenUrl: screenDetails.ScreenUrl, userId: args.user._id });
  
  return { success: true, data: result };
};