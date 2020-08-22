exports = async function(arg) {
  const config = context.values.get('Configuration');
  const mongodb = context.services.get('mongodb-atlas');
  const dbcontext = mongodb.db(config.database);
  const userWidgetsCollection = dbcontext.collection('user_widgets');
  
  let matchingObject = {};
  if(arg.userWidgetId && arg.userWidgetId != '') {
    matchingObject = { "Widgets._id": arg.userWidgetId };
  }
  
  return await userWidgetsCollection.aggregate([
    { $match: { ScreenId: arg.screenId, UserId: arg.userId } },
    { $unwind: "$Widgets"},
    { $match: matchingObject },
    //Do the lookup matching
    { $lookup: {
      from: "company_widgets",
      localField: "Widgets._id",
      foreignField: "_id",
      as: "CompanyWidgets"
    }},
    { $unwind: { path: "$CompanyWidgets", preserveNullAndEmptyArrays: true } },
    
    //Do the lookup matching
    { $lookup: {
      from: "widgets",
      localField: "Widgets.WidgetId",
      foreignField: "_id",
      as: "SystemWidgets"
    }},
    { $unwind: "$SystemWidgets" },
    {
      $project: {
        _id: "$_id",
        UserWidgetId: "$Widgets._id",
        WidgetComponentName: "$SystemWidgets.WidgetComponentName",
        ColumnWidth: "$SystemWidgets.ColumnWidth",
        WidgetTitle:{
          $cond: { 
            if: { $ne: [ { $ifNull: ["$Widgets.WidgetTitle", null] }, null ] }, then: "$Widgets.WidgetTitle", else: {
              $cond: { 
                if: { $ne: [ { $ifNull: ["$CompanyWidgets.WidgetTitle", null] }, null ] }, then: "$CompanyWidgets.WidgetTitle", 
                else: "$SystemWidgets.WidgetTitle"
              }
            }
          }
        },
        IsCustomWidgetSettings: {
          $cond: { 
            if: { $ne: [ { $ifNull: ["$Widgets.CustomWidgetSettings", null] },  null ] }, then: true, else: false
          }
        },
        CustomWidgetSettings: "$Widgets.CustomWidgetSettings",
        Order: {
          $cond: { 
            if: { $ne: [ { $ifNull: ["$Widgets.Order", null] },  null ] }, then: "$Widgets.Order", else: {
              $cond: { 
                if: { $ne: [ { $ifNull: ["$CompanyWidgets.Order", null] }, null ] }, then: "$CompanyWidgets.Order", 
                else: 9999
              }
            }
          }
        }
      }
    },
    { $sort : { Order : 1 } }
  ]).toArray();
};