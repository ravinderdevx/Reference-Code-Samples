exports = async function(arg) {
  const config = context.values.get('Configuration');
  const mongodb = context.services.get('mongodb-atlas');
  const dbcontext = mongodb.db(config.database);
  const screensCollection = dbcontext.collection('screens');
  
  return await screensCollection.aggregate([ 
    { $match: {ScreenUrl: arg.screenUrl} },
        { $unwind: "$AvailableWidgetIds" },
         // Do the lookup matching
        { $lookup: {
          from: "widgets",
          localField: "AvailableWidgetIds",
          foreignField: "_id",
          as: "Widget"
        }},
         { $unwind: "$Widget" },
         { 
           $match: { "Widget.Active": true, "Widget.RecordDeleted": false }
          },
         { $project: {
           _id: "$Widget._id",
           WidgetTitle: "$Widget.WidgetTitle",
           WidgetImageUrl: "$Widget.WidgetImageUrl",
           WidgetDescription: "$Widget.WidgetDescription"
         } },
         { $sort : { WidgetTitle : 1 } },
      ]).toArray();
};